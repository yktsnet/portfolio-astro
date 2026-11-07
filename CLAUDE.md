# CLAUDE.md

@context/conventions.md
@context/structure.md

## コマンド

```bash
npm run dev        # ローカル開発サーバー起動（http://localhost:4321）
npm run build      # ビルド（astro build + folio-agent-ingest で knowledge.json 生成）
npm run typecheck  # Astro / TypeScript 型チェック
npm run test       # Vitest でテスト一括実行
npm run test:watch # Vitest ウォッチモード
npm run sync-zenn  # Zenn 記事のスナップショット取得（zenn-snapshot.json）
npm run sync-github # GitHub の README のスナップショット取得（github-snapshot.json）。build の後に実行
```

単一テストを実行する場合:

```bash
npx vitest run src/lib/api.test.ts
```

## 検証手段

PR 前に `npm run typecheck` と `npm run test` を通す。実行確認が必要な検証は PR の `## 検証手順` に書いて user に委ねる。

## アーキテクチャの要点

### ページ描画とデータの流れ

`src/data/services.ts` がトップページの Services 節と `/services/<slug>/` の詳細ページのデータソース。サービスと、その中で提供できること・考え方・導入事例の追加・変更はここだけを触れば反映される。サービスごとの簡易図は `src/components/services/Diagram*.astro` に SVG で直書きしている。

トップページの Hero・Services・About の各節は `src/pages/index.astro` に直書きしている。About の節の年表と技術の範囲は `src/components/Career.astro` にある。`/about` はトップの About の節へ転送する。

### アイコンシステム

**Lucide アイコン**（サービスのアイコン、ナビゲーション等）:
- `src/lib/lucide.ts` に SVG パスを手動で列挙した独自サブセット
- 新しいアイコンを使う際は同ファイルにエントリを追加する（npm package は使わない）

**ブランドアイコン**（Career の技術表示に使う色付きロゴ）:
- `src/lib/brand-icons.ts` で `simple-icons` から必要なものだけ re-export
- 新しいブランドを追加する際は同ファイルに追記する

### 多言語

日英の両方を HTML に出し、`<html data-lang>` に応じて CSS（`global.css`）が片方を隠す。言語の初期値は `MainLayout.astro` が `localStorage` とブラウザの言語から決め、`LangToggle.astro` が切り替える。

- コンポーネントに直書きする文言は `<span class="lang-ja">` と `<span class="lang-en">` を並べる
- `src/data/` のデータに持たせる文言は `MultilingualText`（`src/lib/i18n.ts`）で `{ ja, en }` の両方を持ち、描画側で同じ2つの span に展開する

### API レイヤー

Hono アプリを `src/lib/api.ts` に定義し、`src/pages/api/[...route].ts` がブリッジする。
Edge Functions として動作するため `prerender = false` を設定済み。
Cloudflare バインディング（KV・シークレット）は `c.env` 経由でのみアクセスする。
