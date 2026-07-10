## Tailwind CSS v4 への移行（@astrojs/tailwind の撤去を含む）
id: 45
skill: pr-workflow
branch-slug: tailwind-v4-migration
github_issue: 94
status: close
type: cleanup
対象: |
  package.json
  astro.config.mjs
  tailwind.config.mjs（削除または CSS への移設元として参照）
  src/styles/ 配下のグローバルCSS（@tailwind ディレクティブを持つファイル）
内容: |
  tailwindcss 3.4 → 4 系へ移行する。現在の @astrojs/tailwind は
  Tailwind v3 専用の非推奨インテグレーションであり、Astro のメジャー
  更新（Issue 46）の前提としてここで撤去する。

  要件:
  - @astrojs/tailwind を依存から外し、@tailwindcss/vite プラグインに
    置き換える（astro.config.mjs の integrations から vite.plugins へ）。
  - 公式アップグレードツール（npx @tailwindcss/upgrade）の適用を起点に
    し、機械変換で拾えない箇所を手で直す。
  - tailwind.config.mjs にある以下の設定を v4 の CSS ベース設定
    （@theme / @custom-variant 等）へ確実に引き継ぐ:
    - darkMode: 'class'（v4 では @custom-variant dark での定義になる）
    - future.hoverOnlyWhenSupported（v4 ではデフォルト挙動化。設定移設
      不要かをドキュメントで確認し、不要なら削除理由をPRに書く）
    - colors.poi.* / colors.light.*（poi.accent は
      rgb(var(--color-accent) / <alpha-value>) 形式のCSS変数参照。
      v4 での等価な書き方に変換する）
    - @tailwindcss/typography プラグインの読み込み
  制約:
  - astro / @astrojs/cloudflare のバージョンは本Issueでは上げない。
  - 見た目の変更を目的としない。クラスの置換は v4 互換のための
    機械的なものに限る。
確認: |
  npm run typecheck && npm run build が成功すること。
  npm run dev でトップページを目視し、ダークモード切替・アクセント
  カラー・タイポグラフィ（prose）が移行前と同一表示であること。

---

- v4 は PostCSS 設定不要（本リポに postcss.config は元々無い）。`@tailwind base/components/utilities` は `@import "tailwindcss";` に置き換わる。
- `content` グロブは v4 では自動検出になるため原則削除でよいが、`.astro` ファイルが検出対象に含まれることをビルド結果（スタイルが当たっているか）で確認する。
- ブラウザ表示確認はローカル `npm run dev` で行い、スクリーンショット比較の結果を PR の `## 検証手順` に記載して user のデプロイ確認に委ねる。
