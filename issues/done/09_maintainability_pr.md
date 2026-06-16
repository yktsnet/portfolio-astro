## 変更内容

調査で判明した保守性の問題を解消する。見た目の変更は行わない。

1. **Hero コンポーネント分割**: `index.astro` の `sm:hidden` / `hidden sm:block` で重複していた Hero マークアップを `HeroMobile.astro`・`HeroDesktop.astro` に抽出。`index.astro` の行数を 237 行 → 120 行に削減。

2. **`works.ts` の brand を Union type で型安全化**: `StackItem.brand` の型を `string` から `BrandKey`（`brand-icons.ts` に登録されている全キーを列挙した Union type）に変更。存在しないブランドキーを指定した場合に TypeScript エラーが発生するようになった。

## 静的確認結果

- `index.astro` の行数: 237 行 → 120 行（大幅削減）✅
- `HeroMobile.astro`・`HeroDesktop.astro` が `src/components/` に存在し、`index.astro` から import されていること ✅
- `works.ts` の `brand` に `BrandKey` 型が適用され、存在しないキーを指定すると TypeScript エラーになること ✅
- HTML 構造・Tailwind クラスは元の実装と完全一致（見た目の変更なし）✅
- `npm run typecheck`: 0 errors, 0 warnings ✅

## 検証手順

- `npm run dev` を起動し http://localhost:4321 を確認する
  - モバイル幅（< 640px）でプロフィール画像・名前・bio・メタ情報が縦積みで表示されること
  - デスクトップ幅（≥ 640px）で左サイドバーに Hero、右に Works カードが表示されること
  - 見た目が変わっていないこと
