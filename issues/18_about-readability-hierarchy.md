## About セクション 可読性・階層の強化
id: 18
branch-slug: about-readability-hierarchy
github_issue:
status: close
type: fix
対象: |
  src/components/About.astro
内容: |
  About は実装済み（Issue 16/16a/17）だが、3段落が均質な濃さ・サイズで並び「壁」になっている。
  右ペインの入口として、リード文の強調・本文コントラスト・意味ブロック分割・締め文の独立で
  typographic hierarchy を立て、視認性を上げる。参照サイト（Abhishek Ghimire portfolio）の
  エディトリアルな読ませ方を踏襲する。タイムラインはノード（●）を加えて時系列を視覚化する。
確認: |
  npm run typecheck

---

## 背景

現状の本文は `text-sm leading-7 text-zinc-600 dark:text-poi-muted` で 2 段落が同一トーン。
入口となる 1 文が埋もれ、視線の止まる場所がない。色トークンは `tailwind.config.mjs` の
`poi-*` を使用する（リード明色は `poi-focus` #e4f0fb、本文は `poi-text`/`poi-muted` #a6accd）。

---

## 変更詳細

対象は `src/components/About.astro` のみ。データ構造（`timeline`）は変更しない。

### 1. 本文ブロックの再構成（リード強調・意味分割・締め独立）

現状の 2 段落 `<div>` を、以下の 3 ブロック構成に置き換える。

- **リード文**: 冒頭 1 文を本文より大きく・明るく。入口にする。
- **本文**: 経歴と現在の活動。意味で段落を分け、行間を広げる。
- **締め文**: 「AI をワークフローに〜」をステートメントとして独立・強調。

```diff
- <div class="space-y-3 text-sm leading-7 text-zinc-600 dark:text-poi-muted">
-   <p>
-     大学を出てすぐ塾を開業し、12年間経営した。法人を立て、イベントスペースとプログラミング教育支援も手がけた。
-     経営者として現場に向き合ったことで、技術が導入される側の景色を知った。コスト感覚、現場の抵抗、使われなくなるまでの経緯。
-   </p>
-   <p>
-     2025年に IT へ転身。いまは SES で開発に携わりながら、個人開発と小さな組織への技術支援を並行している。
-     設計から運用まで一人で通すことが多い。AI をワークフローに組み込むことに、今は一番時間を使っている。
-   </p>
- </div>
+ <div class="space-y-5 text-zinc-600 dark:text-poi-muted">
+   <!-- リード: 1文だけ大きく・明るく -->
+   <p class="text-base sm:text-lg leading-8 text-zinc-900 dark:text-poi-focus">
+     大学を出てすぐ塾を開業し、12年間経営した。
+   </p>
+
+   <!-- 本文: 意味ブロックで分割 -->
+   <p class="text-sm leading-8">
+     法人を立て、イベントスペースとプログラミング教育支援も手がけた。
+     経営者として現場に向き合ったことで、技術が導入される側の景色を知った。コスト感覚、現場の抵抗、使われなくなるまでの経緯。
+   </p>
+   <p class="text-sm leading-8">
+     2025年に IT へ転身。いまは SES で開発に携わりながら、個人開発と小さな組織への技術支援を並行している。
+     設計から運用まで一人で通すことが多い。
+   </p>
+
+   <!-- 締め: ステートメントとして独立 -->
+   <p class="text-sm sm:text-base leading-8 text-zinc-800 dark:text-poi-text">
+     AI をワークフローに組み込むことに、今は一番時間を使っている。
+   </p>
+ </div>
```

- リードと締めは light モードで `zinc-900`/`zinc-800`、dark で `poi-focus`/`poi-text` を使い分け、本文より一段明るくする。
- 行間は `leading-7` → `leading-8` に広げる（日本語の可読性優先）。
- 文の区切り位置（どの 1 文をリードにするか／段落の割り方）は上記を基準に、実際の表示で調整可。

### 2. タイムラインにノード（●）を追加

現状は左縦線（`border-l`）のみでイベント位置が分かりにくい。各行頭にドットを置き、時系列のノードを明示する。

```diff
-       <div class="border-l border-zinc-600 pl-4 space-y-2">
+       <div class="border-l border-zinc-600 pl-5 space-y-2.5">
          {items.map(({ year, label }) => (
-           <div class="flex items-baseline gap-5 text-sm">
+           <div class="relative flex items-baseline gap-5 text-sm">
+             <span class="absolute -left-[1.4rem] top-1.5 w-1.5 h-1.5 rounded-full bg-zinc-500 dark:bg-poi-accent"></span>
              <span class="font-mono text-xs text-zinc-500 w-10 shrink-0 tabular-nums">{year}</span>
              <span class="text-zinc-600 dark:text-poi-muted">{label}</span>
            </div>
          ))}
        </div>
```

- ドットは縦線上に重なる位置（`-left-[1.4rem]`）に配置。`pl-4`→`pl-5` でラベルとの間隔を確保。
- dark はアクセント色（`poi-accent`）、light は `zinc-500`。`@Location` 見出しとの色の競合が強い場合は dark も `zinc-500` に統一可（実装者判断）。
- ドット位置（`-left` 値・`top` 値）は縦線とドットが揃うよう実機で微調整する。

### 3. 本文とタイムラインの間隔

階層が増えるため、タイムラインブロックの上余白を少し広げる。

```diff
-  <div class="mt-8 space-y-6">
+  <div class="mt-12 space-y-6">
```

---

## 非対象

- `timeline` のデータ構造・場所グループ化（Issue 17 で確定）は変更しない。
- 右ペインの `max-w-xl` 幅（Issue 16a で確定）は変更しない。
- `border-b` の区切り（Issue 16a で確定）は変更しない。
