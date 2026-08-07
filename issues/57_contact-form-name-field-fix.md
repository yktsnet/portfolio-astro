## Contact フォームが常に送信失敗する不具合の修正とテスト整備
id: 57
branch-slug: contact-form-name-field-fix
github_issue:
status: open
type: fix
対象: src/pages/contact.astro / src/lib/contact-form.ts (新規) / src/lib/contact-form.test.ts (新規) / package.json / docs/guarantees.md
内容: 送信スクリプトが `name` フィールドの値を取得できず、API に `name` を欠いたボディを送るため常に 400 になる。ボディ組み立てを `src/lib/contact-form.ts` に切り出して `form.elements` 経由に修正し、DOM 環境の単体テストで回帰を固定する。あわせて保証台帳の陳腐化（`category`）を訂正する。
確認: `npm run typecheck` / `npm run test`

---

### 保証
- 新たに宣言する保証:
  - `buildContactBody(form)` は `name` / `email` / `phone` / `message` の各値を、フォーム内の対応する入力要素から取得して返す。
  - `buildContactBody(form)` は入力欄の `name` 属性が `HTMLFormElement` の組み込みプロパティ（`name`・`action`・`method`・`id`・`elements` 等）と衝突する場合でも、組み込みプロパティではなく入力要素の値を返す。
  - `buildContactBody(form)` は対応する入力要素が存在しないフィールドについて、`undefined` ではなく空文字列を返す（`JSON.stringify` でキーが欠落しない）。
  - `buildContactBody(form)` は Turnstile が挿入する `cf-turnstile-response` の値を `cfToken` として返し、要素が無い場合は空文字列を返す。
- 維持する保証（`docs/guarantees.md` より。本 Issue で API の挙動は変更しない）:
  - `POST /api/contact` はリクエストボディが JSON としてパースできない場合、400 で `{ error: 'invalid_json' }` を返す。
  - `POST /api/contact` は `name`/`email`/`phone` のいずれかが欠けている場合、400 を返す。
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されていて `cfToken` が渡された場合、Turnstile 検証に失敗すると 403 を返す。
  - `POST /api/contact` は `cfToken` が渡されない場合、Turnstile 検証をスキップして処理を続行する。
  - `POST /api/contact` は Telegram API 呼び出しが成功すると 200 で `{ ok: true }` を返し、失敗すると 502 を返す。

---

### 原因

`src/pages/contact.astro:117` の `form.name.value`。

`HTMLFormElement` は `name` を組み込みプロパティ（form 要素の `name` 属性の反映）として持つ。これが同名 input への名前付きアクセスより優先されるため、`<form>` に `name` 属性が無い本フォームでは `form.name` が `""` になり、`"".value` は `undefined` を返す。

結果として `JSON.stringify` はボディから `name` キーを落とし、`src/lib/api.ts:95` の必須チェックに引っかかって 400 が返る。フロントは `data.ok` を見ているため「送信に失敗しました。」を表示する。

`email` / `phone` / `message` は `HTMLFormElement` に同名の組み込みプロパティが無いため、たまたま正しく動いている。

デプロイ済み API 側は正常であることを実測確認済み（cfToken なしで 200 `{"ok":true}`、不正 cfToken で 403 `turnstile_failed`）。API の変更は不要。

---

### src/lib/contact-form.ts（新規）

ボディ組み立てだけを純粋な関数として切り出す。テスト可能にすることが目的なので、`fetch` や DOM の書き換え（ステータス表示・ボタン制御）は移さず contact.astro 側に残す。

`buildContactBody(form: HTMLFormElement)` を export し、`{ name, email, phone, message, cfToken }` を返す。

- 各フィールドは `form.elements.namedItem(n)` で取得する。`form[n]` は使わない（本不具合の原因そのもの）。
- 値が取れない場合は `''` を返す。`undefined` を返すと `JSON.stringify` でキーごと落ちて API 側の必須チェックの意味が変わるため。
- `cfToken` は `cf-turnstile-response` を同じ経路で取得する。

`namedItem` の戻り値は `Element | RadioNodeList | null` なので、`value` を持つかの絞り込みが要る。`as any` は使わない（`context/conventions.md` により `c.env` 限定）。

### src/pages/contact.astro

- `115-121` 行のボディ組み立てを `buildContactBody(form)` の呼び出しに置き換える。
- `script is:inline` は import を持てないため、`is:inline` を外して Astro にバンドルさせる。`104` 行の `<script is:inline>` → `<script>`。Turnstile の CDN script（`102` 行）はそのままでよい。
- `is:inline` を外すと実行タイミングが変わる（バンドル script は defer 相当）。フォームは静的に描画済みなので `getElementById` は解決するが、実行者はこの点を意識して確認すること。

### src/lib/contact-form.test.ts（新規）

ファイル先頭に `// @vitest-environment happy-dom` を置く。`vitest.config.ts` の `environment: 'node'` は API テストのために維持し、このファイルだけ DOM 環境にする（config は変更しない）。

`document.body.innerHTML` に contact.astro と同じ `name` 属性を持つ最小フォームを組み立てて検証する。最低限:

- 4 フィールドすべてに値がある場合、入力した値がそのまま返る。
- **`name` フィールドが組み込みプロパティに shadow されないこと**（本不具合の回帰テスト。`form.name` が `''` を返す状況で `buildContactBody` は入力値を返す）。
- `message` 未入力・`cf-turnstile-response` 不在のとき、`undefined` ではなく `''` が返る。

### package.json

`happy-dom` を devDependencies に追加する。happy-dom で `form.elements.namedItem` が期待通り動かない場合は `jsdom` に切り替えてよい（判断は実行者に委ねる。切り替えた場合は docblock も合わせる）。

### docs/guarantees.md

1. `12` 行目の陳腐化を訂正する。`name`/`email`/`phone`/`category` とあるが、`src/lib/api.ts:95` は `category` を検証していない。`category` を削る。
2. 新しい保証セクションを追加する。既存の `### 1. src/lib/api.test.ts — src/lib/api.ts (Hono app)` と同じ体裁で `### 2. src/lib/contact-form.test.ts — src/lib/contact-form.ts` を設け、上の「新たに宣言する保証」を箇条書き＋対応テスト表で記載する。

### 実装順序

`src/lib/contact-form.ts` → テスト → contact.astro の置き換え → 台帳更新。
