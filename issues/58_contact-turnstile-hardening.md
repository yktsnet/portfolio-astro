## Contact フォームの Turnstile 回避を塞ぎ、失敗後の再送を成立させる
id: 58
branch-slug: contact-turnstile-hardening
github_issue:
status: open
type: fix
対象: src/lib/api.ts / src/lib/api.test.ts / src/pages/contact.astro / docs/guarantees.md
内容: `POST /api/contact` は `cfToken` が空だと Turnstile 検証を丸ごと飛ばして通すため、トークンを付けずに叩けば誰でも検証を回避して Telegram へ送信できる。空トークンを拒否するよう条件を反転する。あわせて、送信失敗時に使用済みトークンが残り再送が必ず失敗する問題を、Turnstile ウィジェットのリセットで解消する。
確認: `npm run typecheck` / `npm run test`

---

### 保証
- 新たに宣言する保証:
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されている場合、`cfToken` が空または未指定なら Turnstile 検証を行わずに 403 を返す。
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が未設定の場合、`cfToken` の有無にかかわらず Turnstile 検証をスキップして処理を続行する（ローカル開発でフォームを通すための経路）。
  - Contact フォームは送信が失敗したとき Turnstile ウィジェットをリセットし、次の送信で新しいトークンが使われる状態にする。
- 廃止する保証（`docs/guarantees.md` から削除する）:
  - `POST /api/contact` は `cfToken` が渡されない場合、`TURNSTILE_SECRET_KEY` が設定されていても Turnstile 検証をスキップして処理を続行する。
- 維持する保証:
  - `POST /api/contact` はリクエストボディが JSON としてパースできない場合、400 で `{ error: 'invalid_json' }` を返す。
  - `POST /api/contact` は `name`/`email`/`phone` のいずれかが欠けている場合、400 を返す。
  - `POST /api/contact` は Turnstile 検証に失敗すると 403 を返す。
  - `POST /api/contact` は `TELEGRAM_BOT_TOKEN` または `TELEGRAM_CHAT_ID` が未設定の場合、500 で `{ error: 'server_config_error' }` を返す。
  - `POST /api/contact` は Telegram API 呼び出しが成功すると 200 で `{ ok: true }` を返し、失敗すると 502 を返す。
  - `buildContactBody(form)` に関する既存の保証（`docs/guarantees.md` セクション2）をすべて維持する。

**テスト欠落の申告**: 上記3つ目（ウィジェットのリセット）は `window.turnstile` というグローバルに依存するブラウザ挙動で、本リポにこれを対象にできるテスト基盤が無い。裁可時にテスト無しで進めるか判断してほしい。サーバ側の2つは `src/lib/api.test.ts` で担保する。

---

### 背景

#### 1. Turnstile が回避可能

`src/lib/api.ts:101` の条件が `if (tsSecret && token)` になっているため、`cfToken` を付けずに送ると検証ブロックごと素通りし、Telegram まで到達する。実測で確認済み（トークン無しの POST が 200 `{"ok":true}` を返し、Telegram に着信した）。ボットがフォームスパムを送る際の典型的な回避方法そのものであり、Turnstile を設置している意味が実質的に無い状態になっている。

#### 2. 失敗後の再送が必ず失敗する

Turnstile のトークンは1回限り。送信が失敗しても `src/pages/contact.astro` はウィジェットに触れないため、使用済みトークンが hidden input に残り続ける。画面は「再度お試しください」と表示してボタンを再有効化するが、そのまま押し直すと同じ使用済みトークンが送られ、`timeout-or-duplicate` で必ず 403 になる。画面が指示した操作が構造上通らない。

---

### src/lib/api.ts

`101` 行の条件を、トークンの有無ではなく secret の有無で分岐させる。

- `tsSecret` が設定されている場合、`token` が空なら `siteverify` を呼ばずに 403 `{ error: 'turnstile_failed' }` を返す。
- `tsSecret` が未設定の場合は従来どおりスキップ。ローカル開発で secret を持たずにフォームを通すための経路であり、この分岐は残す。

検証失敗時に `siteverify` 応答の `error-codes` を `console.warn` に出す。`invalid-input-secret`（secret 不一致）と `timeout-or-duplicate`（トークン失効・再利用）は対処が全く異なるが、現在の実装は両者を捨てているため運用時に切り分けられない。レスポンス本文は `{ error: 'turnstile_failed' }` のまま変えないこと（既存の保証を維持するため）。

`tsData` の型は現在 `{ success: boolean }` なので、`error-codes` を読むために拡張する。

### src/pages/contact.astro

送信が失敗したとき（`data.ok` が偽のとき、および `catch` 節）にウィジェットをリセットする。

- `window.turnstile.reset()` を呼ぶ。ページ内のウィジェットは1つなので引数は不要。
- 新しいトークンの発行には1〜数秒かかる。リセット直後にボタンが押せると空トークンで送ることになり、上のサーバ変更により 403 になる。ボタンの再有効化をトークンが入るまで遅らせるか、空トークンのまま送らせない措置を入れること。方式は実行者に委ねる。
- `window.turnstile` は Turnstile の CDN スクリプトが定義するグローバルで型が無い。`as any` は使わず（`context/conventions.md`）、必要最小限の `declare global` で型を与える。CDN スクリプトの読み込み前や失敗時に `undefined` になり得るので、存在チェックを挟む。

エラー文言の出し分け（400 と 403 で別メッセージにする等）は本 Issue の範囲外。

### src/lib/api.test.ts

- 既存の `Turnstile skipped when no token provided` を、`TURNSTILE_SECRET_KEY` 設定済み・`cfToken` 空で 403 になることを確認するテストに置き換える。このとき `siteverify` への `fetch` が呼ばれないことも確認する。
- `TURNSTILE_SECRET_KEY` 未設定・`cfToken` 空で処理が続行することを確認するテストを追加する。

### docs/guarantees.md

セクション1（`src/lib/api.test.ts`）を更新する。

- `cfToken` が渡されない場合にスキップする、という記述を削除し、上の「新たに宣言する保証」のサーバ側2件に置き換える。
- 対応テスト表の該当行も差し替える。

### 実装順序

`src/lib/api.ts` → `src/lib/api.test.ts` → `src/pages/contact.astro` → 台帳更新。
