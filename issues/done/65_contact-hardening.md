## Contact フォームと /api/contact の信頼性・アクセシビリティ改善
id: 65
branch-slug: contact-hardening
status: close
type: fix
対象: src/lib/api.ts, src/lib/api.test.ts, docs/guarantees/api-contact.md, src/pages/contact.astro
目的: Contact フォームの連続送信時や Turnstile 障害時に送信不能・未捕捉例外になる不具合を無くし、送信結果の読み上げ対応と型チェックの hint 解消までまとめて整える。
内容:
- `src/lib/api.ts`: Turnstile `siteverify` の通信失敗・非 2xx・非 JSON 応答を捕捉して 502 を返す。入力文字数の上限超過（Telegram `sendMessage` の 4096 文字上限対策）を 400 で弾く
- `src/lib/api.test.ts`・`docs/guarantees/api-contact.md`: 上記2件の保証とテストを追加する
- `src/pages/contact.astro`: 送信成功時にも Turnstile をリセットする。`resetTurnstile()` のポーリングにタイムアウトを設けてボタンが固まらないようにする。`#cf-status` に `role="status"` を付与し、Turnstile の `<script>` に `is:inline` を明示する
対象外: `src/lib/contact-form.ts` および `docs/guarantees/contact-form.md` の仕様変更。メールアドレス・電話番号の厳密な形式検証の追加。
仮定:
- 入力長の上限は `name` / `email` / `phone` を各 200 文字、`message` を 3000 文字とする（HTML エスケープ後の Telegram 4096 文字上限に対して余裕を持たせた値）
- `siteverify` 側の異常（ネットワーク例外・非 2xx・JSON パース失敗）はクライアント不正（403）ではなく外部依存障害として `502` `{ error: 'turnstile_unavailable' }` を返す
- `resetTurnstile()` のポーリング上限は 10 秒とし、超過したら interval を解除してボタンを再有効化する
確認:
- `npm run typecheck` で `src/pages/contact.astro` の `astro(4000)` hint を含めエラー・警告が出ない
- `npm run test` が全件通る（既存の 9 件に加え、siteverify 異常系 502 と入力長超過 400 のテストが追加されて通る）
- `/contact/` の送信成功後に `window.turnstile.reset()` が呼ばれる（ブラウザ上で `window.turnstile` をモックして確認）
- `/contact/` の送信失敗後に `cf-turnstile-response` が空のまま 10 秒経過しても送信ボタンが再有効化される（またはタイマーが進むことを確認）
- `/contact/` の `#cf-status` に `role="status"` が付いている
人が見るもの: 本番またはプレビュー環境で `/contact/` から実際に送信し、成功後に Turnstile がリセットされて再送できることの確認。

---

### 保証
- 新たに宣言する保証:
  - `docs/guarantees/api-contact.md`: `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されていて Turnstile の siteverify がネットワーク例外・非 2xx・非 JSON 応答で失敗すれば、502 で `{ error: 'turnstile_unavailable' }` を返す
  - `docs/guarantees/api-contact.md`: `POST /api/contact` は `name`・`email`・`phone` が各 200 文字を超えるか `message` が 3000 文字を超えれば、400 で `{ error: 'input_too_long' }` を返す
  - Contact フォームは送信成功後も Turnstile ウィジェットをリセットし、続けて送信できる状態に戻す（`window.turnstile` 依存のブラウザ挙動のため自動テスト無し）
  - Contact フォームは Turnstile リセット後にトークンが再発行されないまま一定時間（10秒）経過したらポーリングを止め、送信ボタンを再度押せる状態に戻す（ブラウザ挙動のため自動テスト無し）
- 維持する保証:
  - `POST /api/contact` はボディを JSON として読めなければ、400 で `{ error: 'invalid_json' }` を返す
  - `POST /api/contact` は `name`・`email`・`phone` のいずれかが欠けていれば、400 を返す
  - `POST /api/contact` は `TELEGRAM_BOT_TOKEN` か `TELEGRAM_CHAT_ID` が未設定なら、500 で `{ error: 'server_config_error' }` を返す
  - `POST /api/contact` は Telegram API への送信が成功すれば、200 で `{ ok: true }` を返す
  - `POST /api/contact` は Telegram API が 2xx 以外を返せば、502 を返す
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されていて、渡された `cfToken` の Turnstile 検証に失敗すれば、403 を返す
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されていて `cfToken` が空か未指定なら、403 で `{ error: 'turnstile_failed' }` を返す
  - `POST /api/contact` は `cfToken` が空か未指定なら、Turnstile の siteverify を呼ばない
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が未設定なら、`cfToken` を渡さなくても Turnstile の検証をせずに続行する
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が未設定なら、`cfToken` を渡しても Turnstile の検証をせずに続行する

### 詳細仕様

#### `src/lib/api.ts`
- L28–30 の必須項目チェックの直後に文字数上限チェックを追加する。`name.length > 200 || email.length > 200 || phone.length > 200 || message.length > 3000` なら `400` で `{ error: 'input_too_long' }` を返す（外部 API を呼ぶ前に弾く）。
- L38–47 の `siteverify` 呼び出しを `try / catch` で囲み、`!tsRes.ok` または JSON パース失敗または `fetch` 例外時は `console.error` に記録して `502` で `{ error: 'turnstile_unavailable' }` を返す。

#### `src/lib/api.test.ts` / `docs/guarantees/api-contact.md`
- 上記2つの新保証を `docs/guarantees/api-contact.md` の該当セクションの表に追記し、対応するテストを `src/lib/api.test.ts` に追加する。

#### `src/pages/contact.astro`
- L67: `#cf-status` に `role="status"` を追加する。
- L103: `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer is:inline></script>` に変更する。
- L150–165 の `resetTurnstile()`: 開始時刻または試行回数で 10 秒の上限を設け、超過時は `clearInterval(check)` と `btn.disabled = false` を行って終了する。
- L176–183 の送信成功時: `form.reset()`・`btn.innerHTML = btnLabel` のあとに `resetTurnstile()` を呼ぶ（`btn.disabled = false` の直接設定は `resetTurnstile()` 側へ委ねる）。
