## 変更内容

- Works の上部に About セクション（自己紹介文 + タイムライン）を新設
- HeroDesktop / HeroMobile の日本語テキストを About に統合して削除
- カテゴリタイトルのサイズを `text-4xl/5xl` → `text-2xl/3xl` に縮小し、余白で章の区切りを表現するエディトリアルな構成に変更

## 静的確認結果

- `npm run typecheck`: 0 errors, 0 warnings（既存の hints 12件のみ、新規なし）
- import 整合性: `About.astro` は `index.astro` で import・配置済み
- `HeroDesktop.astro` / `HeroMobile.astro` から日本語テキスト段落を削除。周囲の要素に影響なし

## 検証手順

- `npm run dev` を起動し http://localhost:4321 を開く
- トップページの Works 一覧の上に About セクション（自己紹介文 + タイムライン）が表示されることを確認
- 左サイドバー（デスクトップ）/ モバイルヒーローから日本語テキストが削除されていることを確認
- カテゴリタイトル（Hardware, Modernization 等）のフォントサイズが縮小されていることを確認
- モバイル表示（ブラウザ幅を狭くする）でも About セクションが正しく表示されることを確認
