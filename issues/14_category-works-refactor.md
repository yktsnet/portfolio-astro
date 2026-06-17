## カテゴリ名・プロジェクト名・文言リファクタ
id: 14
branch-slug: category-works-refactor
github_issue:
status: open
type: feat
対象: |
  src/data/works.ts
  src/pages/index.astro
内容: |
  Finance → Trading へのカテゴリ名変更、プロジェクト名のサフィックス除去、
  Training Scheduler の Others カテゴリへの移動、Others セクションのUI追加。

---

## 1. カテゴリ名変更

| Before | After |
|--------|-------|
| `Finance` | `Trading` |

`Hardware` `Modernization` は現状維持。

## 2. プロジェクト名変更

| Before | After |
|--------|-------|
| `Attendance System / WebForms` | `Attendance System` |
| `Order System / WinForms` | `Order System` |

移行元の技術（WebForms / WinForms）はスタックバッジで担保する。

## 3. プロジェクトのカテゴリ移動

| プロジェクト | Before | After |
|------------|--------|-------|
| `Training Scheduler` | `Modernization` | `Others` |

レガシー移行ではなく業務ツール新規開発のため。

## 4. 文言修正

| プロジェクト | Before | After |
|------------|--------|-------|
| Training Scheduler | `SQLite をバックエンドに採用` | `SQLite（デモ環境）` |

## 5. Others カテゴリ追加

- `src/data/works.ts` の `category` に `"Others"` を追加
- `index.astro` の `categoryOrder` に `"Others"` を末尾に追加
- Others セクションはグレートーンで表示（メイン3軸と視覚的に区別）
  - アウトライン文字色: `#71717a`（zinc-500相当）
  - ボタン・リンク色: `#71717a`
- 初期収録: `Training Scheduler` のみ
