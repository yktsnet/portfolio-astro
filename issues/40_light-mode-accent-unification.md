## ライトモードのアクセント色をピンクに統一する
id: 40
branch-slug: light-mode-accent-unification
github_issue: 71
status: close
type: fix
対象: |
  tailwind.config.mjs
  src/styles/global.css
  src/components/Impact.astro
内容: |
  ライトモードでアクセント色がピンク（light.accent #d0679d）とティール（poi.accent #5de4c7）で
  混在している。`dark:` ガードなしの `poi-accent` 系クラスが約70箇所あり、ライトモードで
  ティールがそのまま出るため（白背景でのコントラスト比 約1.5:1）。
  トークン定義を CSS 変数化し、ライト=ピンク / ダーク=ティールに一括で統一する。
確認: |
  `npm run typecheck` と `npm run build` が通ること。
  `bg-poi-accent/[0.06]` 等の opacity modifier 付きクラスがビルド後 CSS で
  正しく alpha 付きの色に展開されていることを dist の CSS を読んで確認すること。

---

## 背景

- デザイン意図は「ライト=ピンク / ダーク=ティール」。その証拠に WorkCard・About のリンク・LiveStatusStrip・`src/pages/index.astro` のグローアニメーション（`card-glow-light` が `#d0679d`、`card-glow-dark` が `#5de4c7` とコメント付きで使い分け）では `text-light-accent dark:text-poi-accent` のペアが守られている。
- 一方、HeroDesktop / HeroMobile / WorkFilter / Approach / Impact / InfrastructureBlueprint などでは素の `poi-accent` が使われ、ライトモードでもティールが出る。About ページでは「具体例を Works で見る →」（ピンク）と直下の `@Management` ラベル（ティール）が同一画面で並ぶ。
- 素の `poi-accent` は約70箇所あり、1箇所ずつ `light-accent dark:poi-accent` ペアに書き換えるのは漏れやすく保守もしづらい。**トークン側で解決する**。

## 方針（この形で実装する。個別クラスの一括書き換えはしない）

1. `src/styles/global.css` に CSS 変数を定義する:
   - `:root` で `--color-accent: 208 103 157;`（ピンク #d0679d の RGB 値）
   - `.dark` で `--color-accent: 93 228 199;`（ティール #5de4c7 の RGB 値）
2. `tailwind.config.mjs` の `poi.accent` を `"rgb(var(--color-accent) / <alpha-value>)"` に変更する。
   `<alpha-value>` プレースホルダを使わないと `bg-poi-accent/[0.06]` 等の opacity modifier が壊れる点に注意。
3. これにより既存の素の `text-poi-accent` 等は自動的にライトでピンク・ダークでティールになる。
   既存の `text-light-accent dark:text-poi-accent` ペアも両モードで従来どおりの色になるため、
   ペアの掃除（`light-accent` の廃止）は本 Issue のスコープ外とする。触らない。

## 個別対応が必要な箇所

- `src/components/Impact.astro` のドット背景（`bg-[radial-gradient(#5de4c7_1px,transparent_1px)]`）は
  hex 直書きなのでトークン変更が効かない。`rgb(var(--color-accent))` を使う arbitrary value に置き換えるか、
  同等の見た目になる別の書き方にする。
- `poi.accent-hover`（#4ebca5）の扱い: 使用箇所を grep で確認し、テキスト色として使われていれば
  同様に CSS 変数化（ライト用の hover 色はピンクを1段濃くした値を選ぶ）。装飾的用途のみなら現状維持でよい。

## 制約

- ダークモードの見た目は1px も変えない（ティールのまま）。
- `poi` の他のトークン（base / focus / muted / border 等）は触らない。
- コンポーネント側のクラス書き換えは Impact.astro の hex 直書き以外行わない。

## 検証手順（user 向け）

- ライトモードで `/`・`/about/`・`/approach/`・`/impact/` を開き、ナビのアクティブ表示・"Builder"・
  フィルタピル・Approach の番号・Impact の「現在」フェーズがすべてピンク系で表示されること。
- ダークモードで同4ページがすべて従来どおりティールであること。
