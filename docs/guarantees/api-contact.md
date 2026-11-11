# api-contact

| 保証 | 対応テスト |
|---|---|
| `POST /api/contact` はボディを JSON として読めなければ、400 で `{ error: 'invalid_json' }` を返す | `POST /api/contact > 400 for invalid JSON` |
| `POST /api/contact` は `name`・`email`・`phone` のいずれかが欠けていれば、400 を返す | `POST /api/contact > 400 when required fields missing` |
| `POST /api/contact` は `TELEGRAM_BOT_TOKEN` か `TELEGRAM_CHAT_ID` が未設定なら、500 で `{ error: 'server_config_error' }` を返す | `POST /api/contact > 500 when Telegram config not configured` |
| `POST /api/contact` は Telegram API への送信が成功すれば、200 で `{ ok: true }` を返す | `POST /api/contact > 200 on success` |
| `POST /api/contact` は Telegram API が 2xx 以外を返せば、502 を返す | `POST /api/contact > 502 when Telegram API fails` |
| `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されていて、渡された `cfToken` の Turnstile 検証に失敗すれば、403 を返す | `POST /api/contact > 403 when Turnstile verification fails` |
| `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されていて `cfToken` が空か未指定なら、403 で `{ error: 'turnstile_failed' }` を返す | `POST /api/contact > 403 when secret is set but cfToken is empty, without calling siteverify` |
| `POST /api/contact` は `cfToken` が空か未指定なら、Turnstile の siteverify を呼ばない | `POST /api/contact > 403 when secret is set but cfToken is empty, without calling siteverify` |
| `POST /api/contact` は `TURNSTILE_SECRET_KEY` が未設定なら、`cfToken` を渡さなくても Turnstile の検証をせずに続行する | `POST /api/contact > 200 when secret is not set, regardless of cfToken` |
