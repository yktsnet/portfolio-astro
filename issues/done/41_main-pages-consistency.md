## PR記録: cleanup: メイン4ページの見出し構造・本文タイポグラフィ・リンク様式を統一する
issue: 41 (41_main-pages-consistency.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/72
Merged: cca2d73a8851b0b317bfcf33129f375865807f6d

## 変更内容

メイン4ページ（Works=/ ・About・Approach・Impact）で、見出しのセマンティクス・本文のサイズと行間・証跡リンクの様式がページごとにずれていたため、Works ページの現行スタイルを基準に他3ページを揃えた。

1. **見出しのセマンティクス**: About / Approach / Impact のリード文を `<p>` → `<h2>` に変更（クラスは HostingArchitecture のリード文と同一構成のまま）。
2. **本文のサイズ・行間**: 基準の `text-sm leading-7` へ統一。
   - Approach 本文: `leading-[1.85]` → `leading-7`
   - Impact のフェーズ本文: `text-[13px] leading-6` → `text-sm leading-7`
   - Impact のカード内タイトル `text-[13.5px]` → `text-sm`、本文 `text-[12.5px]` → `text-xs`（中途半端な値を Tailwind 標準刻みへ）
3. **証跡リンクの様式**: `font-mono text-xs` + ミュート色 + hover でアクセント + Lucide SVG アイコンのパターンへ統一。
   - About の「具体例を Works で見る →」を Approach と同じクラス構成 + `getLucideIcon('arrow-right')` に書き換え（文言は変更なし）
   - Approach の証跡「Works — Trading Lab」の `href` を `/`（Works リスト先頭）から `/trading-system/`（現物）へ修正
4. **タイムラインのドット・レール**（Issue内 裁量項目）: レールの線色・太さ（`bg-zinc-200 dark:bg-poi-border/70` / `w-px`）は About・Impact で既に一致していたため変更なし。ドット径・スタイル（About: 塗りつぶし小径 / Impact: current強調ありの輪郭スタイル）はそれぞれの情報の性質（`@location` グルーピング / current 強調）に紐づく設計のため、今回は見送った。

## 静的確認結果

- `npm run typecheck`: 0 errors（既存の warning のみ、今回の変更に起因するものなし）
- `npm run build`: 成功（Pagefind インデックス生成含む）
- 4コンポーネントを確認し、(a) eyebrow=`<p>`+リード文=`<h2>`、(b) 主要本文が `text-sm leading-7`、(c) 証跡リンクが同一クラス構成、の3点が全ページで一致することをビルド後の `dist/*/index.html` で確認済み。
- `HostingArchitecture.astro` は基準として読んだが、既に基準スタイルそのものだったため変更不要（このファイルのみ差分なし）。

`git diff --name-only HEAD~1`:
```
src/components/About.astro
src/components/Approach.astro
src/components/Impact.astro
```

## 検証手順

- 4ページ（/, /about/, /approach/, /impact/）を順に閲覧し、本文の文字サイズ・行間の質感がページ間で揃っていることを確認する。
- About の「具体例を Works で見る」リンクが Approach / Impact の証跡リンクと同じ見た目（font-mono・ミュート色・矢印アイコン）になっていることを確認する。
- Approach の「Works — Trading Lab」リンクをクリックし、`/trading-system/` に遷移することを確認する。
