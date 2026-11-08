---
name: dev-preview
description: 本サイトを手元の開発サーバーで起動し、user が別ペインのブラウザで確かめられるようにする。PR の検証手順でブランチの worktree を開くとき、変更を画面で見せるときに使う。
disable-model-invocation: true
---

# dev-preview

開発サーバーを起動して URL を渡すまでを受け持つ。起動前の確認（依存とログイン）は
`.claude/hooks/check-dev-server.sh` が PreToolUse で行い、通らなければ `astro dev` を止める。
確認の中身は `.claude/scripts/dev-preflight.sh` にあり、Hook とこの手順の両方がそれを呼ぶ。

## 1. 起動先を決める

```bash
git worktree list
```

- 検証する PR があれば、そのブランチの worktree を起動先にする
- main 以外の worktree が1つだけなら、それを使う。複数あって決められないときは user に聞く
- どれにも当たらなければ元のチェックアウト（main）を使う

## 2. 起動前に確かめる

```bash
bash .claude/scripts/dev-preflight.sh <起動先>
```

止まったときは、出力に書かれた対処に従う。Cloudflare のログインは user に頼む。`wrangler` は
permissions で拒否しているので、Claude は実行しない。

`CF_REMOTE_BINDINGS=false` で起動すると、KV（`SESSION`）はローカルに置き換わる。`/api/chat` と `/api/contact` は、
ログインの有無にかかわらず、手元では API キー（`GEMINI_API_KEY` など）が無いため動かない。

## 3. 起動する

ポートは main を 4321、worktree を 4322 から順に割り当てる。使用中かは `ss -tln | grep :<port>` で確かめる。

tmux の中（`$TMUX` が空でない）なら、隣のペインで起動する。`-d` でフォーカスを Claude のペインに残す。

```bash
tmux split-window -h -d -P -F '#{pane_id}' -c <起動先> "npx astro dev --port <port>"
```

出力されたペイン ID を控えておく。サーバーのログはそのペインに流れ、user が Ctrl-C で止められる。

tmux の外なら、バックグラウンドで起動する。

```bash
cd <起動先> && npx astro dev --background --port <port>
```

## 4. URL を渡す

`curl -s -o /dev/null -w '%{http_code}' http://localhost:<port>/` が 200 を返すまで待ってから、
確かめてほしいページの URL を user に渡す。起動先の worktree 名と、`CF_REMOTE_BINDINGS=false` で
起動したかどうかも添える。

## 5. 止める

user の確認が済んだら止める。worktree を消す前にも止める。

```bash
tmux kill-pane -t <ペイン ID>           # tmux で起動したとき
cd <起動先> && npx astro dev stop       # --background で起動したとき
```
