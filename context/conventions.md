# conventions.md

## ファイル命名

| 対象 | 規則 | 例 |
|---|---|---|
| Astroコンポーネント | PascalCase | `SiteHeader.astro`, `PostPreview.astro` |
| ページファイル | kebab-case | `about.astro`, `cat-feed-tracker/index.astro` |
| TypeScriptモジュール | kebab-case | `brand-icons.ts`, `site.config.ts` |
| CSSファイル | kebab-case | `global.css`, `search.css` |
| コンテンツファイル | kebab-case | `nfc-attendance-system.md` |

## コンポーネント

- Astroコンポーネントをデフォルトとする
- インタラクティブな状態管理が必要な箇所のみReactを使用（Astroアイランド）
- コンポーネントは `src/components/` に配置
- ページ固有のコンポーネントはサブディレクトリで分類（例: `blog/`, `status/`）

## TypeScript

- `strict: true`
- `as any` は外部環境バインディング（Cloudflare `c.env`）に限定して使用
- 型定義はモジュール内にローカルで定義する（別途 `types/` ディレクトリを作らない）
- ただし複数ファイルで共有する型は `src/types.ts` に集約

## APIレイヤー

- Honoのアプリケーション本体は `src/lib/api.ts` に定義
- `src/pages/api/[...route].ts` はAstroとHonoのブリッジのみ担う
- 環境変数・KVバインディングは `c.env` 経由でアクセス（ハードコードしない）

## スタイリング

- Tailwind CSSのユーティリティクラスを使用
- グローバルスタイルは `src/styles/global.css`
- ブロック単位のスタイルは `src/styles/blocks/` に分割

## コンテンツ

- ブログ記事は `src/content/post/` にMarkdownで配置
- フロントマターのスキーマは `src/content.config.ts` で定義
- 画像は `public/` 以下に配置（記事画像は `public/images/posts/YYYYMM/`）
