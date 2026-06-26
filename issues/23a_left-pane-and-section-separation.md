## 左ペインナビ強化・セクション分離感の改善
id: 23a
branch-slug: left-pane-section-separation
github_issue: 34
status: open
type: feat
対象: |
  src/components/HeroDesktop.astro
  src/components/HeroMobile.astro（アンカーリンク追加の影響があれば）
  src/components/About.astro
  src/components/Approach.astro
  src/components/Impact.astro
  src/pages/index.astro（script 追加）
  src/lib/lucide.ts（Zenn アイコン追加が必要な場合）
内容: |
  Issue 23 で新設した APPROACH・IMPACT の視認性を改善する。
  1. 左ペインのアンカーリンクをナビとして機能させる
  2. 外部リンク（GitHub / Posts / Contact）をアイコンのみに縮小、Posts を Zenn に差し替え
  3. セクション間の分離感を出す（ラベル色・余白）
確認: |
  npm run typecheck が通ること
  npm run build が通ること

---

## 1. 左ペインナビの再構成

### アンカーリンクの視覚強化
- About / Approach / Impact / Works のアンカーリンクを左ペインの主要ナビとして機能させる
- フォントサイズを外部リンクより一段大きくする（現状 `text-sm` → `text-base` 程度）
- `IntersectionObserver` でスクロール連動のアクティブ表示を実装する
  - 現在表示中のセクションに対応するリンクを `poi-accent` でハイライト
  - 非アクティブは `poi-muted`
  - `<script>` タグで実装（React アイランドにしない。既存の Works フィルタと同じパターン）

### 外部リンクをアイコンのみに縮小
現状:
```
GitHub（テキスト + アイコン）
Posts（テキスト + アイコン）
Contact（テキスト + アイコン）
```

変更後:
```
(GitHub アイコン)  (Zenn アイコン)  (Contact アイコン)
```

- 横並び、アイコンのみ（テキストラベルなし）
- サイズは目立たない程度（12〜14px 程度、現状と同じか少し小さく）
- hover で `poi-accent` に色変化
- `aria-label` でアクセシビリティ確保
- **Posts を Zenn に差し替え**: href を Zenn プロフィール URL に変更、アイコンも Zenn のものに（Zenn のブランドアイコンを `src/lib/lucide.ts` または直接 SVG で追加）

### ナビとリンクの階層分離
- アンカーリンク群と外部リンクアイコン群の間に余白（`mt-6` 程度）を入れて階層を分ける

### 左ペイン全体の構成（上から順）
```
プロフィール画像
名前
Builder
プロフィール文（英文、既存のまま）

About        ← アンカーリンク（text-base）
Approach
Impact
Works

(余白)

🔗 🔗 🔗    ← GitHub / Zenn / Contact（アイコンのみ、横並び）
```

## 2. セクション分離感の改善

### ABOUT のラベル色を無彩色に
- About セクションのラベル（`ABOUT`）の色を `poi-accent` → `poi-muted` に変更
- ABOUT は「前置き」、APPROACH / IMPACT は「主張」という格差を色で示す

### セクション間の余白拡大
- ABOUT → APPROACH、APPROACH → IMPACT のセクション間余白を現状より広げる
  - 現状 `mb-20 pb-16` → `mb-28 pb-20` 程度に拡大
- 区切り線（`border-b`）の色をやや濃くする（`border-zinc-200/50 dark:border-poi-border/40` → `dark:border-poi-border/60` 程度）

## Zenn アイコンについて

Zenn のブランドアイコン（ロゴ）の SVG パスを調達する必要がある。方法:
- `simple-icons` パッケージに Zenn があれば `src/lib/brand-icons.ts` から re-export
- なければ Zenn 公式のロゴ SVG を直接 `src/lib/lucide.ts` に追加

Zenn プロフィール URL は `https://zenn.dev/yktsnet`（要確認）。

## デザイン原則（Issue 23 から継続）

- Poimandres テーマ（`poi-*`）を使う
- 新しいカラーを Tailwind config に追加しない
- IntersectionObserver は `<script>` タグで素朴に実装（ライブラリ不要）
