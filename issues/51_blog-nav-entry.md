## Blogナビ導線追加
id: 51
branch-slug: blog-nav-entry
github_issue:
status: open
type: feat
対象:
- src/components/HeroDesktop.astro
- src/components/HeroMobile.astro
- src/lib/lucide.ts
- src/layouts/ProfileLayout.astro
- src/pages/posts/[...page].astro
- src/pages/posts/[slug].astro
内容: 左サイドの縦ナビ（WORKS/IMPACT/ABOUT/APPROACH）に BLOG を追加し、既存の `/posts/` 系ページも同じレイアウト（左サイドナビ + 右カラム）で描画してナビの選択状態を一致させる。
確認: `npm run typecheck`

---

### 保証
- 新たに宣言する保証:
  - `ProfileLayout` を使う全ページ（`/`, `/about/`, `/approach/`, `/impact/`, `/posts/`, `/posts/[slug]`）の左サイドナビに BLOG 項目が表示され、href は `/posts/` を指す
  - `/posts/` および `/posts/[slug]` 表示時、左サイドナビの BLOG 項目が他ページの WORKS/IMPACT/ABOUT/APPROACH と同じ方式で選択中の見た目になる
- 維持する保証:
  - 既存の WORKS/IMPACT/ABOUT/APPROACH の遷移先・選択状態表示は変更しない
  - `/posts/[slug]` の記事個別ページの URL・本文描画は変更しない（レイアウトの入れ替えのみ）

## 詳細

### src/lib/lucide.ts
`icons` に `"notebook-pen"` を追加する。パスは lucide-static v1.24.0 `notebook-pen.svg` をそのまま使う:
```
<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" /><path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
```

### src/components/HeroDesktop.astro / HeroMobile.astro
`items` 配列（またはそれに相当する定義。HeroMobile.astro 側の実装を先に確認し、同じ構造なら揃える）に以下を追加する:
```
{ label: 'BLOG', href: '/posts/', key: 'blog', icon: 'notebook-pen' }
```
挿入位置は既存の並び（WORKS/IMPACT/ABOUT/APPROACH）に対する自然な位置でよい（末尾で問題ない）。

### src/layouts/ProfileLayout.astro
`Props.current` の型 `'about' | 'approach' | 'impact' | 'works'` に `'blog'` を追加する。

### src/pages/posts/[...page].astro / src/pages/posts/[slug].astro
現状 `MainLayout` を直接使っている描画を `ProfileLayout` 経由に変更し、`current="blog"` を渡す。ProfileLayout は「Hero sticky left / content right」の2カラム構成（`src/layouts/ProfileLayout.astro` 参照）なので、既存の一覧・記事本文の内容はそのまま `<slot />` 側に収める。ページネーションやタグ表示など既存の要素・挙動は変更しない。
