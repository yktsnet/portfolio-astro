# structure.md

## ディレクトリ構成

```
src/
  components/     # 再利用可能なAstro/Reactコンポーネント
    blog/         # ブログ記事関連
    status/       # トレーディングステータス表示
  content/        # Astro Content Collections
    post/         # ブログ記事 (Markdown)
    tag/          # タグ定義
  data/           # 静的データ (TypeScript)
  layouts/        # ページレイアウト
  lib/            # ユーティリティ・APIロジック
  pages/          # ルーティング (Astroファイル構造に対応)
    api/          # Edge Functions (Hono)
  styles/         # グローバルCSS
  utils/          # ヘルパー関数
```

## ルーティング

| パス | ファイル | 出力 |
|---|---|---|
| `/` | `pages/index.astro` | 静的 |
| `/about/` | `pages/about.astro` | 静的 |
| `/approach/` | `pages/approach.astro` | 静的 |
| `/impact/` | `pages/impact.astro` | 静的 |
| `/works/` | `pages/works.astro` | 静的 |
| `/nfc-attendance/` | `pages/nfc-attendance/index.astro` | 静的 |
| `/cat-feed-tracker/` | `pages/cat-feed-tracker/index.astro` | 静的 |
| `/trading-system/` | `pages/trading-system.astro` | 静的 |
| `/posts/` | `pages/posts/[...page].astro` | 静的（ページネーション） |
| `/posts/[slug]` | `pages/posts/[slug].astro` | 静的 |
| `/tags/` | `pages/tags/index.astro` | 静的 |
| `/tags/[tag]` | `pages/tags/[tag]/[...page].astro` | 静的（ページネーション） |
| `/photos/` | `pages/photos/index.astro` | 静的 |
| `/contact/` | `pages/contact.astro` | 静的 |
| `/rss.xml` | `pages/rss.xml.ts` | 静的（RSS） |
| `/api/*` | `pages/api/[...route].ts` | Edge Functions (`prerender = false`) |

## データフロー

```
src/data/*.ts          # 静的データ（works.ts: Works一覧 / photos.ts: 写真リスト / post.ts）
src/components/*.astro  # About・Approach・Impact はコンポーネント内にデータを直書き
src/content/post/      # ブログ記事（Content Collections API経由）
Cloudflare KV          # 動的データ（/api/status 経由で配信）
```

## APIエンドポイント

`src/lib/api.ts` にHonoアプリを定義。`src/pages/api/[...route].ts` がAstroのEdge Functionsとしてブリッジする。

| エンドポイント | 役割 |
|---|---|
| `GET /api/status` | KVから最新ステータスデータを返す |
| `POST /api/contact` | Turnstile検証 → Discord Webhookへ転送 |

## Content Collections

`src/content.config.ts` でスキーマを定義。

- `post`: ブログ記事。`title`, `description`, `publishDate`, `tags` などのフロントマターを持つ
- `tag`: タグの表示名・説明を管理

## 静的アセット

```
public/
  images/
    posts/YYYYMM/   # 記事内画像
    photos/         # フォトギャラリー用 (.webp)
  profile/          # プロフィール画像
```
