## メイン4ページの見出し構造・本文タイポグラフィ・リンク様式を統一する
id: 41
branch-slug: main-pages-consistency
github_issue:
status: open
type: cleanup
対象: |
  src/components/About.astro
  src/components/Approach.astro
  src/components/Impact.astro
  src/components/HostingArchitecture.astro
内容: |
  メイン4ページ（Works=/ ・About・Approach・Impact）で、見出しのセマンティクス・
  本文のサイズと行間・証跡リンクの様式がページごとにずれている。
  Works ページの現行スタイルを基準に、他3ページを揃える。見た目の大枠は変えず、
  ページを行き来したときの質感（文字の密度・リンクの見え方・HTML アウトライン）を揃えるのが目的。
確認: |
  `npm run typecheck` と `npm run build` が通ること。
  4コンポーネントを読み、(a) eyebrow=`<p>`+リード文=`<h2>` の構造、
  (b) 主要本文が `text-sm leading-7`、(c) 証跡リンクが同一クラス構成、
  の3点が全ページで一致していることを確認すること。

---

## 1. 見出しのセマンティクス

現状:
- HostingArchitecture（Works）: eyebrow `<p>` + リード文 `<h2>`（`text-xl sm:text-2xl font-semibold ...`）
- About / Approach / Impact: リード文が `<p>`
- Approach の原則名は `<h3>`（78行目付近）だが、ページ内に `<h2>` が無いまま h3 が出る

対応: About / Approach / Impact のリード文を `<h2>` に変更する。クラスは HostingArchitecture の
リード文とまったく同じ構成にする（現状ほぼ同一なのでタグ変更が主）。
About 内の COVERAGE / TIMELINE、Impact のタイムライン等、下位ブロックに見出しタグを
新設する必要はない（eyebrow ラベルは `<p>` のままでよい）。

## 2. 本文のサイズ・行間

基準は `text-sm leading-7`（Works 導入文・About 本文・Impact 導入文が既にこれ）。

- Approach 本文（82行目付近）: `leading-[1.85]` → `leading-7`
- Impact のフェーズ本文（84行目付近）: `text-[13px] leading-6` → `text-sm leading-7`
- Impact のカード内タイトル `text-[13.5px]` と本文 `text-[12.5px]`: Tailwind 標準刻みへ寄せる。
  タイトルは `text-sm`、本文は `text-[13px]` のような中途半端な値を残さず `text-xs` か `text-sm` の
  どちらかに決める（カード内は周囲より1段小さい階層なので、タイトル `text-sm`・本文 `text-xs` を推奨。
  ただし実際に表示して読みにくければ両方 `text-sm` でよい。metrics の数字サイズは触らない）。

## 3. 証跡リンクの様式

基準は Approach の証跡リンク / Impact の GitHub リンクのパターン:
`font-mono text-xs` + ミュート色 + hover でアクセント + Lucide SVG アイコン（arrow-right / github / external-link）。

- About の「具体例を Works で見る →」（141行目付近）: 現状 sans + `font-medium` + 常時アクセント色 +
  テキストの「→」。上記パターンに書き換える（`getLucideIcon('arrow-right')` を使い、
  Approach の internal リンクとクラス構成を一致させる）。文言は変えない。
- Approach の証跡「Works — Trading Lab」の `href: '/'` は Works リストの先頭に飛ぶだけで
  現物に届かない。`/trading-system/` に変更する。

## 4. タイムラインのドット・レール（軽微・裁量あり）

About の TIMELINE（`w-1.5 h-1.5` ドット + `w-4` レール）と Impact のフェーズタイムライン
（`h-3 w-3` 枠付きドット + 左レール）は隣接ページで別デザイン。情報の性質が違うため
完全一致は不要だが、ドット径とレールの線色・太さ程度は寄せる。current 強調（Impact）や
`@location` グルーピング（About）はそれぞれ維持する。工数が膨らむようならこの項は見送ってよく、
その場合は PR に見送った旨を書く。

## 制約

- 文言（日本語テキスト）は一切変更しない。
- レイアウト構造（縦積み・カード・フロー図）は変更しない。あくまでタグ・サイズ・リンク様式の統一。
- Issue 40（アクセント色の CSS 変数化）と独立して着手できるが、同時進行する場合は
  Impact.astro のコンフリクトに注意（先にマージされた方に rebase する）。

## 検証手順（user 向け）

- 4ページを順に閲覧し、本文の文字サイズ・行間の質感がページ間で揃っていること。
- About の Works リンクが Approach / Impact の証跡リンクと同じ見た目になっていること。
- Approach の「Works — Trading Lab」が /trading-system/ に遷移すること。
