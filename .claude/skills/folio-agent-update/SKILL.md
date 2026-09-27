---
name: folio-agent-update
description: 新しく公開された @folio-agent/handler と @folio-agent/widget を本サイトに取り込む。リリース PR の「利用側で必要な対応」を読み、依存を上げ、ウィジェットの配色・属性と API の呼び出しを合わせ、表示を確認して PR を出す。
disable-model-invocation: true
---

# folio-agent-update

folio-agent は本サイトが最初の利用者である。新しい版を公開したら、この手順で取り込む。
main へのマージで CI がデプロイするので、PR の時点で表示まで確かめておく。

## 1. 取り込む版と必要な対応を確かめる

```bash
npm view @folio-agent/widget version
npm view @folio-agent/handler version
grep -n '@folio-agent' package.json
gh pr list -R yktsnet/folio-agent --state merged --search 'chore(release) in:title' --limit 5
gh pr view -R yktsnet/folio-agent <PR番号> --json body -q .body
```

2パッケージは同じ版で揃える。現在の版から公開済みの版までのリリース PR をすべて開き、
`## 利用側で必要な対応` を集めて一覧にする。これが 3 で触る箇所になる。

0.x の間は `^0.4.0` のような指定で次の minor に上がらない。Dependabot は cooldown が
7日あり、公開直後は PR を出してこない。既に Dependabot の PR が出ていたら閉じ、この手順で置き換える。

## 2. 依存を上げる

```bash
git switch -c claude/folio-agent-<x.y.z> origin/main
npm install @folio-agent/handler@^<x.y.z> @folio-agent/widget@^<x.y.z>
```

## 3. サイト側を合わせる

folio-agent に触れる箇所は次の4つだけである。1 の一覧に出たものを直す。

| 箇所 | 持っているもの |
|---|---|
| `src/layouts/MainLayout.astro` | `<folio-agent-widget>` のタグと属性（`endpoint` / `policy-href` / `lang` / `heading` / `greeting` / `suggestions`）と、ヘッダ2行目の `slot="subheading"`（何をもとに答えるか。日英の span と Zenn へのリンクを持つ。リンクの見た目はサイトの CSS が決めるので、下線のクラスを付ける） |
| `src/styles/global.css` | ウィジェットの配色。`:root`（ライト）と `.dark`（Poimandres）の2組で `--folio-agent-*` を指定する |
| `src/lib/api.ts` | `formatKnowledge` / `collectAnswerLinks` と `createChatHandler` / `createGeminiGenerator` の呼び出し |
| `folio-agent.config.json` | ingest の設定（`npm run build` が読む） |

ウィジェットの配色は `global.css` だけが持つ。config に `theme` を置かず、`folio-agent.theme.css` も作らない。
`folio-agent-init` を実行するときは、先に `--dry-run` を付けて、config と `build` スクリプトが意図せず
変わらないことを確かめる。

## 4. D1 の migration を適用する

新しい版が migration を足していれば（`ls node_modules/@folio-agent/handler/migrations`）、本番の D1 に適用する。
`wrangler.jsonc` の `migrations_dir` が同梱の migrations を指しているので、足りない分だけが当たる。
本番への操作なので、Claude は実行せずコマンドを user に渡す（`.claude/settings.json` も wrangler を拒否している）。

```bash
npx wrangler d1 migrations apply ykts-folio-agent --remote
```

新しいコードより先に適用してよい（テーブルが増えるだけで、古いコードは触らない）。PR をマージしてデプロイする前に済ませてもらう。

## 5. 検証する

```bash
npm run build
npm run typecheck
npm run test
npx astro dev stop; npm run dev -- --force
```

`astro dev` は常駐する。依存を上げる前に起動したサーバーが残っていると、古い widget のまま動き続け、
ウィジェットが表示されない。先に `npx astro dev stop` で止め、`npm run dev -- --force` で起動し直す。
確認が終わったら `npx astro dev stop` で止める。

http://localhost:4321 を開き、ウィジェットを次の条件で目視する。
dev サーバーでは D1 / Gemini に繋がらず回答は返らないことがあるので、見るのは UI だけでよい。

- ライトとダーク（ヘッダの切り替え）の両方で、起動ボタン・パネル・吹き出し・補助テキストが読める
- ブラウザの開発ツールで幅 390px にし、全画面で開いて閉じられる
- 日本語と英語の切り替えで、ウィジェットの文言が意図どおりになる（`lang` 属性の扱い）

## 6. PR を出す

コミットの件名は `chore(deps): folio-agent を <x.y.z> に上げる`。本文には 1 の一覧と、
3 で何を直したか（直さなかったものは理由）を書く。`## 検証手順` には、デプロイ後に user が
実機のスマホで確かめること（全画面・キーボードで入力欄が隠れない・送信して回答が返る）を書く。

push して `gh pr create` し、URL を伝えて止まる。マージすると CI がデプロイする。
