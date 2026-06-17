## 変更内容

モバイルビューでHeroのメタ情報が詰まって見える・カテゴリ見出しが大きすぎる問題を修正。
余白・構造・フォントサイズを調整して読みやすくする。

### HeroMobile.astro
- アバターサイズを `h-24 w-24` → `h-28 w-28` に拡大
- メタ情報を `flex-wrap` + `<span class="w-full sm:hidden" />` による強制改行から、2段の `flex` 構造に分割
  - 1段目: Osaka / ykts.net / GitHub
  - 2段目: 2025〜 / Posts / Contact
- メタ情報の上マージンを `mt-3` → `mt-4` に拡大、行間を `gap-y-1` → `gap-2` に拡大

### index.astro
- カテゴリ見出しサイズを `text-5xl` → `text-4xl sm:text-5xl` にレスポンシブ化
- Hero 下余白を `mb-12` → `mb-16` に拡大

## 静的確認結果

- `npm run typecheck`: 0 errors, 0 warnings（12 hints は既存のもの）
- import・構造の整合性: `getLucideIcon` の import は既存のまま維持、全リンク・アイコンが正しく配置されていることをコードで確認

## 検証手順

- `npm run dev` を起動し http://localhost:4321 をモバイル幅（~375px）で確認
  - Hero のアバターが少し大きくなっている
  - メタ情報が2行に分かれて表示される（1行目: Osaka / ykts.net / GitHub、2行目: 2025〜 / Posts / Contact）
  - メタ情報の行間に適度な余白がある
  - Hero と Works セクション間の余白が広がっている
  - カテゴリ見出し（Hardware / Modernization / Finance）がモバイルでは小さめに表示される
- デスクトップ幅（640px以上）でカテゴリ見出しが従来と同じ `text-5xl` で表示されることを確認
