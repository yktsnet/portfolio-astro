# contact-form

| 保証 | 対応テスト |
|---|---|
| `buildContactBody(form)` は `name`・`email`・`phone`・`message` の値を、フォーム内の同じ名前の入力要素から取って返す | `buildContactBody > returns the entered values for all four fields` |
| `buildContactBody(form)` は Turnstile が差し込む `cf-turnstile-response` の値を `cfToken` として返す | `buildContactBody > returns the entered values for all four fields` |
| `buildContactBody(form)` は `name` の値を `HTMLFormElement` の組み込みプロパティ `form.name` ではなく入力要素から取る | `buildContactBody > is not shadowed by HTMLFormElement built-in properties (regression for the name field bug)` |
| `buildContactBody(form)` は未入力の `message` を `undefined` ではなく空文字列で返す | `buildContactBody > returns an empty string, not undefined, when message and cf-turnstile-response are absent` |
| `buildContactBody(form)` は `cf-turnstile-response` の要素が無ければ、`cfToken` を `undefined` ではなく空文字列で返す | `buildContactBody > returns an empty string, not undefined, when message and cf-turnstile-response are absent` |
