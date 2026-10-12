## Works のデータから表示に使われていないフィールドを削る
id: 60
branch-slug: works-drop-unused-fields
status: open
type: cleanup
対象: src/data/works.ts, src/data/works.test.ts (削除), src/lib/brand-icons.ts, src/pages/index.astro, src/components/WorkSteps.astro, CLAUDE.md
内容: `Work` 型と `works` 配列には、どこからも読まれないフィールドが残っている。書く手間と読み違いの元になるので、型・データ・それにしか使われない関数とアイコンをまとめて削る。トップページの表示は変えない。
対象外: 残すフィールド（`title`・`icon`・`description`・`publishedAt`・`inUse`・`categoryTags`・`priority`）の意味や並び順の変更。`Research` 型。`issues/` 配下の過去の Issue に残る記述。About・Principles のブランドアイコン表示
仮定: `links` は先頭しか読まれていないので、配列をやめて `href: string` 1本にする（label・external も未使用）。PR #165（codeview の追加）のマージ後の main から切る
確認: `npm run typecheck` と `npm run test` が通る。`src/` 配下で `color`・`stack`・`isOSS`・`StackItem`・`BrandKey`・`displayCategoryTags`・`weight`・`links` が Works 関連で参照されていない（grep）。`npm run build` が通り、トップページの ALL WORKS のカード件数・順番・アイコン・リンク先、WORK STEPS の引用カードのアイコン・リンク先が変更前の build と一致する（`dist/` の該当 HTML の差分で確かめる）
人が見るもの: なし

---

### 保証
- 保証: なし（表示を変えない cleanup。台帳 `docs/guarantees.md` に Works の項目は無い）
- 廃止する保証: `displayCategoryTags` の並び替え（`src/data/works.test.ts` だけが呼んでいた。台帳には未記載）

### 削るもの

| 対象 | 根拠 |
|---|---|
| `color` | 未参照 |
| `stack` と `StackItem` / `BrandKey` 型 | 未参照。About は自前の `StackItem` 型を持つので無関係 |
| `isOSS` | 未参照 |
| `step` | 未参照。三段のスライドは `WorkSteps.astro` が自前の `slides` で持つ。Works から分類が消えるのは許容する |
| `links`（`href` へ置換） | `index.astro` と `WorkSteps.astro` が `links[0]?.href` しか読まない。2件目以降（Zenn・npm・PyPI）は消える |
| `displayCategoryTags`・`getCategoryWeight`・`DEFAULT_CATEGORY_WEIGHT`・`CATEGORIES` の `weight` | テストからしか呼ばれない。`CATEGORIES` は `icon` だけ残し、`getCategoryIcon` は維持する |

### src/data/works.ts

- 上の表のとおり削る。`CATEGORIES` の上のコメントは残る仕様に合わせて書き直す
- `description` の長さの目安のコメント（PR #165 で追加）は残す

### src/data/works.test.ts

- テスト対象の関数が消えるのでファイルごと削除する

### src/lib/brand-icons.ts

- `stack` を消すと使われなくなるエントリを `map` と import から外す: astro・hono・fastapi・googleappsscript・line・sqlite・gemini・npm・pypi・pandas・javascript・docker
- 残すのは About（cloudflare・csharp・espressif・go・langgraph・nixos・postgresql・python・raspberry-pi・react・terraform・typescript・vue）と Principles（zenn）が使うもの。削る前に `getBrandIcon(` の呼び出し元を grep して確かめる

### src/pages/index.astro / src/components/WorkSteps.astro

- `w.links[0]?.href` / `work?.links[0]?.href` を `href` に置き換える

### CLAUDE.md

- 「ブランドアイコン（スタックタグの色付きロゴ）」を、About・Principles の技術表示に使うものとして書き直す
