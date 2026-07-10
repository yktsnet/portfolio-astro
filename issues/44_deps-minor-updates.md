## 低リスク依存の一括更新（minor / patch のみ）
id: 44
skill: pr-workflow
branch-slug: deps-minor-updates
github_issue: 92
status: close
type: cleanup
対象: |
  package.json
  package-lock.json
内容: |
  npm outdated で判明した minor / patch 更新を一括で取り込む。
  メジャー更新（astro / @astrojs/cloudflare / tailwindcss / typescript /
  lucide-react）は本Issueの対象外（Issue 45・46 で扱う）。

  対象パッケージ:
  - hono 4.12.27 → 4.12 系最新
  - lucide-static 1.23.0 → 1.24 系最新
  - vitest 4.1.9 → 4.1 系最新
  - wrangler 4.107.0 → 4.110 系最新

  また、@folio-agent/handler / @folio-agent/widget は package.json が
  ^0.4.0 を指定しているのに node_modules に 0.3.0 が残っている
  （lockfile 不整合）。npm install で 0.4.0 に揃えることも本Issueに含める。
確認: |
  npm run typecheck && npm run test && npm run build がすべて成功すること。
  npm outdated で上記パッケージが Wanted に揃っていること
  （メジャー更新の残りは Latest 列に出たままでよい）。

---

- `npm update hono lucide-static vitest wrangler` と `npm install` で lockfile を更新する。semver レンジ（`^`）は現状のまま変えない。
- folio-agent 0.4.0 への実体更新で `zenn-snapshot.json` フォールバック（Issue 43）が有効になるため、build が snapshot 経由でも成功することを確認に含める。
