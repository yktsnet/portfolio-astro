## 変更内容

- **カテゴリ名変更**: `Finance` → `Trading`
- **プロジェクト名変更**: `Attendance System / WebForms` → `Attendance System`、`Order System / WinForms` → `Order System`（移行元技術はスタックバッジで担保）
- **カテゴリ移動**: `Training Scheduler` を `Modernization` → `Others` へ移動（レガシー移行ではなく業務ツール新規開発のため）
- **文言修正**: Training Scheduler の説明を `SQLite をバックエンドに採用` → `SQLite（デモ環境）` に変更
- **Others カテゴリ追加**: `categoryOrder` に末尾追加、グレートーン（`#71717a`）で表示

## 静的確認結果

- `npm run typecheck`: 0 errors, 0 warnings
- `works.ts`: `category` / `title` / `color` / `description` の変更のみ。型定義 `Work` との整合性に問題なし
- `index.astro`: `categoryOrder` 配列に `"Trading"` と `"Others"` を追加。テンプレートは `items[0].color` を参照するため、Others の `#71717a` がアウトライン文字色・ボタン色に自動適用される
- import / caller: `works` を参照する他ファイル（`getPostVisualMeta` 等）は `category` / `title` を直接参照しないため影響なし

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で以下を確認:
  - [ ] カテゴリ見出しが Hardware → Modernization → Trading → Others の順で表示される
  - [ ] Trading セクションに Trading Lab が表示され、青系（`#89ddff`）のアウトライン・ボタン色である
  - [ ] Modernization セクションに Attendance System / Order System のみ表示される（サフィックスなし）
  - [ ] Others セクションに Training Scheduler が表示され、グレー（`#71717a`）のアウトライン・ボタン色である
  - [ ] Training Scheduler の説明文が「SQLite（デモ環境）。」で終わる
  - [ ] モバイル表示（幅 < 640px）でも同様にカテゴリ順・色が正しい
