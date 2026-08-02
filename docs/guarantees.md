# Guarantee Ledger

## Guarantees

### 1. `src/lib/api.test.ts` — src/lib/api.ts (Hono app)

- `GET /api/hello` は常に 200 で `{ message: 'Hello from Hono!', status: 'logical_efficiency_verified' }` を返す。
- `GET /api/status` は `ykts_status_metrics` KV バインディングが無い場合、500 で `{ error: 'kv_not_bound' }` を返す。
- `GET /api/status` は KV にデータが無い場合（`get` が `null` を返す場合）、404 を返す。
- `GET /api/status` は KV に保存された JSON をパースし、そのまま 200 で返す。
- `POST /api/contact` はリクエストボディが JSON としてパースできない場合、400 で `{ error: 'invalid_json' }` を返す。
- `POST /api/contact` は `name`/`email`/`phone`/`category` のいずれかが欠けている場合、400 を返す。
- `POST /api/contact` は `TELEGRAM_BOT_TOKEN` または `TELEGRAM_CHAT_ID` が未設定の場合、500 で `{ error: 'server_config_error' }` を返す。
- `POST /api/contact` は Telegram API 呼び出しが成功すると、200 で `{ ok: true }` を返す。
- `POST /api/contact` は Telegram API 呼び出しが失敗（非 2xx 応答）すると、502 を返す。
- `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されていて `cfToken` が渡された場合、Turnstile 検証に失敗すると 403 を返す。
- `POST /api/contact` は `cfToken` が渡されない場合、`TURNSTILE_SECRET_KEY` が設定されていても Turnstile 検証をスキップして処理を続行する。
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
| `/api/contact` cfToken 省略時のスキップ | `POST /api/contact > Turnstile skipped when no token provided` |
| `/api/chat` 設定未バインド時 500 | `POST /api/chat > 500 when DB, GEMINI_API_KEY or ASSETS not bound` |
| `/api/chat` knowledge 取得失敗時 500 | `POST /api/chat > 500 knowledge_unavailable when knowledge.json cannot be fetched` |
| `/api/chat` 正常系のハンドラ委譲 | `POST /api/chat > loads knowledge.json via ASSETS and delegates to the folio-agent handler` |

## About

対象は `src/lib/api.ts` が公開する Hono ルート（`/api/*`）の HTTP レベルの入出力契約（ステータスコード・レスポンス形状）。対象外はハンドラ内部の実装詳細（KVキー名・Telegram/Turnstile への実際の送信内容・`@folio-agent/handler` 側の挙動）や、Astro ページ・コンポーネントの描画結果。**ここに載っていない振る舞いは約束ではなく、予告なく変わりうる。** 本ドキュメントは design-decisions.md 相当のドキュメントと同格の位置づけとする。
