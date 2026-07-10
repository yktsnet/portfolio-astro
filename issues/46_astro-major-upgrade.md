## Astro 5 → 7 メジャー更新（@astrojs/* 一式の連動更新）
id: 46
skill: pr-workflow
branch-slug: astro-major-upgrade
github_issue:
status: close
type: cleanup
対象: |
  package.json
  package-lock.json
  astro.config.mjs
  src/ 配下（破壊的変更の影響を受けるファイルのみ。事前列挙不能）
内容: |
  astro 5.18 → 7 系へ更新し、連動するインテグレーションを対応
  バージョンへ揃える:
  - @astrojs/cloudflare 12 → 14 系
  - @astrojs/react / @astrojs/rss / @astrojs/sitemap / @astrojs/check を
    astro 7 対応の最新へ

  要件:
  - 公式の移行手段を起点にする: npx @astrojs/upgrade を実行したうえで、
    v6・v7 両方のアップグレードガイド（公式ドキュメント）を読み、
    残る破壊的変更を手で対応する。2メジャー分なので v5→v6 の変更点も
    必ず確認する。
  - astro.config.mjs の現行設定（output: 'static'、cloudflare アダプタの
    mode: 'directory' / imageService: 'compile' / platformProxy、
    vite.ssr.external、redirects）が新バージョンで有効か個別に確認し、
    廃止されたオプションは等価な設定に置き換える。廃止対応の判断は
    PR に根拠（ガイドの該当箇所）を書く。
  制約:
  - Issue 45（Tailwind v4 移行）のマージ後に着手する。@astrojs/tailwind
    が残った状態では実施しない。
  - typescript / lucide-react のメジャー更新は対象外（別途判断）。
  - ビルドパイプライン（folio-agent-ingest / sitemap / RSS）の
    出力構成を変えない。
確認: |
  npm run typecheck && npm run test && npm run build が成功すること。
  dist/ に sitemap・RSS・knowledge.json が従来どおり生成されていること。
  npm run dev でトップページとチャットウィジェット（React island）の
  動作を目視確認。

---

- wrangler でのローカル配信確認（`npx wrangler pages dev dist` 相当）と本番デプロイ確認は user が行う。実行者は PR の `## 検証手順` に、アダプタ更新で出力ディレクトリ構成（`_worker.js` / `_routes.json` の有無）が変わったかどうかを明記すること。
- 更新が1セッションに収まらない規模の破壊的変更（例: アダプタ14系で `mode: 'directory'` の概念自体が消えている等）が判明した場合は、実装を進めず本Issueを分割提案で差し戻してよい。

### 実施記録（close理由）

実行者セッションで着手した際、@astrojs/cloudflare v13 以降が Cloudflare Pages サポートを廃止し Workers 専用になっていることが判明（アダプタ v12 は astro ^5 固定のため「astro 7 + アダプタ据え置き」も不可能）。ホスティング基盤の切替（Pages → Workers）が不可分となり、user のダッシュボード操作との往復が必要なリアルタイム ops として、相談者セッションの直接編集（`workers-migration` ブランチ）で実施することに user が決定。本Issueは実行者向けとしては close。
