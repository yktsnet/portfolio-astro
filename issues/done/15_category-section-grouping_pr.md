## 変更内容

カテゴリと Works のまとまりが視覚的に伝わりにくい問題を修正。
見出しの個性を保ちつつ、カテゴリ間・Works 間の余白差とボーダーでセクションを明確化。

- カテゴリ間の `space-y-12` を除去し、`i > 0` のカテゴリに `border-t border-zinc-200 dark:border-zinc-800 pt-20` を付与してカテゴリの切れ目を明示
- Works 間の余白を `space-y-10` → `space-y-8` に変更
- 最初のカテゴリ（Hardware）にはボーダーを付けず、2番目以降のみ区切り線を表示

## 静的確認結果

- `npm run typecheck`: 0 errors, 0 warnings（既存の 12 hints のみ）
- import・caller 整合性: 変更はテンプレート部分のみ。import やデータフロー（works, grouped）に変更なし
- `grouped.map` に index `i` を追加し条件分岐で使用。ロジックに影響なし

## 検証手順

- `npm run dev` を起動し http://localhost:4321 を開く
- トップページの Works セクションで以下を確認:
  - 2番目以降のカテゴリ（Modernization, Trading, Others）の見出し上に薄い区切り線が表示されること
  - 最初のカテゴリ（Hardware）には区切り線がないこと
  - カテゴリ間の余白がカテゴリ内の Works 間余白より明確に広いこと
  - ダークモードでも区切り線が適切に表示されること（`border-zinc-800`）
