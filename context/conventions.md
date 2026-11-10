# conventions.md

## ファイル命名

| 対象 | 規則 | 例 |
|---|---|---|
| Astroコンポーネント | PascalCase | `SiteHeader.astro`, `ServiceCard.astro` |
| ページファイル | kebab-case | `contact.astro`, `data-policy.astro` |
| TypeScriptモジュール | kebab-case | `brand-icons.ts`, `site.config.ts` |
| CSSファイル | kebab-case | `global.css` |

## コンポーネント

- Astroコンポーネントをデフォルトとし、クライアント側の振る舞いは `<script>` または Custom Elements で書く
- コンポーネントは `src/components/` に配置

## TypeScript

- `strict: true`
- `as any` は外部環境バインディング（Cloudflare `c.env`）に限定して使用
- 型定義はモジュール内にローカルで定義する。複数ファイルで共有する型のみ `src/types.ts` に集約

## スタイリング

Tailwind CSSのユーティリティクラスを使用。グローバルスタイルは `src/styles/global.css`。

本文は `font-sans`（ゴシック）で組む。`font-mono`（等幅）はサイト名・英字のラベル・数字・コード・リポ名・図の中の文字に限る。図は等幅の字幅で文字の位置を決めているので、`.dg` に等幅を指定している。

`ui-card` の箱はリンクになるものと図を入れるものに使う。読むだけの一覧は箱に入れず、線で区切る。図や本文を含む大きなカードは、md 以上ではカード全体をリンクにし、スマホでは「詳しく見る」のボタンだけをリンクにする。スマホではカードが1画面を超え、全体をリンクにすると画面のどこに触れても遷移する。

スマホでは `Fold.astro` で本文を畳む。md 以上では開いたままになる。開くのは節やカードごとに1つ置く `FoldToggle.astro` のボタンで、ボタンを囲む `data-fold-group` の中をまとめて開く。項目ごとに開く仕組みにはしない。畳むのは中身（理由の説明・手順の本文・比較の相手側）で、主張（見出し・要約・数字・図）と行き先（詳細ページやリポへのリンク）は常に出す。畳むかどうかは節の長さでは決めない。ページ内の節へのリンクは `MainLayout` の `sections` に渡すとヘッダーの下に並ぶ。

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
| `type-label` | 11px | 英字のラベル（DECIDE、OPERATIONS など） |

新しい大きさが要るときは、直書きせずに `type-*` のクラスを足す。

## APIレイヤー

- Honoのアプリケーション本体は `src/lib/api.ts` に定義
- `src/pages/api/[...route].ts` はAstroとHonoのブリッジのみ担う
- 環境変数・バインディングは `c.env` 経由でアクセス（ハードコードしない）
