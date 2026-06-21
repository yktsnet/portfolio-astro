## 変更内容

各 Works カードに公開年月（例: 2026.01）を表示する。
タイトル直下・説明文の上にサブタイトル形式で配置し、既存のダーク/ミニマルデザインを崩さない。

- `Work` 型に `publishedAt?: string` を追加（ドット区切り、省略可）
- 全 6 件の Work に `publishedAt` を設定
- `index.astro` のカード内でタイトル直下に `font-mono text-[11px] text-zinc-400 dark:text-zinc-500` で表示
- `publishedAt` が未設定のカードでは何も表示しない

Closes #26

## 静的確認結果

- `npm run typecheck`: 0 errors, 0 warnings（既存の hints 12 件のみ）
- import 整合性: `index.astro` は `...work` スプレッドで `publishedAt` を自動的に引き継ぐため追加の import 不要
- caller 整合性: `publishedAt` は optional のため既存の参照（`getPostVisualMeta` 等）に影響なし

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で以下を確認する
  - 各 Works カードのタイトル直下に公開年月（例: 2026.01）が小さく表示されている
  - 表示は控えめな `font-mono` のサブテキストで、既存デザインを崩していない
  - 全 6 カードに年月が表示されている
