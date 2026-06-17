## モバイル Hero・Works スペーシング改善
id: 13
branch-slug: mobile-hero-works-spacing
github_issue:
status: close
type: fix
対象: |
  src/components/HeroMobile.astro
  src/pages/index.astro
内容: |
  モバイルビューでHeroのメタ情報が詰まって見える・カテゴリ見出しが大きすぎる問題を修正。
  余白・構造・フォントサイズを調整して読みやすくする。

---

## HeroMobile.astro

| 箇所 | 現在 | 変更後 |
|---|---|---|
| アバター | `h-24 w-24` | `h-28 w-28` |
| メタ情報構造 | `flex-wrap justify-center` + `<span class="w-full sm:hidden" />` で強制改行 | 2段の `flex` に分割（下記参照） |
| メタ情報行間 | `gap-y-1` | `gap-y-2` |

### メタ情報の構造変更

```html
<!-- 変更後 -->
<div class="mt-4 flex flex-col items-center gap-2 text-sm text-zinc-500 dark:text-poi-muted">
  <div class="flex gap-4">
    <!-- Osaka / ykts.net / GitHub -->
  </div>
  <div class="flex gap-4">
    <!-- 2025〜 / Posts / Contact -->
  </div>
</div>
```

## index.astro

| 箇所 | 現在 | 変更後 |
|---|---|---|
| カテゴリ見出しサイズ | `text-5xl` | `text-4xl sm:text-5xl` |
| Hero 下余白 | `mb-12` | `mb-16` |
