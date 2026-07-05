## folio-agent（受付チャットボット）の組み込みと利用データの扱いページ
id: 42
branch-slug: folio-agent-integration
github_issue: 75
status: close
type: feat
対象: |
  package.json（依存追加・build スクリプトへの ingest 組み込み）
  folio-agent.config.json (新規)
  src/lib/api.ts（POST /api/chat の追加）
  src/layouts/ 配下の全ページ共通レイアウト（ウィジェット埋め込み）
  src/pages/data-policy.astro (新規)
  src/styles/global.css（ウィジェットのテーマトークン上書き）
  wrangler 設定ファイル（D1 バインディング。ファイルの有無は要確認、無ければ Pages ダッシュボード設定として検証手順に記載）
内容: |
  自作 OSS folio-agent（github.com/yktsnet/folio-agent）の利用者第1号として、
  受付チャットボットを本サイトに組み込む。あわせてウィジェットの開示リンク先となる
  「利用データの扱い」ページを作る。
確認: |
  npm run typecheck と npm run build（ingest を含む一連のビルド）が通ること。
  knowledge.json が dist に含まれ、include したページの本文が入っていることを目視確認。

---

### 前提

- `@folio-agent/widget` / `@folio-agent/handler` が npm に公開されていること（未公開の間は着手しない）。
- 使い方の正は folio-agent リポの README（Usage / API）。設計判断は同 README の Design Decisions。

### 1. 知識生成（ビルド時）

- `folio-agent.config.json` を新規作成。`distDir: "dist"`、include はトップ・Works 詳細・about・approach・impact あたりを起点に、ブログ記事（/posts/**）は初回は含めない（トークン量を見てから判断）。
- `npm run build` を「astro build（+pagefind）→ folio-agent-ingest → knowledge.json を dist へ配置」の順に拡張する。
- Zenn 取り込み（`IngestConfig.zenn`）は本 Issue では使わない（Zenn リポとのパス連携が絡むため別 Issue）。

### 2. チャットエンドポイント（/api/chat）

順序問題: Astro Cloudflare アダプタは build 中に Worker（dist/_worker.js）をバンドルするため、build 後に生成される knowledge.json を Worker から import できない。次の方式で解決する:

- knowledge.json は dist に静的アセットとして置き、`src/lib/api.ts` の `POST /api/chat` ハンドラが初回リクエスト時に `env.ASSETS.fetch` で自サイトの `/knowledge.json` を読み、モジュールスコープにキャッシュする。
- knowledge.json が URL で取得可能になるが、folio-agent の設計原則（LLM のコンテキストに渡した知識は公開扱い）の範囲内なので問題ない。include するページは公開ページのみとする。
- ハンドラは `createChatHandler({ db, generateAnswer: createGeminiGenerator({ apiKey, knowledge, contactUrl }) })` を Hono ルートにブリッジする。`contactUrl` は本サイトの Contact ページを指す（コード内は実値でよい）。
- D1 は `DB` バインディング。スキーマは folio-agent リポの `packages/handler/migrations/0001_init.sql` を適用する（適用コマンドは検証手順に記載し user が実施）。

### 3. ウィジェット埋め込み

- 全ページ共通レイアウトに `<folio-agent-widget endpoint="/api/chat" policy-href="/data-policy/">` と `defineFolioAgentWidget()` の script を追加。
- テーマは CSS カスタムプロパティ6トークン（`--folio-agent-surface` / `text` / `muted` / `accent` / `accent-contrast` / `font`）を `src/styles/global.css` で本サイトのパレットにマップする。ライト/ダーク両モードで追従すること。

### 4. 利用データの扱いページ（/data-policy/）

`src/pages/data-policy.astro` を新規作成。既存の静的ページ（contact.astro 等）の構成に合わせ、以下の3点を明記する:

1. IP アドレス単位のレート制限（10分3問・1日10回）を行っていること
2. 入力内容と応答をログとして記録し、品質改善に利用すること
3. 回答生成に Gemini API の無料枠を使っており、入力が学習に利用され得ること

### 検証手順（user 実施）に含めるべき項目

- D1 データベースの作成と Pages プロジェクトへの `DB` バインディング追加
- マイグレーション適用コマンド
- `GEMINI_API_KEY` の設定（`wrangler secret put`。モデルは既定の gemini-3.1-flash-lite のまま）
- デプロイ後、チャットで「考え方・Works・依頼」の3経路と超過時メッセージを実際に確認する手順
