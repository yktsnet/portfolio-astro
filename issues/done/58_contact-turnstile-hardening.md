## PR記録: fix: Contact フォームの Turnstile 回避を塞ぎ、失敗後の再送を成立させる
issue: 58 (58_contact-turnstile-hardening.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/127
Merged: f23ca31f8b3e846a60a91459fb51a2fcc3a3e88e

## 変更内容

`POST /api/contact` は `cfToken` が空だと Turnstile 検証を丸ごと飛ばして通すため、トークンを付けずに叩けば誰でも検証を回避して Telegram へ送信できた。空トークンを拒否するよう条件を反転した。あわせて、送信失敗時に使用済みトークンが残り再送が必ず失敗する問題を、Turnstile ウィジェットのリセットで解消した。

- `src/lib/api.ts`: `tsSecret && token` だった分岐を `tsSecret` の有無だけで分岐させ、secret 設定済みで token が空なら `siteverify` を呼ばずに 403 `{ error: 'turnstile_failed' }` を返すようにした。検証失敗時は `siteverify` 応答の `error-codes` を `console.warn` に出すようにした（レスポンス本文は変更なし）。
- `src/lib/api.test.ts`: 既存の `Turnstile skipped when no token provided` を、secret 設定済み・cfToken 空で 403 になり `siteverify` への fetch が呼ばれないことを確認するテストに置き換えた。secret 未設定・cfToken 空で処理が続行することを確認するテストを追加した。
- `src/pages/contact.astro`: 送信失敗時（`data.ok` が偽、および catch 節）に `window.turnstile.reset()` を呼ぶようにした。新トークンの発行が反映されるまで送信ボタンを再有効化しないようにし、空トークンでの再送を防いだ。`window.turnstile` は `as any` を使わず `declare global` で最小限の型を与え、存在チェックを挟んだ。
- `docs/guarantees.md`: セクション1を更新し、`cfToken` 省略時にスキップする旧保証を削除して新保証2件に置き換えた。対応テスト表の該当行も差し替えた。

## 保証

- 新たに宣言:
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が設定されている場合、`cfToken` が空または未指定なら Turnstile 検証を行わずに 403 を返す → `src/lib/api.test.ts` の `POST /api/contact > 403 when secret is set but cfToken is empty, without calling siteverify`
  - `POST /api/contact` は `TURNSTILE_SECRET_KEY` が未設定の場合、`cfToken` の有無にかかわらず Turnstile 検証をスキップして処理を続行する → `src/lib/api.test.ts` の `POST /api/contact > 200 when secret is not set, regardless of cfToken`
  - Contact フォームは送信が失敗したとき Turnstile ウィジェットをリセットし、次の送信で新しいトークンが使われる状態にする → なし（`window.turnstile` に依存するブラウザ挙動で本リポにテスト基盤が無いため。Issue で申告済み・裁可事項）
- 廃止:
  - `POST /api/contact` は `cfToken` が渡されない場合、`TURNSTILE_SECRET_KEY` が設定されていても Turnstile 検証をスキップして処理を続行する → `docs/guarantees.md` から削除済み
- 維持: JSON パースエラー時 400 / 必須項目欠落時 400 / Turnstile 検証失敗時 403 / Telegram 未設定時 500 / Telegram 成功時 200・失敗時 502 / `buildContactBody` 関連（セクション2）はすべて既存テストのまま変更なし

## 静的確認結果

- `npm run typecheck`: 0 errors / 0 warnings（既存の RightNav.astro 未使用変数の warning、Turnstile CDN スクリプトの is:inline hint は本変更と無関係の既存事項）
- `npm run test`: 2 files / 18 tests すべて成功
- import・caller 整合性: `src/lib/api.ts` の型変更（`tsData` に `error-codes` 追加）はローカル型のみで外部 caller に影響なし。`src/pages/contact.astro` の `declare global` は同ファイル内スコープで完結し他ファイルに影響なし。`git diff --name-only --cached` は `docs/guarantees.md` / `src/lib/api.test.ts` / `src/lib/api.ts` / `src/pages/contact.astro` で Issue の「対象」フィールドと完全一致

## 検証手順

1. ローカルまたはデプロイ環境で `/contact/` を開き、Turnstile ウィジェットを表示せずに（devtools 等で hidden input `cf-turnstile-response` を空にして）フォームを送信 → 403 になり送信されないことを確認
2. 正規のフローで送信を1回失敗させた後（例: 一時的にネットワークを切る）、画面上のウィジェットが自動でリセットされ、数秒後に送信ボタンが再度押せるようになり、再送が成功することを確認

