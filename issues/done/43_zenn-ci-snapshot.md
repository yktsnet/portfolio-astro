## PR記録: fix: Zenn記事取り込みをCIで動くようにする（folio-agentスナップショット方式）
issue: 43 (43_zenn-ci-snapshot.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/87
Merged: 3294f008a421f4a9ca82e4fb6666ad4b438c0d77

## 変更内容

CI（GitHub Actions）が `github-private/zenn` リポにアクセスできず、build 時に `folio-agent-ingest` が `config.zenn.articlesDir` の scandir で ENOENT になる問題に対応した。folio-agent 0.4.0 で追加された `zennSnapshotPath` フォールバック機構を使い、事前生成したスナップショットJSONをリポにコミットしてCIから参照できるようにした。

- `@folio-agent/handler` / `@folio-agent/widget` を `^0.3.0` → `^0.4.0` に更新
- `package.json` の `scripts` に `sync-zenn` を追加（記事追加のたびに手元で叩く定型コマンド）
- `folio-agent.config.json` の `zenn` ブロックの兄弟に `zennSnapshotPath: "zenn-snapshot.json"` を追加
- `npm run sync-zenn` を実行して `zenn-snapshot.json`（Zenn記事4本分）を初回生成しコミット

## 静的確認結果

- `npm run typecheck`: 0 errors / 0 warnings（hint 12件のみ、既存分）で通過。
- `npm run build`（`zenn.articlesDir` が実在するローカル環境）: 従来どおり成功。`wrote 10 page(s), ~7022 tokens -> dist/knowledge.json`。
- CI相当の再現（`zenn.articlesDir` を一時的に存在しないパス `articles-tmp` に変更 → `npm run build` → 元のパスに戻す）: ビルド成功、`dist/knowledge.json` の件数・トークン数は正常時と同一（`wrote 10 page(s), ~7022 tokens`）で `zennSnapshotPath` からのフォールバックが機能していることを確認。**ただし** Issue記載の「フォールバック使用時の警告」は folio-agent 0.4.0 の `generateKnowledge` の実装上出力されない（`articlesDir` が存在しない場合のみ `zennSnapshotPath` が無いときに warning を積む設計で、フォールバック成功時はサイレント）。挙動としては正しくフォールバックしているが、警告メッセージそのものは存在しない旨を申し添える。
- `git diff --name-only HEAD~1 HEAD`: `folio-agent.config.json`, `package-lock.json`, `package.json`, `zenn-snapshot.json`
- **Issueの対象フィールドからの逸脱**: `package-lock.json` を対象外だがコミットに含めた。`@folio-agent/handler`/`widget` のバージョン更新を `npm install` で反映すると lockfile も追従して更新されるため、含めないと `npm ci` がlockfile不整合で失敗する（このIssue自体がCI安定化目的のため、除外すると本末転倒になる）。
- **アップストリームの不具合を発見**: `folio-agent-sync-zenn` の bin（`dist/sync/cli.js`）は `import.meta.url === file://${process.argv[1]}` で直接実行判定をしているが、npmが `node_modules/.bin/` に張るシンボリックリンク経由だと `import.meta.url` がsymlink解決後の実パスになり一致せず、`main()` が実行されないままexit code 0で終了する（`folio-agent-ingest` の cli.js にはこのガードが無く問題ない）。そのため `package.json` の `sync-zenn` スクリプトは bin名ではなく `node node_modules/@folio-agent/handler/dist/sync/cli.js ...` を直接呼ぶ形にして回避した。folio-agent側（同じ `yktsnet/folio-agent` リポ）でのcli.js修正は本Issueの対象外のため別途検討が必要。

## 検証手順

- [ ] Cloudflare Pages / GitHub Actions 相当のCI環境（`github-private/zenn` にアクセスできない状態）で `npm run build` が成功することを確認する
- [ ] 本番デプロイ後、Works ページのチャット機能（folio-agent widget）でZenn記事に関する質問に正しく回答できることを確認する
- [ ] 今後Zenn記事を追加する際、`npm run sync-zenn && git add zenn-snapshot.json && git commit -m "chore: sync zenn snapshot"` の運用フローで問題なくスナップショットが更新されることを確認する
