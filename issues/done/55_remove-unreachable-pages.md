## PR記録: chore: 到達不能ページの撤去（詳細ページ・status表示）
issue: 55 (55_remove-unreachable-pages.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/121
Merged: 5b40a453009cdcd4825201372f0824cf5abf32d6

## 変更内容
サイト内のどのページからもリンクされていない表示面を撤去した。

- src/pages/cat-feed-tracker/index.astro（削除）: Works カードは GitHub/Zenn への外部リンクのみを持ち、この詳細ページを指していない
- src/pages/nfc-attendance/index.astro（削除）: 同上
- src/pages/trading-system.astro（削除）: どこからもリンクされていないダッシュボード。`/api/status` を fetch する唯一の呼び出し元だったが、API 本体（src/lib/api.ts）は KV 保証の対象であり不変のため削除対象外
- src/pages/Status.astro（削除）: `/trading-system/` への301リダイレクトのみ
- src/components/status/StatusPage.astro, StatusCharts.astro（削除）: 削除対象ページ以外から参照されていない
- src/lib/status.ts（削除）: 参照元は trading-system.astro と StatusPage.astro のみ。src/lib/api.ts は独立実装で依存しない
- folio-agent.config.json: include から `/nfc-attendance`・`/cat-feed-tracker` を削除（ページ削除に伴い ingest 対象から除外。Zenn 記事は別途取り込まれるため題材自体は知識ベースに残る）

## 保証
新たな宣言・変更なし。`GET /api/status` を含む src/lib/api.ts の既存保証はすべて維持（削除対象に含まれないため無変更）。台帳 docs/guarantees.md の改訂は不要（Issue記載の通り、台帳の保証対象は src/lib/api.ts のルートのみで本Issueの削除対象と重複しない）。

## 静的確認結果
- `npm run typecheck`: 0 errors（既存の警告のみ、削除対象と無関係）
- `npm run build`: astro build のアセット生成までは成功。wrangler の remote preview 接続ステップで失敗するが、変更前の状態（git stash して再実行）でも同一エラーが再現することを確認済み。sandbox に Cloudflare 認証情報が無いことによる環境要因であり、本変更とは無関係
- `npm run test`: 14 tests passed
- import・caller 整合性: grep で cat-feed-tracker / nfc-attendance / trading-system / status/StatusPage / status/StatusCharts / lib/status / Status.astro の参照元を確認し、削除対象ファイル同士の相互参照以外に外部からの参照が無いことを確認
- git diff --name-only --cached:
  folio-agent.config.json
  src/components/status/StatusCharts.astro
  src/components/status/StatusPage.astro
  src/lib/status.ts
  src/pages/Status.astro
  src/pages/cat-feed-tracker/index.astro
  src/pages/nfc-attendance/index.astro
  src/pages/trading-system.astro

## 検証手順
- `npm run build` をローカルまたは Cloudflare 認証情報のある環境で実行し、folio-agent-ingest が include の全 URL（`/`, `/about`, `/approach`, `/impact`）を正常に解決できることを確認する
- デプロイ後、`/cat-feed-tracker/`・`/nfc-attendance/`・`/trading-system/`・`/status/` へのアクセスが 404 になることを確認する
- `/api/status` が従来通り動作すること（KV未バインド時500、データ無し時404、データありで200）を確認する
