## PR記録: chore: 低リスク依存の一括更新（minor / patch）
issue: 44 (44_deps-minor-updates.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/91
Merged: 93b45e14647447f7930fc935e4161e033ec1cf8b

## 変更内容
npm outdated で判明していた minor / patch 更新を取り込んだ。

- hono 4.12.27 → 4.12.29
- lucide-static 1.23.0 → 1.24.0
- vitest 4.1.9 → 4.1.10
- wrangler 4.107.0 → 4.110.0

`npm update hono lucide-static vitest wrangler` で更新し、semver レンジ
（`^`）は package.json 上変更なし（元々のレンジ内での更新のため
package.json 自体に差分は発生せず、package-lock.json のみ更新）。

@folio-agent/handler / @folio-agent/widget は package-lock.json 上は
既に 0.4.0 で揃っており、node_modules が未インストール（ディレクトリ
自体が存在しない状態）だったため npm outdated に MISSING と出ていた。
`npm install` で解消し、lockfile 通り 0.4.0 が入っていることを確認した
（lockfile 不整合ではなかった）。

メジャー更新（astro / @astrojs/cloudflare / tailwindcss / typescript /
lucide-react）は対象外のまま。

## 静的確認結果
- git diff --name-only --cached: package-lock.json
- npm run typecheck: 0 errors, 0 warnings（既存の hint のみ）
- npm run test: 10 passed (10)
- npm run build: astro build → pagefind → folio-agent-ingest まで成功
  （zenn ingest は articlesDir がローカルに存在したため実データ経由で
  実行。zennSnapshotPath フォールバックのコードパス自体は
  node_modules/@folio-agent/handler/dist/ingest/generate.js に存在し、
  articlesDir 不在時に zenn-snapshot.json を読む実装になっていることを
  ソースで確認済み）
- npm outdated: hono / lucide-static / vitest / wrangler は Current =
  Wanted に揃った。astro / @astrojs/cloudflare / tailwindcss /
  typescript / lucide-react は Latest 列に更新が残ったまま（想定通り、
  本Issue対象外）
