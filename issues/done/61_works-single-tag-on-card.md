## Works のタグを1件1つに絞り、カードに表示する
id: 61
branch-slug: works-single-tag-on-card
status: close
type: feat
対象: src/data/works.ts, src/lib/lucide.ts, src/pages/index.astro, src/components/AllWorks.astro, src/components/WorkFilter.astro
内容: Works のカテゴリタグを1件につき1つにし、実態とずれた2タグ（chatbot・package）を改名したうえで、各カードにタグを表示する。タグを「何をする作品か」という1本の軸に揃え、カード上でも主張として読めるようにする。
対象外: Works の説明文・並び順・アイコンの見直し。researches（タグを持たない）へのタグ付け。フィルタの見た目（ピルのデザイン）の変更。
仮定: 改名後の名前は `ai`・`devtools` とする。
確認: `npm run typecheck` と `npm run test` が通る。`npm run build` が通る。トップページ（`/`）の Works 一覧で、全16件のカードにタグが1つずつ表示され、各カードのタグが下表のとおりである。フィルタのピルが iot 2 / modernization 3 / ai 3 / team 3 / trading 2 / finance 1 / devtools 2 の7個で、件数もこの値で出る。ピルを1つ押すとそのタグのカードだけが残り、別のピルを押すとそちらに切り替わる（0件の空状態にならない）。押したピルをもう一度押すと全件に戻る。researches のカードにはタグが出ない。日英の切り替えでタグ表示が崩れない。
人が見るもの: カード上のタグの位置と大きさが、タイトル・稼働中・公開年月と並んで読みにくくないか（スマホ幅を含む）。

---

### 保証
- 新たに宣言する保証:
  - Works の各作品はタグをちょうど1つ持つ（型で強制する）
  - Works の各カードに、その作品のタグが表示される
  - タグのフィルタは単一選択であり、選んだタグを持つ作品だけを表示する
- 維持する保証:
  - フィルタのピルには、タグごとの作品数が表示される
  - 選択を解除すると全件が表示され、カードの通し番号が表示中の件数に合わせて振り直される
  - 未定義のカテゴリは汎用の `tag` アイコンで描画される（`getCategoryIcon`）
- 廃止する保証:
  - 複数のタグを同時に選んで AND で絞り込めること（1件1タグでは2つ選ぶと必ず0件になるため）

保証台帳 `docs/guarantees.md` は API のみを扱い、Works の表示とフィルタはその範囲外である。既存テストにも該当が無いため、台帳とテストは対象に含めない。

### src/data/works.ts

- `Work` 型の `categoryTags: string[]` を `categoryTag: string` に変える。2つ目を付けて戻ることを型で防ぐのが目的である
- `CATEGORIES` から `chatbot` と `package` を外し、`ai`（`square-sparkles`）と `devtools`（`hammer`）を足す
- 各作品のタグを次のとおりにする

| Work | タグ |
|---|---|
| NFC Attendance Kit | iot |
| Cat Feed Tracker | iot |
| Training Scheduler | team |
| Order System | modernization |
| Order System RAG | ai |
| Attendance System | modernization |
| Folio Agent | ai |
| Excel Kanri | modernization |
| bt-lab | trading |
| live-dynamic | trading |
| etax-prep | finance |
| sdlc-kit | team |
| ladder-kit | team |
| tg-dev-digest | ai |
| codeview | devtools |
| ccreel | devtools |

### src/lib/lucide.ts

- `square-sparkles` と `hammer` を追加する。パスは Lucide 公式（lucide-static の `icons/square-sparkles.svg`・`icons/hammer.svg`）から写し、既存エントリと同じ形式で書く

### src/pages/index.astro

- `allItems` の組み立て（25〜41行）、ユニークなタグの抽出と件数（43〜55行）を `categoryTag` に合わせる
- カードにアイコンを出すなら、タグのアイコンパスもここで解決して渡す（`resolvedTags` と同じく `getLucideIcon(getCategoryIcon(tag))`）

### src/components/AllWorks.astro

- Props の `categoryTags?: string[]`（12行）を単一のタグに合わせる
- `data-tags`（43行）を単一値の属性にする
- カードにタグを表示する。置き場所は h3 内のメタ情報（稼働中・公開年月、80〜92行）の並びか、説明文の下のどちらか、見た目で判断してよい。表記はフィルタのピルと同じくタグ名（小文字）とアイコンにし、ピルと見分けがつくよう押せる見た目にはしない
- researches はタグを持たないので、タグの要素を出さない

### src/components/WorkFilter.astro

- `activeTags` の Set による AND 絞り込み（90〜99行、130〜140行）を、単一選択に変える。押したピルが選択中ならば解除し、そうでなければ選択をそれに置き換える
- カード側の属性名を AllWorks に合わせる
- `aria-pressed` の更新と通し番号の振り直し、空状態の表示はそのまま使う。単一選択では空状態は出なくなるが、要素は残してよい
