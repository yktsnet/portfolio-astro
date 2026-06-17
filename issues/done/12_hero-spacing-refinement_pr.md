## 変更内容
スクショ確認の結果、Heroサイドバーと Works エリアが全体的に詰まって見えるため、余白・サイズを調整して呼吸感を出す。

### HeroDesktop.astro
- `aside` 幅: `w-52` → `w-56`
- アバター: `h-24 w-24` → `h-32 w-32`
- 名前 wrapper: `mt-3` → `mt-5`
- `h1` サイズ: `text-xl` → `text-2xl`
- Builder `<p>`: `mt-0.5` → `mt-1`
- バイオ `<p>`: `mt-4` → セパレーター (`border-t mt-5 pt-5`)
- リンクリスト: `mt-4 space-y-1` → `mt-5 space-y-2`

### index.astro（Works エリア）
- Works カード間: `space-y-6` → `space-y-10`
- カテゴリ見出し下余白: `mb-6` → `mb-8`

## 静的確認結果
- `npm run typecheck`: エラー 0 件
- import・caller 整合性: HeroDesktop.astro は index.astro から参照されており変更なし。Tailwind ユーティリティクラスのみの変更のため依存関係に影響なし。

## 検証手順
- `npm run dev` を起動し http://localhost:4321 を開く
- デスクトップ幅 (≥640px) で Hero サイドバーの余白・アバターサイズ・セパレーター表示を確認
- Works カード間の余白が広がっていることを確認
- モバイル幅 (<640px) では HeroDesktop が非表示であることを確認（既存動作に影響なし）
