---
name: pr-workflow
description: ブランチ作成・実装・PR作成までの標準フロー
disable-model-invocation: true
---

以下の手順で issue を実行する。$ARGUMENTS に issue ファイルのパスを渡す。

**前提: Claude Code はコードを書いて PR を出すまでが担当。実行・確認・マージは user が行う。**

0. `context/conventions.md`・`context/structure.md` を読む
1. issue ファイルを読む
2. `git status` で未コミットがあれば報告して止まる
3. `git checkout -b claude/{id}-{branch-slug}`（id と branch-slug は issue から取得）
4. 対象ファイルを読んで実装
5. issue の「確認」項目に従い静的チェックを実施する
   - コードを読んで import・caller・整合性を確認する
   - `npm run typecheck` で型エラーがないことを確認する
   - デプロイ・ブラウザ確認は行わない
6. `git add {変更したファイル}`
   `git diff --name-only --cached` を実行する。
   出力が issue の「対象」フィールドと完全一致することを確認する。
   不一致があれば実装に戻り修正する。一致してから次に進む。
7. `git commit -m "{type}: {タイトル}"`
8. PR ボディを `.git/pr_body.md` に書き出し、同内容を `issues/done/{id}_{branch-slug}_pr.md` にもコピーする。
   `git add issues/done/{id}_{branch-slug}_pr.md` して `git commit -m "chore: add PR record {id}"` でコミットしてから PR を作成する。
   `.git/pr_body.md` の内容:
   ```
   ## 変更内容
   {issue の内容フィールドを展開}

   ## 静的確認結果
   {issue の確認項目に対してコードを読んで確認した結果}

   ## 検証手順
   {実装内容から判断して以下を記載する。該当しない項目は省略する}
   - UI 変更の場合: `npm run dev` を起動し http://localhost:4321 で確認する画面・操作を明記する
   - 型エラーの場合: `npm run typecheck` の出力
   - ルーティング変更の場合: 旧 URL の 404 / 新 URL の表示を確認する手順
   ```
   `gh pr create --base main --title "{type}: {タイトル}" --body-file .git/pr_body.md`
9. PR の URL を出力して終了
   ```
   ✅ PR created: {URL}
   Next: 検証手順を実施 → gh pr merge {番号} --merge
   ```
