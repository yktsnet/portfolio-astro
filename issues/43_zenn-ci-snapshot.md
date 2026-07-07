## Zenn記事取り込みをCIで動くようにする（folio-agent 0.4.0のスナップショット方式に切り替え）
id: 43
skill: pr-workflow
branch-slug: zenn-ci-snapshot
github_issue:
status: open
type: fix
対象: |
  package.json（@folio-agent/handler・@folio-agent/widget を ^0.4.0 に更新、sync-zenn スクリプト追加）
  folio-agent.config.json（zennSnapshotPath の追加）
  zenn-snapshot.json（新規。folio-agent-sync-zenn の出力をコミット）
内容: |
  CI（GitHub Actions）は github-private/zenn リポにアクセスできないため、
  build 時に folio-agent-ingest が config.zenn.articlesDir を読もうとして
  ENOENT で落ちる。folio-agent 0.4.0 で追加された zennSnapshotPath フォール
  バック機構を使い、事前生成したスナップショットJSONをリポにコミットして
  CI から参照できるようにする。
確認: |
  npm run typecheck が通ること。
  ローカルで npm run build（zenn/articles が存在する状態）が従来どおり成功
  すること。
  articlesDir を一時的に存在しないパスに変える等でCI相当の状況を再現し、
  npm run build が「zenn-snapshot.json を使ってフォールバック」の警告付き
  で成功することを目視確認。確認後は元のパスに戻す。

---

### 1. 依存の更新

- `@folio-agent/handler` / `@folio-agent/widget` を `^0.4.0` に上げる（`npm install @folio-agent/handler@0.4.0 @folio-agent/widget@0.4.0`）。

### 2. sync-zenn スクリプトの追加

`package.json` の `scripts` に以下を追加する。

```json
"sync-zenn": "folio-agent-sync-zenn folio-agent.config.json zenn-snapshot.json"
```

これは記事追加のたびに手元で叩く定型コマンドとして使う（Issue不要、`npm run sync-zenn && git add zenn-snapshot.json && git commit -m "chore: sync zenn snapshot"` のみで完結させる運用にする）。

### 3. folio-agent.config.json

`zenn` ブロックの兄弟に `zennSnapshotPath: "zenn-snapshot.json"` を追加する。

### 4. 初回スナップショットの生成

`npm run sync-zenn` を実行し、生成された `zenn-snapshot.json` をコミットに含める（`.gitignore` で除外されていないことを確認）。

### 5. 動作確認の具体的手順

`folio-agent.config.json` の `zenn.articlesDir` を一時的に存在しないパス（例: 末尾に `-tmp` を付与）に書き換えて `npm run build` を実行し、`generateKnowledge` が `zennSnapshotPath` からスナップショットを読んでビルドが成功することを確認する。確認後は `articlesDir` を元の値に戻すこと（コミットに残さない）。
