## 到達不能ページの撤去（詳細ページ・status表示）
id: 55
branch-slug: remove-unreachable-pages
github_issue:
status: open
type: cleanup
対象:
- src/pages/cat-feed-tracker/index.astro（削除）
- src/pages/nfc-attendance/index.astro（削除）
- src/pages/trading-system.astro（削除）
- src/pages/Status.astro（削除）
- src/components/status/StatusPage.astro（削除）
- src/components/status/StatusCharts.astro（削除）
- src/lib/status.ts（削除）
- folio-agent.config.json（include から2エントリ削除）
内容: サイト内のどのページからもリンクされていない表示面を撤去する。ファイル数は多いが、削除と、それに伴う ingest 設定の追随のみで、実質は1つの変更（到達不能な表示面の撤去）である。`/api/status` とその保証には触れない。
確認: `npm run typecheck`、`npm run build`（folio-agent-ingest が include の全 URL を解決できること）、`npm run test`、import・caller 整合性をコードを読んで確認

---

### 保証
- 新たに宣言する保証:
  - なし（削除のみで、新たな振る舞いを追加しない）
- 維持する保証:
  - `GET /api/status` は `ykts_status_metrics` KV バインディングが無い場合、500 で `{ error: 'kv_not_bound' }` を返す。
  - `GET /api/status` は KV にデータが無い場合（`get` が `null` を返す場合）、404 を返す。
  - `GET /api/status` は KV に保存された JSON をパースし、そのまま 200 で返す。
  - `GET /api/hello` は常に 200 で `{ message: 'Hello from Hono!', status: 'logical_efficiency_verified' }` を返す。

`docs/guarantees.md` の保証対象は `src/lib/api.ts` が公開する Hono ルートのみであり、本Issueの削除対象はそこに一切含まれない。したがって台帳の改訂は不要で、対象ファイルにも含めない。

---

### 背景

ナビゲーションから到達できるページは `/`・`/impact/`・`/about/`・`/approach/`・`/contact/`・`/photos/`・`/data-policy/` の7つのみ。以下は他ページからのリンクが存在せず、URL を直接叩いた場合にのみ到達できる状態にある。

### src/pages/cat-feed-tracker/index.astro、src/pages/nfc-attendance/index.astro

Works カードは GitHub と Zenn への外部リンクのみを持ち、これらの詳細ページを指していない（`src/data/works.ts` の各 work の `links` を参照）。記事本体は Zenn 側に存在するため、サイト内に重複した解説を保持しない方針とする。

### src/pages/trading-system.astro、src/pages/Status.astro

`Status.astro` は `/trading-system/` への 301 リダイレクトのみを行う（`src/pages/Status.astro:2`）。`/trading-system/` 自体はどこからもリンクされておらず、ダッシュボードとして運用していない。

`trading-system.astro` は `/api/status` を fetch する唯一の呼び出し元だが、**API 本体は削除しない**。KV `ykts_status_metrics` へ外部から書き込まれている可能性があり、また台帳の保証対象であるため、サーバ側は不変とする。

### src/components/status/、src/lib/status.ts

`src/lib/status.ts` の参照元は `trading-system.astro:5` と `StatusPage.astro:3,4,112` のみで、いずれも本Issueの削除対象。`src/lib/api.ts` は `/api/status` を独立に実装しており `src/lib/status.ts` に依存しない（`src/lib/api.ts:64`）。よって同時に削除できる。

### folio-agent.config.json

`include` に `/nfc-attendance` と `/cat-feed-tracker` が含まれている。ページ削除後は `dist/client` に該当 HTML が生成されず、ビルド時の `folio-agent-ingest` が解決に失敗する。両エントリを削除すること。

**副作用として、チャットボットの知識ベースからこの2ページ分の解説が失われる。** Zenn 記事は `zenn` 設定経由で別途取り込まれているため、題材そのものが知識から消えるわけではない。

### 実装順序

本Issueを Issue 56（記事機構の撤去）より先に実施する。`cat-feed-tracker/index.astro:237`・`nfc-attendance/index.astro:214`・`StatusPage.astro:103` が `/posts/` 配下への唯一の内部リンクであり、本Issueの完了をもって `/posts/` が完全に孤立する。
