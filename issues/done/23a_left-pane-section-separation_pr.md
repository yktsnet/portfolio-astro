## 変更内容

Issue #34 で指定された左ペインナビ強化・セクション分離感の改善を実施。

### 1. 左ペインナビの再構成（HeroDesktop.astro / HeroMobile.astro）

- アンカーリンク（About / Approach / Impact / Works）のフォントサイズを `text-sm` → `text-base` に拡大し、主要ナビとして格上げ
- 各リンクに `data-nav-link` / `data-section` 属性を付与し IntersectionObserver と連携
- 外部リンク（GitHub / Posts / Contact）をアイコンのみ・横並びの3アイコン行に縮小
  - Posts → **Zenn**（`https://zenn.dev/yktsnet`）に差し替え
  - `aria-label` でアクセシビリティ確保
- アンカーリンク群と外部リンク群の間に `mt-6` の余白を追加
- HeroMobile も同様に GitHub / Zenn / Contact のアイコンのみ横並びに統一

### 2. IntersectionObserver によるスクロール連動ハイライト（index.astro）

- `<script>` ブロックを追加（既存 Works フィルタと同じパターン）
- 現在表示中のセクションに対応するリンクを `#5de4c7`（poi-accent）でハイライト
- `rootMargin: '-10% 0px -65% 0px'` でセクションがビューポート上部に入ったときに発火

### 3. セクション分離感の改善（About.astro / Approach.astro / Impact.astro）

- About のラベル色: `text-poi-accent` → `text-poi-muted`（前置きと主張の格差を色で表現）
- 全セクションの底余白: `mb-20 pb-16` → `mb-28 pb-20`（セクション間を広げて分離感を強化）
- 区切り線: `dark:border-poi-border/40` → `dark:border-poi-border/60`（やや濃くして視認性向上）

### 4. Zenn アイコン追加（brand-icons.ts）

- `simple-icons` に `siZenn` が存在したため、`src/lib/lucide.ts` ではなく `src/lib/brand-icons.ts` に追加
  （Issue 本文の「`simple-icons` にあれば `brand-icons.ts` から re-export」に従った）

## 静的確認結果

### import・caller 整合性

- `HeroDesktop.astro` / `HeroMobile.astro` が `getBrandIcon('zenn')` を呼び出し → `brand-icons.ts` に `"zenn"` エントリ追加済み ✓
- `index.astro` の IntersectionObserver が `[data-nav-link]` / `data-section` 属性を参照 → `HeroDesktop.astro` に属性付与済み ✓
- `getLucideIcon` は引き続き `mail` 等を使用 → 変更なし ✓

### npm run typecheck

```
Result (31 files):
- 0 errors
- 0 warnings
- 12 hints
```

### npm run build

```
[build] Complete!
Pagefind: Finished in 0.655 seconds
```

### git diff --name-only HEAD~1

```
src/components/About.astro
src/components/Approach.astro
src/components/HeroDesktop.astro
src/components/HeroMobile.astro
src/components/Impact.astro
src/lib/brand-icons.ts
src/pages/index.astro
```

## 検証手順

- `npm run dev` 起動後、トップページを開く
- デスクトップ幅（768px 以上）でスクロールし、左ペインのアンカーリンクが poi-accent でハイライトされることを確認
- 外部リンク（GitHub / Zenn / Contact）がアイコンのみ3つ横並びで表示されることを確認
- Zenn リンク（`https://zenn.dev/yktsnet`）が正しく開くことを確認
- ABOUT ラベルが poi-muted（無彩色）で表示されることを確認
- セクション間の余白が広くなっていることを確認
