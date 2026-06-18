## 変更内容

About セクションの本文 typographic hierarchy を強化し、視認性を改善する。

- **リード文の強調**: 冒頭 1 文を `text-base sm:text-lg` / `text-zinc-900 dark:text-poi-focus` で大きく・明るく表示し、入口として機能させる
- **本文の意味ブロック分割**: 2 段落を経歴・現在の活動で分割し、行間を `leading-7` → `leading-8` に広げて可読性を向上
- **締め文の独立**: 「AI をワークフローに〜」を `text-sm sm:text-base` / `text-zinc-800 dark:text-poi-text` でステートメントとして独立・強調
- **タイムラインにノード追加**: 各行頭にドット（`w-1.5 h-1.5 rounded-full`）を配置し、縦線上の時系列ノードを視覚化。`pl-4` → `pl-5`、`space-y-2` → `space-y-2.5` で間隔調整
- **本文とタイムラインの間隔**: `mt-8` → `mt-12` で階層増加に対応

## 静的確認結果

- `npm run typecheck`: 0 errors（既存の hints/warnings のみ、本変更に起因するものなし）
- import・caller 整合性: `About.astro` は `src/pages/index.astro` から参照。型定義 `TimelineEntry` / `LocationGroup` は変更なし。Tailwind クラスのみの変更のため整合性に影響なし
- `poi-focus`, `poi-text`, `poi-accent` トークンは `tailwind.config.mjs` に定義済み

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で About セクション（右ペイン）を確認
  - リード文（「大学を出てすぐ塾を開業し、12年間経営した。」）が本文より大きく・明るく表示されること
  - 本文が 2 段落に分かれ、行間が広がっていること
  - 締め文（「AI をワークフローに組み込むことに〜」）が独立して少し強調されていること
  - タイムラインの各行頭にドット（●）が縦線上に表示されていること
  - 本文とタイムラインの間隔が広がっていること
- ダークモードで `poi-focus`（リード）/ `poi-text`（締め）/ `poi-accent`（ドット）の色が適切に効いていること
- レスポンシブ: `sm` ブレークポイント前後でリード文・締め文のサイズが切り替わること
