## カテゴリセクションのグループ化改善
id: 15
branch-slug: category-section-grouping
github_issue:
status: close
type: fix
対象: |
  src/pages/index.astro
内容: |
  カテゴリと Works のまとまりが視覚的に伝わりにくい問題を修正。
  見出しの個性を保ちつつ、カテゴリ間・Works 間の余白差とボーダーでセクションを明確化する。

---

## 変更内容

### 1. カテゴリ間・Works 間の余白差別化

| 箇所 | 現在 | 変更後 |
|---|---|---|
| カテゴリ間（`space-y-*`） | `space-y-12` | `space-y-20` |
| Works 間（`space-y-*`） | `space-y-6` | `space-y-8` |

### 2. カテゴリ見出し直上に区切りボーダーを追加

最初のカテゴリ（Hardware）を除き、見出し `<h2>` の親 `<div>` に `border-t` を追加してカテゴリの切れ目を明示する。

```astro
{grouped.map(({ category, items }, i) => (
  <div class={i > 0 ? "border-t border-zinc-200 dark:border-zinc-800 pt-20" : ""}>
    <h2 ...>{category}</h2>
    ...
  </div>
))}
```

`space-y-20` との重複を避けるため、`i > 0` のカテゴリは `border-t pt-20` を付与し、
外側の `space-y-20` は除去する（または `space-y-0` に変更して `pt-20` で統一する）。

### 3. カテゴリ見出しサイズをモバイルで縮小（Issue #13 と重複するが同ファイルのため統合）

| 箇所 | 現在 | 変更後 |
|---|---|---|
| `h2` サイズ | `text-5xl` | `text-4xl sm:text-5xl` |
| 見出し下余白 | `mb-6` | `mb-8` |
