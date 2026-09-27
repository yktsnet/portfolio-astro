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
| `src/layouts/MainLayout.astro` | `<folio-agent-widget>` のタグと属性（`endpoint` / `policy-href` / `lang` / `heading` / `greeting` / `suggestions`） |
| `src/styles/global.css` | ウィジェットの配色。`:root`（ライト）と `.dark`（Poimandres）の2組で `--folio-agent-*` を指定する |
| `src/lib/api.ts` | `createChatHandler` / `createGeminiGenerator` の呼び出し |
| `folio-agent.config.json` | ingest の設定（`npm run build` が読む） |

ウィジェットの配色は `global.css` だけが持つ。`folio-agent.theme.css` と config の `theme` は
どこからも読み込まれていないので、配色を変えるときに触らない。

## 4. 検証する

```bash
npm run build
npm run typecheck
npm run test
npm run dev
```

`npm run dev` で http://localhost:4321 を開き、ウィジェットを次の条件で目視する。
dev サーバーでは D1 / Gemini に繋がらず回答は返らないことがあるので、見るのは UI だけでよい。

- ライトとダーク（ヘッダの切り替え）の両方で、起動ボタン・パネル・吹き出し・補助テキストが読める
- ブラウザの開発ツールで幅 390px にし、全画面で開いて閉じられる
- 日本語と英語の切り替えで、ウィジェットの文言が意図どおりになる（`lang` 属性の扱い）

## 5. PR を出す

コミットの件名は `chore(deps): folio-agent を <x.y.z> に上げる`。本文には 1 の一覧と、
3 で何を直したか（直さなかったものは理由）を書く。`## 検証手順` には、デプロイ後に user が
実機のスマホで確かめること（全画面・キーボードで入力欄が隠れない・送信して回答が返る）を書く。

push して `gh pr create` し、URL を伝えて止まる。マージすると CI がデプロイする。
