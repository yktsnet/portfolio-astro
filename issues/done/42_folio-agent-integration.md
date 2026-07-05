## PR記録: feat: folio-agent 受付チャットボットを組み込む
issue: 42 (42_folio-agent-integration.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/74
Merged: d1b330277bca75ce7002d3bbf3521f43052917f3

## 変更内容

自作 OSS folio-agent（github.com/yktsnet/folio-agent）の利用者第1号として、受付チャットボットを本サイトに組み込む。あわせてウィジェットの開示リンク先となる「利用データの扱い」ページを作成した。

- **知識生成（ビルド時）**: `folio-agent.config.json` を新規作成。include はトップ・about・approach・impact・nfc-attendance・cat-feed-tracker。`package.json` の build スクリプトを `astro build && pagefind --site dist && folio-agent-ingest folio-agent.config.json dist/knowledge.json` に拡張した。
  - `trading-system.astro` は `prerender = false`（SSR）で静的 HTML を出力しないため、ingest の走査対象（dist の `.html`）に含まれない。include には当初含めていたが、動作確認の結果を踏まえて除外した。
- **チャットエンドポイント（`/api/chat`）**: Astro Cloudflare アダプタが build 中に Worker をバンドルするため、build 後に生成される knowledge.json を直接 import できない。そこで `src/lib/api.ts` の `POST /api/chat` が初回リクエスト時に `env.ASSETS.fetch` で自サイトの `/knowledge.json` を取得し、モジュールスコープにキャッシュする方式にした（失敗時はキャッシュをリセットして次回リトライ）。`createChatHandler` / `createGeminiGenerator` をブリッジし、`contactUrl` は `https://ykts.net/contact/` を直書きした。
- **ウィジェット埋め込み**: 全ページ共通レイアウト `src/layouts/MainLayout.astro` に `<folio-agent-widget endpoint="/api/chat" policy-href="/data-policy/">` と `defineFolioAgentWidget()` を追加。
- **テーマ**: `src/styles/global.css` に6トークン（`--folio-agent-surface`/`text`/`muted`/`accent`/`accent-contrast`/`font`）を、既存の `--color-accent` と同じ `:root`/`.dark` 切り替えパターンで追加。
- **利用データの扱いページ**: `src/pages/data-policy.astro` を新規作成し、レート制限・ログ記録・Gemini無料枠の3点を明記（`contact.astro` の構成に準拠）。
- **wrangler 設定**: `wrangler.jsonc` に `d1_databases`（binding `DB`）を追加。`database_id` はプレースホルダー（`REPLACE_WITH_D1_DATABASE_ID`）とし、実IDは D1 データベース作成後に差し替える。

### 型上の判断（Issueの保留事項）

`createChatHandler` の型は `db: D1Database` を要求するが、`D1Database` は `@cloudflare/workers-types` のアンビエント型で、本リポにはこのパッケージへの参照が一切ない（既存の `api.ts` も `KVNamespace` 等を自前の最小構造型で扱う流儀）。`@cloudflare/workers-types` は追加せず、型をパッケージから導出する `type ChatDb = Parameters<typeof createChatHandler>[0]['db']` で対応した。`npm run typecheck`（`skipLibCheck: true`）で 0 errors を確認済み。

## 静的確認結果

- `npm run typecheck`: 0 errors（41 files, 12 hints は既存分）
- `npm run build`: 成功。`dist/knowledge.json` が生成され、6ページ（`/`, `/about`, `/approach`, `/impact`, `/nfc-attendance`, `/cat-feed-tracker`）分の本文が入っていることを目視確認（`estimatedTokens: 2207`, `warnings: []`）
- `npm run test`: 10 tests 全て pass（既存の `api.test.ts` に回帰なし。`/api/chat` は Issue の対象フィールドに含まれないためテスト追加は対象外とした）
- ビルド成果物を確認し、`<folio-agent-widget>` タグと `defineFolioAgentWidget()` を含むバンドルが各ページに出力されていること、CSS変数6トークンがライト/ダーク両方で解決されていることを確認した
- import・caller 整合性: `src/lib/api.ts` の `/api/chat` は `@folio-agent/handler` の `createChatHandler`/`createGeminiGenerator`/`KnowledgeDocument` を正しくインポートしている。`MainLayout.astro` は全ページ共通レイアウトとして機能しており、`ProfileLayout.astro` 経由の about/approach/impact ページにも波及することを確認した

```
$ git diff --name-only HEAD~1 HEAD
folio-agent.config.json
package-lock.json
package.json
src/layouts/MainLayout.astro
src/lib/api.ts
src/pages/data-policy.astro
src/styles/global.css
wrangler.jsonc
```

## 検証手順

1. D1 データベースを作成する: `wrangler d1 create ykts-folio-agent`
2. 出力された `database_id` を `wrangler.jsonc` の `d1_databases[0].database_id`（現在 `REPLACE_WITH_D1_DATABASE_ID`）に反映する
3. マイグレーションを適用する: `wrangler d1 migrations apply ykts-folio-agent --remote`（スキーマは folio-agent リポの `packages/handler/migrations/0001_init.sql`）
4. `GEMINI_API_KEY` を設定する: `wrangler secret put GEMINI_API_KEY`（モデルは既定の `gemini-3.1-flash-lite` のまま）
5. デプロイ後、サイト上でチャットウィジェットを開き、「考え方」「Works」「依頼・相談」の3経路の応答と、10分に4問目を送った際のレート制限超過メッセージを実際に確認する
6. `/data-policy/` ページの表示、およびウィジェットのライト/ダーク両テーマでの見た目を確認する
