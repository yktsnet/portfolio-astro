## npm/pip カテゴリ統合と Experiments 別枠セクション追加
id: 50
branch-slug: package-tag-and-experiments-section
github_issue: 104
status: close
type: feat
対象: src/data/works.ts, src/pages/index.astro, src/components/Experiments.astro (新規)
内容: 配布チャネル系の 2 タグ npm / pip を単一タグ package に統合する。あわせてトップページ Works セクションの最下部に、Works カードとは別枠の「Experiments」セクションを追加し、wiki-guessur を掲載する。
確認: `npm run typecheck` と `npm run test`。表示はデプロイ後に user が目視確認（検証手順を PR に記載）

---

### 保証
- 新たに宣言する保証:
  - カテゴリフィルタに `npm` / `pip` は現れず、代わりに `package` が 1 つ現れる。`package` で絞ると Folio Agent と bt-dynamic の 2 件が表示される
  - Works カード群の直下・INFRASTRUCTURE セクション（`InfrastructureBlueprint`）の直前に Experiments セクションが表示され、wiki-guessur が 1 行（タイトル + 一言説明 + GitHub リンク）で載る
  - Experiments の項目はカテゴリフィルタの対象外である（フィルタでどのタグを選んでも Experiments セクションの表示は変わらない）
- 維持する保証:
  - Works カード 9 件の表示・並び順・フィルタ挙動は package 統合以外の点で変化しない
  - `displayCategoryTags` の重み順・最大 3 件の絞り込み挙動は変化しない（既存テストがあれば通ること）

### src/data/works.ts

- `CATEGORIES` の `npm` / `pip` エントリを削除し、`package`（icon: "wrench", weight: DEFAULT_CATEGORY_WEIGHT）を追加する
- Folio Agent の `categoryTags` の `npm`、bt-dynamic の `pip` をそれぞれ `package` に置換する
- Experiments 用のデータを同ファイルにエクスポートで追加する（`Work` 型は使わない。カード文法＝Demo/inUse/stack を持ち込まないため、title / description / GitHub href だけの軽い型を新設する）。掲載データ:
  - title: `wiki-guessur`
  - description: 「冒頭の定義文を消された Wikipedia 記事の同定ベンチマーク。数式 / GBDT / LLM 再判定の 4 手法 × 5 シードで MRR を実測」の趣旨で 1 文
  - href: `https://github.com/yktsnet/wiki-guessur`

### src/components/Experiments.astro (新規)

- 見出し「Experiments」+ 1 行リスト（タイトル・一言・GitHub リンク）。Works カードより視覚的な格を一段下げる（カード化しない・色面を持たせない）。既存セクションの見出しスタイルに合わせる
- 1 件でも成立するレイアウトにする（将来の追加を想定した ul ベース）

### src/pages/index.astro

- Works カード群の直下、`<InfrastructureBlueprint />`（index.astro:67 付近）の直前に Experiments セクションを配置する
- フィルタのタグ集計は `works` の `categoryTags` 由来のため変更不要のはずだが、`npm` / `pip` の文字列参照が残っていないか確認する（WorkCard.astro の `isNpm` は外部リンクラベル判定であり対象外・触らない）
