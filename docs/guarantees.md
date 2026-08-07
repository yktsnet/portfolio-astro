# Guarantee Ledger

## Guarantees

### 1. `src/lib/api.test.ts` — src/lib/api.ts (Hono app)

- `GET /api/hello` は常に 200 で `{ message: 'Hello from Hono!', status: 'logical_efficiency_verified' }` を返す。
- `GET /api/status` は `ykts_status_metrics` KV バインディングが無い場合、500 で `{ error: 'kv_not_bound' }` を返す。
- `GET /api/status` は KV にデータが無い場合（`get` が `null` を返す場合）、404 を返す。
- `GET /api/status` は KV に保存された JSON をパースし、そのまま 200 で返す。
- `POST /api/contact` はリクエストボディが JSON としてパースできない場合、400 で `{ error: 'invalid_json' }` を返す。
- `POST /api/contact` は `name`/`email`/`phone` のいずれかが欠けている場合、400 を返す。
- `POST /api/contact` は `TELEGRAM_BOT_TOKEN` または `TELEGRAM_CHAT_ID` が未設定の場合、500 で `{ error: 'server_config_error' }` を返す。
- `POST /api/contact` は Telegram API 呼び出しが成功すると、200 で `{ ok: true }` を返す。
- `POST /api/contact` は Telegram API 呼び出しが失敗（非 2xx 応答）すると、502 を返す。
- `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されていて `cfToken` が渡された場合、Turnstile 検証に失敗すると 403 を返す。
- `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されている場合、`cfToken` が空または未指定なら Turnstile 検証を行わずに 403 を返す。
- `POST /api/contact` は `TURNSTILE_SECRET_KEY` が未設定の場合、`cfToken` の有無にかかわらず Turnstile 検証をスキップして処理を続行する（ローカル開発でフォームを通すための経路）。
- `POST /api/chat` は `DB`・`GEMINI_API_KEY`・`ASSETS` のいずれかが未設定の場合、500 で `{ error: 'server_config_error' }` を返す。
- `POST /api/chat` は `knowledge.json` を `ASSETS` 経由（`{origin}/knowledge.json`）で取得できない場合、500 で `{ error: 'knowledge_unavailable' }` を返す。
- `POST /api/chat` は正常系で `knowledge.json` の各ページを `# {url}\n\n{text}` 形式に整形した knowledge と `contactUrl` を `createGeminiGenerator` に、`DB` を `createChatHandler` に渡し、ハンドラのレスポンスをそのまま返す。

| 保証(要約) | 対応テスト |
|---|---|
| `/api/hello` の固定レスポンス | `GET /api/hello > 200 with fixed payload` |
| `/api/status` KV 未バインド時 500 | `GET /api/status > 500 when KV not bound` |
| `/api/status` データ無し時 404 | `GET /api/status > 404 when no data in KV` |
| `/api/status` 正常時のデータ整形 | `GET /api/status > 200 with parsed KV data` |
| `/api/contact` 不正 JSON | `POST /api/contact > 400 for invalid JSON` |
| `/api/contact` 必須項目欠落 | `POST /api/contact > 400 when required fields missing` |
| `/api/contact` Telegram 未設定 | `POST /api/contact > 500 when Telegram config not configured` |
| `/api/contact` 送信成功 | `POST /api/contact > 200 on success` |
| `/api/contact` Telegram API 失敗 | `POST /api/contact > 502 when Telegram API fails` |
| `/api/contact` Turnstile 検証失敗 | `POST /api/contact > 403 when Turnstile verification fails` |
| `/api/contact` secret設定・cfToken空で403（siteverify未呼び出し） | `POST /api/contact > 403 when secret is set but cfToken is empty, without calling siteverify` |
| `/api/contact` secret未設定時はcfToken有無に関わらずスキップ | `POST /api/contact > 200 when secret is not set, regardless of cfToken` |
| `/api/chat` 設定未バインド時 500 | `POST /api/chat > 500 when DB, GEMINI_API_KEY or ASSETS not bound` |
| `/api/chat` knowledge 取得失敗時 500 | `POST /api/chat > 500 knowledge_unavailable when knowledge.json cannot be fetched` |
| `/api/chat` 正常系のハンドラ委譲 | `POST /api/chat > loads knowledge.json via ASSETS and delegates to the folio-agent handler` |

### 2. `src/lib/contact-form.test.ts` — src/lib/contact-form.ts

- `buildContactBody(form)` は `name` / `email` / `phone` / `message` の各値を、フォーム内の対応する入力要素から取得して返す。
- `buildContactBody(form)` は入力欄の `name` 属性が `HTMLFormElement` の組み込みプロパティ（`name`・`action`・`method`・`id`・`elements` 等）と衝突する場合でも、組み込みプロパティではなく入力要素の値を返す。
- `buildContactBody(form)` は対応する入力要素が存在しないフィールドについて、`undefined` ではなく空文字列を返す（`JSON.stringify` でキーが欠落しない）。
- `buildContactBody(form)` は Turnstile が挿入する `cf-turnstile-response` の値を `cfToken` として返し、要素が無い場合は空文字列を返す。

| 保証(要約) | 対応テスト |
|---|---|
| 4フィールドの値取得 | `buildContactBody > returns the entered values for all four fields` |
| `name` の組み込みプロパティ衝突を回避 | `buildContactBody > is not shadowed by HTMLFormElement built-in properties (regression for the name field bug)` |
| 未入力フィールドは `''`（`undefined` にしない） | `buildContactBody > returns an empty string, not undefined, when message and cf-turnstile-response are absent` |
| `cf-turnstile-response` の取得と欠落時の `''` | `buildContactBody > returns the entered values for all four fields` / `buildContactBody > returns an empty string, not undefined, when message and cf-turnstile-response are absent` |

## About

対象は `src/lib/api.ts` が公開する Hono ルート（`/api/*`）の HTTP レベルの入出力契約（ステータスコード・レスポンス形状）。対象外はハンドラ内部の実装詳細（KVキー名・Telegram/Turnstile への実際の送信内容・`@folio-agent/handler` 側の挙動）や、Astro ページ・コンポーネントの描画結果。**ここに載っていない振る舞いは約束ではなく、予告なく変わりうる。** 本ドキュメントは design-decisions.md 相当のドキュメントと同格の位置づけとする。
