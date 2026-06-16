## CI/CD セットアップ
id: 04
branch-slug: cicd-setup
github_issue:
status: close
type: feat
対象: |
  .github/workflows/ci.yml (新規)
内容: |
  Push に連動してテスト・ビルド・Cloudflare Pages デプロイを自動化する。
  手動の deploy() zsh 関数を廃止し、GitHub Actions に移行する。
  1. GitHub Actions ワークフロー追加（test + deploy の2ジョブ構成）
  2. Cloudflare API トークンを GitHub Secrets に登録
  3. dotfiles の deploy() 関数を削除
確認: |
  - .github/workflows/ci.yml の YAML 構文が正しいこと
  - test ジョブが typecheck と vitest を実行すること
  - deploy ジョブが main ブランチのみ実行されること
  - CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID が secrets 参照になっていること

---

## 設計メモ

### ジョブ構成

```
push / PR
  └─ test job
       ├─ npm run typecheck  (astro check)
       └─ npm test           (vitest)
           │ (main branch のみ)
           └─ deploy job
                ├─ npm run build  (astro build + pagefind)
                └─ wrangler pages deploy → Cloudflare Pages
```

### Secrets

| Secret 名 | 値 |
|---|---|
| CLOUDFLARE_API_TOKEN | portfolio-astro-ci トークン（Cloudflare Dashboard で作成） |
| CLOUDFLARE_ACCOUNT_ID | 97d36a7b382cc4530fb7d001a77d4270 |

### deploy() 廃止の理由

`dotfiles/zsh/neo/git.sh` の `deploy()` は対象ディレクトリが `~/github-public/astro`（旧パス）のままで
実質機能していなかった。CI/CD 移行を機に完全削除。
