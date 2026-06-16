## 変更内容

Push に連動してテスト・ビルド・Cloudflare Pages デプロイを自動化した。

1. **GitHub Actions ワークフロー追加** — `.github/workflows/ci.yml` に `test` / `deploy` の2ジョブを定義。PR はテストのみ、main マージ後に本番デプロイ。
2. **Cloudflare Secrets 登録** — `gh secret set` で `CLOUDFLARE_API_TOKEN`・`CLOUDFLARE_ACCOUNT_ID` を登録。
3. **deploy() 関数を削除** — `dotfiles/zsh/neo/git.sh` の `deploy()` を削除。対象ディレクトリが旧パス（`~/github-public/astro`）のまま機能していなかったため。

## 静的確認結果

- **YAML 構文** — `test` / `deploy` ジョブが正しく定義されている ✅
- **test ジョブ** — `npm run typecheck`（astro check）→ `npm test`（vitest）を実行 ✅
- **deploy ジョブ** — `if: github.ref == 'refs/heads/main'` で main のみ実行 ✅
- **Secrets 参照** — `${{ secrets.CLOUDFLARE_API_TOKEN }}` / `${{ secrets.CLOUDFLARE_ACCOUNT_ID }}` を使用 ✅
- **GitHub Secrets** — `gh secret list` で両 Secret の登録を確認 ✅

## 検証手順

- main に push して GitHub Actions が起動することを確認する
- `test` ジョブが green になることを確認する
- `deploy` ジョブが green になり Cloudflare Pages に反映されることを確認する
- PR を作成し `deploy` ジョブが実行されないことを確認する
