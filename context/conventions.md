# conventions.md

## ファイル命名

| 対象 | 規則 | 例 |
|---|---|---|
| Astroコンポーネント | PascalCase | `SiteHeader.astro`, `WorkCard.astro` |
| ページファイル | kebab-case | `about.astro`, `data-policy.astro` |
| TypeScriptモジュール | kebab-case | `brand-icons.ts`, `site.config.ts` |
| CSSファイル | kebab-case | `global.css` |

## コンポーネント

- Astroコンポーネントをデフォルトとする
- インタラクティブな状態管理が必要な箇所のみReactを使用（Astroアイランド）
- コンポーネントは `src/components/` に配置

## TypeScript

- `strict: true`
- `as any` は外部環境バインディング（Cloudflare `c.env`）に限定して使用
- 型定義はモジュール内にローカルで定義する。複数ファイルで共有する型のみ `src/types.ts` に集約

## スタイリング

Tailwind CSSのユーティリティクラスを使用。グローバルスタイルは `src/styles/global.css`。

## APIレイヤー

- Honoのアプリケーション本体は `src/lib/api.ts` に定義
- `src/pages/api/[...route].ts` はAstroとHonoのブリッジのみ担う
- 環境変数・KVバインディングは `c.env` 経由でアクセス（ハードコードしない）
