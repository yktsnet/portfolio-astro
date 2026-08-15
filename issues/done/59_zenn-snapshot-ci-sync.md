## PR記録: fix: Zenn記事更新のCI取り込みとconfigパス修正
issue: 59 (59_zenn-snapshot-ci-sync.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/130
Merged: ebbcebe608fa710e5411604a7c3ab4c5eca86680

## 変更内容
Chatbot（folio-agent）が参照する `zenn-snapshot.json` が手動生成のまま陳腐化し、Zenn記事の追加・更新がサイトに反映されていなかった問題を解消する。

- `.github/workflows/ci.yml`: `repository_dispatch`（`zenn-updated`）と `workflow_dispatch` トリガーを追加。deploy ジョブの実行条件を `github.ref == 'refs/heads/main' || github.event_name == 'repository_dispatch' || github.event_name == 'workflow_dispatch'` に拡張。deploy ジョブに Zenn 記事リポ（`yktsnet/zenn`、private）の checkout と `articlesDir` の一時書き換え → `npm run sync-zenn` を `npm run build` の前段として追加。同期失敗時は `continue-on-error` を付けずジョブを失敗させる。test ジョブ・PR ビルドは同期対象外のまま。
- `folio-agent.config.json`: `zenn.articlesDir` を存在しない macOS パス（`/Users/ykts/...`）から現行 Linux 実パス（`/home/g83/github-private/zenn/articles`）に修正。`zennSnapshotPath` はフォールバックとして維持。
- `zenn-snapshot.json`: 修正後の `articlesDir` で `npm run sync-zenn` を実行し、記事4本→8本の最新スナップショットに更新。

## 保証
- 新たに宣言する保証: なし（CI 手順と設定値の修正であり、`src/lib/api.ts` の公開ルートの入出力契約は変えない。`docs/guarantees.md` に追記する項目は無い）
- 維持する保証（変更なし・退行なし）:
  - `POST /api/chat` は `knowledge.json` を `ASSETS` 経由で取得できない場合、500 で `{ error: 'knowledge_unavailable' }` を返す（`docs/guarantees.md` L20）: 対応するテストに変更なし
  - `POST /api/chat` は正常系で `knowledge.json` の各ページを整形して `createGeminiGenerator` に渡し、ハンドラのレスポンスをそのまま返す（同 L21）: 対応するテストに変更なし
  - `npm run build` は Zenn 記事ソースに到達できない環境（PR ビルド等）でも失敗せず、`zennSnapshotPath` のフォールバックで完走する（Issue 43 で入れた性質）: `folio-agent.config.json` の `zennSnapshotPath` を維持したまま変更なし
  - 既存の push（main）/ pull_request トリガーの挙動は変わらない: `ci.yml` の `push`/`pull_request` セクション、test ジョブは無変更。deploy ジョブの `if` 条件は `github.ref == 'refs/heads/main'` を維持したまま OR 条件で追加しただけ

## 静的確認結果
- `npm run typecheck`: 0 errors, 0 warnings, 2 hints（既存の無関係な hint のみ）
- `npm test`: 18 tests passed (2 files)
- `.github/workflows/ci.yml` は YAML として妥当（`js-yaml` でパース確認）
- import・caller整合性: 対象3ファイルはいずれも設定・ワークフロー・生成物であり、TSソースからの import/caller 関係は無い
- `git diff --name-only --cached`:
  ```
  .github/workflows/ci.yml
  folio-agent.config.json
  zenn-snapshot.json
  ```

## 検証手順
本Issueは受け側（本リポ）の口を作るところまで。以下は user 側の対応が必要:

1. GitHub リポジトリ設定 → Secrets and variables → Actions に `ZENN_REPO_TOKEN` を登録する。`yktsnet/zenn`（private）への `contents:read` 権限を持つ fine-grained personal access token。
2. Zenn リポ（`yktsnet/zenn`）側から本リポへ `repository_dispatch` を送信する仕組み（push 時に `event-type: zenn-updated` で `POST /repos/yktsnet/portfolio-astro/dispatches` を叩く GitHub Actions 等）を別途設定する。送信には本リポへの `contents: write`相当（dispatches エンドポイントには repo への書き込み権限相当のトークン）が必要。
3. マージ後、GitHub Actions の「Run workflow」（`workflow_dispatch`）から deploy ジョブが手動実行できることを確認する。
4. 上記1・2の設定後、Zenn リポへの push で本リポの deploy が自動的に走り、`knowledge.json` に新しい記事が反映されることを確認する。
