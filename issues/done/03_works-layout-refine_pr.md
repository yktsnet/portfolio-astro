## 変更内容

Issue 02 実装後の見た目の問題を修正し、デザインを完成させる。

1. **Hero + 説明文を1セクションに統合** — 別々だった `<!-- Hero -->` と `<!-- Description -->` を1つの `<section class="mb-12">` にまとめ、説明文を h1 の直下に移動。`max-w-3xl` 制約も除去。
2. **Works を1列レイアウトに変更** — `grid` を廃止し `space-y-8` の縦積みリストに変更。
3. **カテゴリ見出しに Serif フォント + カテゴリカラーを適用** — `font-serif text-4xl` + `style` でカテゴリカラーを付与。`opacity-20` で薄く表示。
4. **リンクをカテゴリカラーに変更** — 各リンクに `style` で `work.color` を付与、ホバー時は `hover:opacity-80`。
5. **コンテンツ幅の制約を解除** — コンテンツ div に `flex-1` を追加してページ幅いっぱいに広がるよう調整。

## 静的確認結果

- **Hero と説明文が1つの section に収まっていること** — `<section class="mb-12">` 内に `<img>`, `<h1>`, `<p>` がすべて含まれている。Description セクションは削除済み ✅
- **Works が1列で表示されること** — `grid` クラスを削除し `<div class="space-y-8">` の1列構成に変更済み ✅
- **カテゴリ見出しが serif フォント + work.color で表示されること** — `font-serif text-4xl` + `style={`color: ${items[0].color};`}` を付与。`works.ts` の各 work に `color` フィールドが存在する（`#c792ea`, `#addb67`, `#89ddff`）✅
- **リンクが work.color で表示されること** — `style={`color: ${work.color};`}` に変更済み ✅
- **コンテンツがページ幅いっぱいに広がっていること** — `<div class="min-w-0 flex-1">` で `flex-1` を追加済み。旧 `max-w-3xl` は削除済み ✅
- **npm run typecheck が通ること** — 0 errors, 0 warnings 確認済み ✅

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で確認する
  - Hero（プロフィール画像・名前・説明文）が1つのブロックにまとまっていること
  - Works リストが1列縦積みで表示されること
  - カテゴリ見出し（Automation / Hardware / Platform）が Serif フォント・対応カラー（薄め）で表示されること
  - 各 work のリンクがカテゴリカラー（紫 / 緑 / 水色）で表示されること
  - ライト・ダークモード両方で視認性が問題ないこと
