## Hero スペーシング・密度改善
id: 12
branch-slug: hero-spacing-refinement
github_issue:
status: open
type: fix
対象: |
  src/components/HeroDesktop.astro
  src/pages/index.astro
内容: |
  スクショ確認の結果、Heroサイドバーと Works エリアが全体的に詰まって見える。
  余白・サイズを調整して呼吸感を出す。

---

## HeroDesktop.astro

| 箇所 | 現在 | 変更後 |
|---|---|---|
| `aside` 幅 | `w-52` | `w-56` |
| アバター | `h-24 w-24` | `h-32 w-32` |
| 名前 wrapper | `mt-3` | `mt-5` |
| `h1` サイズ | `text-xl` | `text-2xl` |
| Builder `<p>` | `mt-0.5` | `mt-1` |
| バイオ `<p>` | `mt-4` | セパレーター (`border-t mt-5 pt-5`) に変更 |
| リンクリスト | `mt-4 space-y-1` | `mt-5 space-y-2` |

Builder はプレーンテキストのまま（カプセル化なし）。

## index.astro（Works エリア）

| 箇所 | 現在 | 変更後 |
|---|---|---|
| Works カード間 | `space-y-6` | `space-y-10` |
| カテゴリ見出し下余白 | `mb-6` | `mb-8` |
