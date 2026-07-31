## PR記録: feat: Blogナビ導線追加
issue: 51 (51_blog-nav-entry.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/111
Merged: d8aad8426fb5513a947898eb263d141301155762

## 変更内容
左サイドの縦ナビ（WORKS/IMPACT/ABOUT/APPROACH）に BLOG を追加し、既存の `/posts/` 系ページも同じレイアウト（左サイドナビ + 右カラム）で描画してナビの選択状態を一致させた。

- `src/lib/lucide.ts` に `notebook-pen` アイコン（lucide-static v1.24.0 準拠）を追加
- `src/components/HeroDesktop.astro` / `HeroMobile.astro` の nav items に `{ label: 'BLOG', href: '/posts/', key: 'blog' }`（Desktop側は icon: 'notebook-pen' 付き）を末尾に追加
- `src/layouts/ProfileLayout.astro` の `Props.current` に `'blog'` を追加。加えて `/posts/[slug]` が従来 `MainLayout` に直接渡していた `description` / `ogImage` / `ogImageAlt` / `ogType` / `publishedTime` / `modifiedTime` を素通しできるよう Props を拡張し、既存の OGP/メタ情報が欠落しないようにした
- `src/pages/posts/[...page].astro` / `src/pages/posts/[slug].astro` の描画を `MainLayout` 直利用から `ProfileLayout current="blog"` 経由に変更（内容は `<slot />` 側にそのまま収めた。一覧のピン留め・年別グルーピング・ページネーション・タグ表示、記事個別ページのURL・本文描画は変更していない）

## 保証
- 新規:
  - `ProfileLayout` を使う全ページ（`/`, `/about/`, `/approach/`, `/impact/`, `/posts/`, `/posts/[slug]`）の左サイドナビに BLOG 項目が表示され、href は `/posts/` を指す → なし（docs/guarantees.md の対象は `src/lib/api.ts` の HTTP 契約のみで、Astro ページ・コンポーネントの描画結果は明示的に対象外のため台帳更新は不要）
  - `/posts/` および `/posts/[slug]` 表示時、左サイドナビの BLOG 項目が他ページと同じ方式で選択中の見た目になる → なし（同上）
- 維持:
  - 既存の WORKS/IMPACT/ABOUT/APPROACH の遷移先・選択状態表示は変更しない → コード上 `items`/`navItems` の既存4件は無変更、末尾に追加したのみ
  - `/posts/[slug]` の記事個別ページの URL・本文描画は変更しない → ルーティング（`getStaticPaths`）・`<article>` 以下のマークアップは無変更、レイアウトのラップ元のみ変更

## 静的確認結果
- `npm run typecheck`: 0 errors / 0 warnings（既存の pre-existing warning 9件のみ、今回変更由来の新規指摘なし）
- `npm run test`: 17 passed
- import・caller整合性: `src/pages/posts/[...page].astro` と `src/pages/posts/[slug].astro` の `MainLayout` import・使用箇所を `ProfileLayout` に置換済み、他に `MainLayout` を参照する箇所への影響なしをコードリーディングで確認
- git diff --name-only --cached:
  - src/components/HeroDesktop.astro
  - src/components/HeroMobile.astro
  - src/layouts/ProfileLayout.astro
  - src/lib/lucide.ts
  - src/pages/posts/[...page].astro
  - src/pages/posts/[slug].astro

## 検証手順
1. `npm run dev` でローカル起動
2. `/`, `/about/`, `/approach/`, `/impact/`, `/posts/`, `/posts/[slug]`（任意の記事）を開き、左サイドナビ（デスクトップ幅）・上部ナビ（モバイル幅）に BLOG 項目が表示され、`/posts/` `/posts/[slug]` 表示時のみ BLOG が選択中の見た目になることを目視確認
3. `/posts/` 一覧のピン留め・年別グルーピング・ページネーション・タグ一覧が従来通り表示されることを確認
4. 任意の記事ページで OGP メタ情報（ブラウザの View Source で `og:title` 等）が従来通り出力されていることを確認
