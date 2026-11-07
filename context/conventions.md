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

文字の大きさは `global.css` の `type-*` で指定し、`text-sm` や `text-[13px]` のような直書きはしない。`src/styles/type-scale.test.ts` が直書きを弾く。`type-*` は大きさだけを決めるので、行間・太さ・色は `leading-*` などで別に書く。

| クラス | 大きさ（スマホ → sm 以上） | 使う場所 |
|---|---|---|
| `type-display` | 20px → 24px | ページの見出し（h1）、トップの節の見出し、サイト名 |
| `type-heading` | 18px → 20px | 詳細ページの節の見出し（h2）、サービスのカードの見出し |
| `type-subheading` | 15px → 16px | カードや手順の見出し（h3）、`/contact/`・`/data-policy/` の節の見出し、写真の国名 |
| `type-lead` | 14px → 15px | 見出しの直下の導入文 |
| `type-metric` | 30px → 36px | 導入例の数字 |
| `type-body` | 14px | 本文 |
| `type-small` | 13px | 表・箇条書き・カード内の説明 |
| `type-caption` | 12px | 注記・リンク・小さな見出し |
| `type-label` | 11px | 英字のラベル（PHASE 01 など） |

新しい大きさが要るときは、直書きせずに `type-*` のクラスを足す。

## APIレイヤー

- Honoのアプリケーション本体は `src/lib/api.ts` に定義
- `src/pages/api/[...route].ts` はAstroとHonoのブリッジのみ担う
- 環境変数・KVバインディングは `c.env` 経由でアクセス（ハードコードしない）
