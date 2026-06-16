## コードベース保守性改善
id: 09
branch-slug: maintainability
github_issue:
status: close
type: cleanup
対象: |
  src/pages/index.astro
  src/data/works.ts
  src/components/HeroMobile.astro (新規)
  src/components/HeroDesktop.astro (新規)
内容: |
  調査で判明した保守性の問題を解消する。見た目の変更は行わない。
  1. Hero を分割: index.astro の sm:hidden / hidden sm:block の重複を
     HeroMobile.astro・HeroDesktop.astro に抽出
  2. works.ts の brand を Union type で型安全化
確認: |
  - index.astro の行数が大幅に減少していること
  - HeroMobile.astro・HeroDesktop.astro が存在し、index.astro から import されていること
  - works.ts の brand に存在しない値を入れると TypeScript エラーになること
  - 見た目が変わっていないこと
  - npm run typecheck が通ること

---

## 設計メモ

### 1. Hero コンポーネント分割

index.astro から Hero を抽出する。モバイルとデスクトップで構造が異なるため別ファイルに分離。

```
src/components/
  HeroMobile.astro   ← sm:hidden で表示（縦積み）
  HeroDesktop.astro  ← hidden sm:block で表示（sticky sidebar）
```

index.astro 側:
```astro
---
import HeroMobile from '../components/HeroMobile.astro';
import HeroDesktop from '../components/HeroDesktop.astro';
---
<div class="sm:hidden mb-12">
  <HeroMobile />
</div>
<div class="flex gap-12">
  <HeroDesktop />
  <main class="flex-1 min-w-0">
    <!-- Works -->
  </main>
</div>
```

### 2. works.ts brand の型安全化

```ts
// 有効な brand キーを Union type で定義
type BrandKey =
  | "raspberry-pi"
  | "python"
  | "googleappsscript"
  | "picow"
  | "fastapi"
  | "postgresql"
  | "lineapi"
  | "react"
  | "hono"
  | "cloudflare";

interface StackItem {
  label: string;
  brand?: BrandKey;  // string → BrandKey
}
```
