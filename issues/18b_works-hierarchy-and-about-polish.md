## 見出し階層の再設計・About 仕上げ・ロゴ watermark
id: 18b
branch-slug: works-hierarchy-and-about-polish
github_issue:
status: close
type: feat
対象: |
  src/components/About.astro
  src/pages/index.astro
内容: |
  右カラムは「大型アウトライン見出し（Hardware 等）」と「小型 mono ラベル（Works 等）」の
  2系統が混在し、親(Works)より子(Hardware)が大きい階層逆転が起きている。これが Works リードの
  「浮き」の根本原因。Works を唯一の大型アウトライン見出しに昇格し、カテゴリを小型ラベルへ降格して
  階層を正す。併せて (a) タイムラインの年次修正、(b) 締め文の文字サイズ縮小、(c) About 右下への
  ロゴ watermark 追加を行う。
確認: |
  npm run typecheck

---

## 方針（決定事項）

- **見出し階層**: `Works` を唯一の大型アウトライン見出しに昇格。`Hardware`/`Modernization`/`Trading`/`Others` は小型の色付き mono ラベルへ降格。大型アウトラインは1回だけ＝サイトの署名として機能させる。カテゴリ色は小ラベルの文字色で保持。
- **タイムライン**: 2025 学習塾閉業／個人開発、2026〜 SES入社／技術支援。
- **締め文**: `sm:text-base` の拡大をやめ本文と同 `text-sm`。色（`poi-text`）だけ維持、装飾なし。
- **ロゴ**: About セクション右下に大きめ・低不透明度の watermark（静的）。`Logo.astro` を再利用。

---

## 変更詳細

### 1. `About.astro` — タイムライン年次修正

```diff
    {
      location: "Osaka",
      items: [
-       { year: "2025〜", label: "学習塾 閉業 / SES 入社" },
-       { year: "", label: "個人開発・技術支援" },
+       { year: "2025", label: "学習塾 閉業 / 個人開発" },
+       { year: "2026〜", label: "SES 入社 / 技術支援" },
      ],
    },
```

### 2. `About.astro` — 締め文の文字サイズ縮小

```diff
-    <p class="text-sm sm:text-base leading-8 text-zinc-800 dark:text-poi-text">
+    <p class="text-sm leading-8 text-zinc-800 dark:text-poi-text">
       人間中心に設計する。システムも AI も、既存のワークフローに自然に溶け込ませる。
     </p>
```

- サイズは本文と同じにし、色（`text-zinc-800 / dark:text-poi-text`）で「一段明るい最後の一文」として浮かせる。

### 3. `About.astro` — ロゴ watermark を右下に追加

`Logo.astro`（`src/layouts/Logo.astro`、`size`/`class` を受け取る SVG）を import し、`section` を
`relative` にして右下に低不透明度で配置する。

```diff
 ---
+import Logo from '../layouts/Logo.astro';
+
 type TimelineEntry = { year: string; label: string };
```

```diff
-<section class="mb-20 pb-16 border-b border-zinc-200/50 dark:border-poi-border/40">
+<section class="relative mb-20 pb-16 border-b border-zinc-200/50 dark:border-poi-border/40">
+  <!-- ブランド watermark: タイムライン右の余白を埋める。テキストは左寄せのため重ならない -->
+  <Logo
+    size={140}
+    class="pointer-events-none absolute bottom-16 right-0 opacity-[0.07] dark:opacity-[0.1] select-none"
+  />
   <div class="space-y-5 text-zinc-600 dark:text-poi-muted">
```

- ロゴは DOM 上で最初の子に置き、後続のテキストが上に描画されるようにする（テキストは左カラム、ロゴは右下なので実質重ならない）。
- `size`・`bottom`/`right`・`opacity` は実機で調整（タイムライン右の空きに収め、本文と被らせない）。被りが出る場合は `-z-10` を付与してよい（実装者判断）。

### 4. `index.astro` — Works 昇格・カテゴリ降格

#### 4-1. Works 導入を大型アウトライン見出し＋リードに置換

```diff
-      <div class="mb-12">
-        <p class="font-mono text-xs text-poi-accent tracking-widest mb-3">Works</p>
-        <p class="text-sm leading-7 text-zinc-600 dark:text-poi-muted">
-          レガシーの作り直しから、IoT、LLM エージェント、自動売買まで。設計判断とともに。
-        </p>
-      </div>
+      <div class="mb-14">
+        <h2
+          class="mb-3 font-mono text-3xl sm:text-4xl font-normal tracking-tight select-none opacity-70"
+          style="-webkit-text-stroke: 1px #5de4c7; color: transparent;"
+        >
+          Works
+        </h2>
+        <p class="text-sm leading-7 text-zinc-600 dark:text-poi-muted">
+          レガシーの作り直しから、IoT、LLM エージェント、自動売買まで。設計判断とともに。
+        </p>
+      </div>
```

- アウトライン色は `poi-accent`（#5de4c7）。リードは見出し直下（`mb-3`）に詰めて固定し、浮きを解消する。

#### 4-2. カテゴリ見出しを小型 mono ラベルへ降格

カテゴリ間の区切りは大型見出しを失うため、`border-t` を撤去し余白（`mt-12`）で分ける。
カテゴリ色は小ラベルの文字色として保持する。

```diff
        {grouped.map(({ category, items }, i) => (
-         <div class={i > 0 ? "mt-16 border-t border-zinc-200 dark:border-poi-border pt-10" : ""}>
-           <h2
-             class="mb-2 font-mono text-2xl sm:text-3xl font-normal tracking-tight select-none opacity-60"
-             style={`-webkit-text-stroke: 1px ${items[0].color}; color: transparent;`}
-           >
-             {category}
-           </h2>
-           <p class="mb-6 text-sm text-zinc-500 dark:text-poi-muted">
-             {categoryMeta[category]}
-           </p>
+         <div class={i > 0 ? "mt-12" : ""}>
+           <div class="mb-6">
+             <p
+               class="font-mono text-xs font-medium tracking-widest uppercase mb-1"
+               style={`color: ${items[0].color}`}
+             >
+               {category}
+             </p>
+             <p class="text-sm text-zinc-500 dark:text-poi-muted">
+               {categoryMeta[category]}
+             </p>
+           </div>
```

- `<h2>`（大型アウトライン）→ カテゴリ色の小型 mono ラベルに変更。これでページ内の大型アウトラインは Works 1箇所のみになる。
- カテゴリ間の余白（`mt-12`）は実機で調整。区切り線が欲しい場合のみ薄い `border-t border-poi-border/30 pt-10` を足してよい（実装者判断）。

---

## 非対象

- `HeroDesktop.astro` のサイドバー「2025〜」バッジ（IT 着手＝個人開発開始の 2025 を指すため据え置き）
- `HeroMobile.astro`
- Works カードの構造・`works.ts` のデータ
- About の `max-w-xl` 幅・`border-b` 区切り・タイムラインのノード実装（既存確定）
