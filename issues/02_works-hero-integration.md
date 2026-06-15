## Works ページ廃止・Hero に統合
id: 02
branch-slug: works-hero-integration
github_issue:
status: draft
type: feat
対象: |
  src/pages/index.astro
  src/pages/works/index.astro  (削除)
  src/site.config.ts
内容: |
  /works/ ページを廃止し、index.astro の Works セクションに全件統合する。
  キャッチコピーの直下に Works が全件並ぶ構成にする。
確認: |
  - index.astro が works を全件（featured フラグなし）表示していること
  - 「すべて見る →」リンクが削除されていること
  - site.config.ts の menuLinks から Works が削除されていること（空配列）
  - works/index.astro が削除されていること
  - npm run typecheck が通ること

---

## 未確定事項（Chat で設計してから open にする）

- カテゴリ（work.tag）の見せ方：グループ化 vs タグバッジ表示のまま vs 別レイアウト
- Works カードのデザイン：現状の横リスト形式を維持するか、グリッド等に変えるか
- 「このサイトについて」ブロックの行き先（about ページへ移動 or 削除）
- works/index.astro 削除後の /works/ の扱い（404 or / へリダイレクト）

---

## 実装メモ（設計確定後に更新）

### index.astro
- `featuredWorks` を `worksResolved`（全件）に変更
- 「すべて見る →」リンクを削除
- `work.featuredDescription ?? work.description` → `work.description` に変更

### works/index.astro
- ファイルを削除する

### site.config.ts
- `menuLinks` を空配列にする（Issue 01 で Works 以外は削除済みのはず）
