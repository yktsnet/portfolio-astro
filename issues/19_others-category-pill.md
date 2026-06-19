## Others カテゴリをフィルタピルに統合
id: 19
branch-slug: others-category-pill
github_issue:
status: open
type: fix
対象: |
  src/pages/index.astro
内容: |
  Others カテゴリを Hardware / Modernization / Trading と同じフィルタピル＋グループ描画に統合する。
  現状は filterOrder から除外され、専用の <section id="work-others"> で罫線（border-t）付きの別ブロックとして描画されている。
  これを他カテゴリと同列に扱うことで、ピルによる絞り込み・表示の一貫性を確保する。
確認: |
  npm run typecheck

---

### 変更箇所

1. `filterOrder` に `"Others"` を追加
2. Others 専用セクション（`<section id="work-others">` ～ 閉じタグ）を削除
   - これにより罫線（border-t）も消える
   - カードのマークアップが groups.map() 側に統一される（アイコン 15→16px、見出し text-base→text-lg）
3. JS: `othersSection` の参照と表示切替ロジック（`if (othersSection) ...`）を削除
4. `const others = groupOf("Others");` を削除（不要になる）
