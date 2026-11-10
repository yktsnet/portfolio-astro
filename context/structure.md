# structure.md

## ディレクトリ構成

```
src/
  assets/
    photos/       # フォトギャラリー用 (.webp)。ビルド時に寸法取得・リサイズする
  components/     # 再利用可能なAstroコンポーネント。ページをまたいで使うものは直下に置く
    diagram/      # SVG の図の部品（文字・箱・段の見出し）
    services/     # サービスのページとトップのサービスのカードで使う部品
    workflow/     # 開発の進め方のページで使う部品
  data/           # 静的データとページの文言 (services.ts / works.ts / operations.ts / workflow.ts など)
  layouts/        # ページレイアウト
  lib/            # ユーティリティ・APIロジック・i18n
  pages/          # ルーティング (Astroファイル構造に対応)
    api/          # Edge Functions (Hono, prerender = false)
  styles/         # グローバルCSS
```

## ルーティング

`src/pages/` のファイル構造がそのままパスになる。`/api/*` を除き全て静的出力。

サービスの詳細ページ `/services/operations/` と `/services/ai-development/` は、それぞれ専用の `.astro` ファイルで個別に組んでいる。

## データフロー

- サービス・Works・写真は `src/data/*.ts`
- サービスの詳細ページの文言は `src/data/<slug>.ts`（`operations.ts`・`ai-development.ts`）。組みは `src/pages/services/<slug>.astro`
- 開発の進め方のページ（`/services/ai-development/workflow/`）の文言は `src/data/workflow.ts`。図は `DevDiagram.astro` に直書き
- トップページの各節は `src/pages/index.astro` に直書き
- 経歴の年表と技術の範囲は `Career.astro` に直書き

## APIエンドポイント

`src/lib/api.ts` にHonoアプリを定義。`src/pages/api/[...route].ts` がブリッジする。

| エンドポイント | 役割 |
|---|---|
| `POST /api/contact` | Turnstile検証 → Telegramへ転送 |
| `POST /api/chat` | folio-agent のチャット応答 |

## 静的アセット

```
public/
  images/
    profile/      # プロフィール画像
```
