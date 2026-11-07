# structure.md

## ディレクトリ構成

```
src/
  assets/
    photos/       # フォトギャラリー用 (.webp)。ビルド時に寸法取得・リサイズする
  components/     # 再利用可能なAstro/Reactコンポーネント
  data/           # 静的データ (services.ts / photos.ts)
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

- サービス・写真は `src/data/*.ts`
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
