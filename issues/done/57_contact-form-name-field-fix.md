## PR記録: fix: Contact フォームが name フィールドを送れず常に送信失敗する不具合を修正
issue: 57 (57_contact-form-name-field-fix.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/125
Merged: 67d5392f02d0604a34e2f1a0eba4d48b1294f55d

## 変更内容
送信スクリプトが `name` フィールドの値を取得できず、API に `name` を欠いたボディを送るため常に 400 になっていた不具合を修正した。

- `src/lib/contact-form.ts`（新規）: ボディ組み立てを `buildContactBody(form)` として切り出し。`form.elements.namedItem(n)` 経由で値を取得する（`form[n]` は使わない。`HTMLFormElement` の組み込みプロパティ `name` に input 要素が shadow される、本不具合の原因そのもののため）。値が取れない場合は `undefined` ではなく `''` を返す。
- `src/pages/contact.astro`: ボディ組み立てを `buildContactBody(form)` の呼び出しに置き換え。`script is:inline` は import を持てないため `is:inline` を外し、Astro にバンドルさせた（Turnstile の CDN `<script src=...>` はそのまま）。
- `src/lib/contact-form.test.ts`（新規）: `@vitest-environment happy-dom` で DOM 環境の単体テストを追加し、name フィールドの shadow 回帰・未入力時の空文字列返却を固定。
- `package.json` / `package-lock.json`: devDependencies に `happy-dom` を追加（`package.json` を変更したことに伴う機械的な追随のため、Issue の対象フィールドに明記は無いが同梱した）。
- `docs/guarantees.md`: `12` 行目の陳腐化（`category` は `src/lib/api.ts:95` で検証されていない）を訂正。`buildContactBody` の新規保証セクションを追加。

## 保証
- `buildContactBody(form)` は `name`/`email`/`phone`/`message` の各値を対応する入力要素から取得して返す → `src/lib/contact-form.test.ts` の `buildContactBody > returns the entered values for all four fields`
- `buildContactBody(form)` は `name` 属性が `HTMLFormElement` 組み込みプロパティと衝突しても入力値を返す（本不具合の回帰） → `src/lib/contact-form.test.ts` の `buildContactBody > is not shadowed by HTMLFormElement built-in properties (regression for the name field bug)`
- `buildContactBody(form)` は対応要素が無いフィールドについて `undefined` ではなく `''` を返す → `src/lib/contact-form.test.ts` の `buildContactBody > returns an empty string, not undefined, when message and cf-turnstile-response are absent`
- `buildContactBody(form)` は `cf-turnstile-response` の値を `cfToken` として返し、無ければ `''` を返す → 上記2テストでカバー（値ありは1件目、値無しは3件目）
- 既存の `POST /api/contact` の保証（invalid_json / 必須項目欠落 / Turnstile検証 / Telegram送信結果）は本 Issue で変更していない → `src/lib/api.test.ts`（既存、変更なし）

## 静的確認結果
- `npm run typecheck`: 0 errors / 0 warnings / 2 hints（ヒントは本変更と無関係の既存事象: `RightNav.astro` の未使用変数、Turnstile CDN script の is:inline 自動判定）
- `npm run test`: 2 test files / 17 tests すべて成功（既存 `api.test.ts` 14件 + 新規 `contact-form.test.ts` 3件）
- import・caller整合性: `contact.astro` の `<script>` 内 import は相対パス `../lib/contact-form` で解決し、`buildContactBody` のシグネチャ（`HTMLFormElement` → `ContactBody`）と呼び出し側の型注釈（`e.target as HTMLFormElement`）が一致することを確認
- `git diff --name-only --cached`: docs/guarantees.md, package-lock.json, package.json, src/lib/contact-form.test.ts, src/lib/contact-form.ts, src/pages/contact.astro（Issueの対象フィールドに package-lock.json の明記は無いが、package.json への devDependency 追加に伴う機械的な追随として同梱。本リポの既存コミット履歴でも package.json 変更時は package-lock.json を常に同梱している）

## 検証手順
1. デプロイ後、`/contact/` にアクセスしフォームへ名前・メール・電話番号を入力して送信する
2. 「ありがとうございます。メッセージを送信しました。」が表示され、Telegram に通知が届くことを確認する
3. ブラウザの開発者ツール Network タブで `/api/contact` へのリクエストボディに `name` が空文字列でなく入力した値で含まれていることを確認する
