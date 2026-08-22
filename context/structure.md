# structure.md

## ディレクトリ構成

```
src/
  components/     # 再利用可能なAstro/Reactコンポーネント
  data/           # 静的データ (works.ts / photos.ts)
  layouts/        # ページレイアウト
  lib/            # ユーティリティ・APIロジック・i18n
  pages/          # ルーティング (Astroファイル構造に対応)
    api/          # Edge Functions (Hono, prerender = false)
  styles/         # グローバルCSS
  utils/          # ヘルパー関数
```

## ルーティング

`src/pages/` のファイル構造がそのままパスになる。`/api/*` を除き全て静的出力。

## データフロー

- Works・写真は `src/data/*.ts`
- About・Approach・Impact は各コンポーネント内に直書き
- トレーディングステータスは Cloudflare KV（`/api/status` 経由）

## APIエンドポイント

`src/lib/api.ts` にHonoアプリを定義。`src/pages/api/[...route].ts` がブリッジする。

| エンドポイント | 役割 |
|---|---|
| `GET /api/hello` | 疎通確認 |
| `GET /api/status` | KVから最新ステータスデータを返す |
| `POST /api/contact` | Turnstile検証 → Discord Webhookへ転送 |
| `POST /api/chat` | folio-agent のチャット応答 |

## 静的アセット

```
public/
  images/
    photos/       # フォトギャラリー用 (.webp)
    profile/      # プロフィール画像
```
