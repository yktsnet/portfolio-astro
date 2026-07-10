## PR記録: chore: Tailwind CSS v4 へ移行し @astrojs/tailwind を撤去
issue: 45 (45_tailwind-v4-migration.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/93
Merged: c589a2e798fea929ec3ce077c5b9d91a4aa346a6

## 変更内容
tailwindcss 3.4 系を 4 系へ移行し、v3 専用の非推奨インテグレーション
@astrojs/tailwind を撤去した。Astro のメジャー更新（Issue 46）の前提
として実施。

- `@astrojs/tailwind` を依存から除去し、`@tailwindcss/vite` を追加。
  `astro.config.mjs` の `integrations` から `vite.plugins` へ移設。
- `npx @tailwindcss/upgrade` を実行し、機械変換を適用（package.json /
  package-lock.json の更新、`tailwind.config.mjs` の CSS への移設、
  `src/styles/global.css` の書き換え、影響するテンプレート15ファイルの
  ユーティリティクラス名の機械的置換）。
- `tailwind.config.mjs` は削除し、設定を `src/styles/global.css` の
  `@theme` / `@custom-variant` / `@plugin` へ引き継いだ:
  - `darkMode: 'class'` → `@custom-variant dark (&:is(.dark *));`
  - `colors.poi.*` / `colors.light.*` → `@theme` 内の `--color-poi-*` /
    `--color-light-*` トークン
  - `poi.accent` の `rgb(var(--color-accent) / <alpha-value>)` は
    v4 の `color-mix()` ベースの透過度算出に伴い
    `rgb(var(--color-accent))` に変換（`<alpha-value>` プレースホルダは
    v4 では不要。オペーシティ修飾子 `poi-accent/70` 等は
    `color-mix()` で動作するため意味は不変）
  - `@tailwindcss/typography` の読み込みを `@plugin` 宣言に変更
- `future.hoverOnlyWhenSupported` は v4 でハードコードのデフォルト挙動
  （`@media (hover: hover)` でラップ）になったため設定移設不要と判断し
  削除。`node_modules/tailwindcss/dist/lib.js` 内の hover バリアント
  定義で `@media (hover: hover)` へのラップを直接確認した。
- `content` グロブは v4 の自動検出に伴い `tailwind.config.mjs` ごと削除。
  ビルド結果（`dist/_astro/*.css`）に `.astro` 由来のユーティリティが
  含まれることを確認済み。

## 対象フィールドとの差分について
Issue の「対象」には package.json / astro.config.mjs /
tailwind.config.mjs / src/styles/ 配下のグローバルCSS のみを記載して
いたが、「内容」で指示された `@tailwindcss/upgrade` の適用により
15個のテンプレートファイル（クラス名の機械的リネーム: `rounded`→
`rounded-sm`、`shadow-sm`→`shadow-xs`、`outline-none`→`outline-hidden`、
`break-words`→`wrap-break-word`、`end-*`→`inset-e-*`、
`start-*`→`inset-s-*`、任意値角括弧記法の正規化 等）と
package-lock.json も不可避的に変更された。これらを行わない場合、
v4 側でのユーティリティ名変更により見た目が変化する（「見た目の変更を
目的としない」という制約に反する）ため、機械的リネームとして本コミット
に含めた。差分は全て `@tailwindcss/upgrade` による自動変換で、手動の
デザイン変更は行っていない。

## 静的確認結果
- `npm run typecheck`: 0 errors / 0 warnings（既存の 12 hints は本変更と
  無関係）
- `npm run build`: 成功。`dist/_astro/*.css` に `--color-poi-accent` 等の
  CSS変数、`.prose` / `prose-headings` 等の typography ユーティリティ、
  `@media(hover:hover)` によるホバーラップが出力されていることを確認
- import・caller整合性: `astro.config.mjs` は `@tailwindcss/vite` の
  `tailwindcss()` を `vite.plugins` に登録し、旧 `@astrojs/tailwind` の
  `integrations` 登録を除去（コード読解で確認）。他ファイルからの
  `@astrojs/tailwind` / `tailwind.config` への参照が残っていないことを
  grep で確認済み
- `src/styles/blocks/search.css`（`theme()` 関数の v3 記法を残す）は
  対象外と判断: 実体を持つ `Search.astro` は `SiteHeader.astro` で
  import されているが実際には描画されておらず（`RightNav.astro` が
  実UIを担う。`npm run typecheck` でも "'Search' is declared but its
  value is never read" という既存の警告あり）、ビルド後 CSS
  （`dist/_astro/*.css`）にも `pagefind-ui` / `cactus__search` 系の
  出力は含まれない。これは本移行前から存在する未使用コードであり、
  本 Issue の対象（グローバルCSS）にも含まれないため変更していない
- 変更ファイル一覧（`git diff --name-only --cached`）:
  astro.config.mjs
  package-lock.json
  package.json
  src/components/About.astro
  src/components/Approach.astro
  src/components/Impact.astro
  src/components/InfrastructureBlueprint.astro
  src/components/Search.astro
  src/components/ThemeToggle.astro
  src/components/WorkCard.astro
  src/components/WorkFilter.astro
  src/components/blog/Masthead.astro
  src/layouts/Logo.astro
  src/pages/cat-feed-tracker/index.astro
  src/pages/contact.astro
  src/pages/nfc-attendance/index.astro
  src/pages/photos/index.astro
  src/pages/posts/[slug].astro
  src/styles/global.css
  tailwind.config.mjs（削除）

## 検証手順
- [ ] `npm run dev` でトップページ（`/`）・About・Approach・Impact・
      Works カードを目視し、ダークモード切替でアクセントカラー
      （ライト: ピンク `#d0679d` / ダーク: ティール `#5de4c7`）が
      移行前と同じ配色で切り替わることを確認する
- [ ] `/posts/[slug]` の記事本文（prose）でタイポグラフィ装飾
      （見出し・リンク・引用・コードブロック）が移行前と同一であることを
      確認する
- [ ] タッチデバイス（または DevTools のタッチエミュレーション）で
      ボタンやリンクのホバー状態がタップ後に残留しないことを確認する
      （`hoverOnlyWhenSupported` 相当の挙動）
- [ ] `npm run build` を本番相当の環境で実行し、Cloudflare へのデプロイ
      後に本番同様のスタイルが当たることを確認する
