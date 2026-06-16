## フォントサイズ調整
id: 07
branch-slug: font-size-adjustment
github_issue:
status: open
type: feat
対象: |
  src/pages/index.astro
内容: |
  全体的に文字が小さすぎるため、可読性を上げるサイズ調整を行う。
  メタ情報・スタックタグは据え置き、コンテンツとして読む部分を引き上げる。
  1. Builder ラベル: text-xs → text-sm
  2. bio テキスト: text-xs → text-sm
  3. Works h3 タイトル: text-base → text-lg
  4. Works 説明文: text-xs → text-sm
  5. Works リンク: text-xs → text-sm
確認: |
  - Builder が text-sm で表示されること
  - bio が text-sm で表示されること
  - Works h3 が text-lg で表示されること
  - Works 説明文が text-sm で表示されること
  - Works リンクが text-sm で表示されること
  - メタ情報（Osaka / ykts.net 等）・スタックタグは text-xs のままであること
  - npm run typecheck が通ること

---

## 設計メモ

### 変更箇所一覧

| 要素 | 変更前 | 変更後 | 据え置き理由 |
|---|---|---|---|
| Builder ラベル | text-xs | text-sm | |
| bio テキスト | text-xs | text-sm | |
| Works h3 タイトル | text-base | text-lg | |
| Works 説明文 | text-xs | text-sm | |
| Works リンク | text-xs | text-sm | |
| メタ情報 | text-xs | — | 補助情報なので小さくてよい |
| スタックタグ | text-xs | — | ラベルなので小さくてよい |
