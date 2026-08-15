## Zenn記事の更新を受けてサイトを再ビルドする
id: 59
branch-slug: zenn-snapshot-ci-sync
github_issue:
status: open
type: fix
対象: `.github/workflows/ci.yml`, `folio-agent.config.json`, `zenn-snapshot.json`
内容: Chatbot（folio-agent）が参照する `zenn-snapshot.json` が手動生成のまま陳腐化し、Zenn記事の追加・更新がサイトに反映されていない。更新の起点は Zenn リポ側なので、本リポは外部トリガー（`repository_dispatch`）を受けて Zenn 記事を取り込み直し再デプロイする「受け」の口を用意する。あわせて `folio-agent.config.json` の `zenn.articlesDir` が実在しない macOS パスのままなので、現行の Linux 実パスに直す。
確認: `npm run typecheck` / `npm test` が通ること。`ci.yml` が YAML として妥当で、既存の push / pull_request 経路の挙動（test → deploy、build → wrangler deploy の順序）を変えていないこと（実行確認は user）。

---

### 保証
- 新たに宣言する保証: なし（CI 手順と設定値の修正であり、`src/lib/api.ts` の公開ルートの入出力契約は変えない。`docs/guarantees.md` に追記する項目は無い）
- 維持する保証:
  - `POST /api/chat` は `knowledge.json` を `ASSETS` 経由で取得できない場合、500 で `{ error: 'knowledge_unavailable' }` を返す（`docs/guarantees.md` L20）
  - `POST /api/chat` は正常系で `knowledge.json` の各ページを整形して `createGeminiGenerator` に渡し、ハンドラのレスポンスをそのまま返す（同 L21）
  - `npm run build` は Zenn 記事ソースに到達できない環境（PR ビルド等）でも失敗せず、`zennSnapshotPath` のフォールバックで完走する（Issue 43 で入れた性質）
  - 既存の push（main）/ pull_request トリガーの挙動は変わらない

---

## 背景と現状

知識データ `knowledge.json` は本リポの `npm run build` 時に生成され `dist/client/` に置かれる。`yktsnet/folio-agent` はライブラリ（`@folio-agent/handler` / `@folio-agent/widget`）を提供するだけで知識データを持たないため、記事の反映責任は本リポにある。

- `zenn-snapshot.json` は Issue 43 の初回生成（記事4本）のまま更新されていない。Zenn 記事は現在8本あり、`202608-*` の4本が丸ごと欠落している。既存4本の本文更新も反映されない。
- 更新の起点は Zenn リポへの push であり、本リポへの push ではない。本リポ側の push だけを契機にすると、記事を書いても本リポに変更が無い限り永久に反映されない。
- `folio-agent.config.json` の `zenn.articlesDir` が `/Users/ykts/...` を指しており、現行環境（Linux）に存在しない。よって手元で `npm run sync-zenn` を叩いても記事を拾えない。
- `folio-agent-ingest` は `articlesDir` が不在なら黙って `zennSnapshotPath` にフォールバックする（警告は出ない）ため、壊れていることに気づけない。
- `@folio-agent/handler` の sync CLI は `process.argv[2]`（config パス）・`argv[3]`（出力パス）しか受け取らず、`articlesDir` の環境変数オーバーライドには対応していない。CI ではオーバーライドを自前で行う必要がある。

## スコープ

本Issueは**受け側（本リポ）の口を作るところまで**。Zenn リポ側から dispatch を送る送信側の設定は別リポの作業なので対象外とし、PR の `## 検証手順` に「user 側でやること」として必要事項（送信先リポ・イベント型・必要な token 権限）を明記する。

## `.github/workflows/ci.yml`

1. トリガーに `repository_dispatch`（イベント型は `zenn-updated` 等の固定名を1つ決める）と `workflow_dispatch`（手動再ビルド用）を追加する。既存の `push` / `pull_request` はそのまま残す。
2. deploy ジョブの実行条件を見直す。現状 `if: github.ref == 'refs/heads/main'` だが、`repository_dispatch` / `workflow_dispatch` でも deploy が走るようにする（これらのイベントでは既定ブランチで実行されるため条件は満たすはずだが、実装者は実際に評価される値を確認して条件式を決めること）。
3. deploy ジョブに、`npm run build` の前段として Zenn 同期ステップを追加する:
   - Zenn 記事リポ（private）をワークスペース内の作業ディレクトリへ checkout する。`actions/checkout` の `repository` / `path` / `token` を使い、token は新規シークレット（例 `ZENN_REPO_TOKEN`、対象リポの contents:read を持つ fine-grained token）から渡す。シークレット名は実装者が決めてよいが、PR の `## 検証手順` に「user が GitHub に登録する必要があるシークレット名」として明記すること。
   - `folio-agent.config.json` の `zenn.articlesDir` を checkout 先の `articles` ディレクトリへ書き換えてから `npm run sync-zenn` を実行する。書き換えはコミットせずランナー上の一時変更に留める（config の実体はローカル開発値のまま保つ）。`node -e` で JSON を読み書きする形で構わない。
   - 同期後の `zenn-snapshot.json` をそのまま `npm run build` に食わせる。生成物はコミットしない（wrangler がランナー上の成果物を配るため、リポへの書き戻しは不要）。
   - 同期ステップが失敗したらジョブを失敗させる（`continue-on-error` を付けない）。シークレット未設定や checkout 失敗時に、古いスナップショットのまま黙ってデプロイされるのを避けるため。
4. test ジョブと PR ビルドは同期の対象外（コミット済みスナップショットのまま動かす。fork PR にシークレットを渡さないため）。

## `folio-agent.config.json`

- `zenn.articlesDir` を現行 Linux 環境の実パス（`/home/g83/github-private/zenn/articles`）に更新する。macOS 機はもう使っていないため、環境変数による分岐は入れない。
- `zennSnapshotPath` はフォールバックとして残す（PR ビルドではシークレットが使えないため必須）。

## `zenn-snapshot.json`

- フォールバック用のコミット済みスナップショットも古いままなので、`articlesDir` 修正後に `npm run sync-zenn` を1回実行して最新（記事8本）に更新し、コミットに含める。

## 実装順序

`folio-agent.config.json` の修正 → `npm run sync-zenn` でスナップショット再生成 → `ci.yml` のトリガー追加と同期ステップ追加、の順で進める。
