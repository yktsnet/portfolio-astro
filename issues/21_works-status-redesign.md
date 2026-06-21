## Works カードの状態表記を「2節の日本語」に再設計
id: 21
branch-slug: works-status-redesign
github_issue: 28
status: open
type: feat
対象: |
  src/data/works.ts
  src/pages/index.astro
内容: |
  Works カードの右上「LIVE」ランプ（緑点滅 + "LIVE"）を廃止し、
  タイトル直下に「[実態] · [訪問者ができること]」の2節を日本語平文で表示する。
  目的は転職活動用ポートフォリオとして採用者が誤解しないこと。
  LIVE/Demo という抽象記号は凡例が要り、本番とデモの区別が曖昧になるため、
  凡例不要の平文に置き換える。全カード同じ構文に固定して流し読み性を保つ。
確認: |
  pnpm build（型・ビルドが通る）
  index ページで全6カードに状態行が出て、旧 LIVE ランプが消えていること

---

### 背景・方針

現状は `works.ts` の `status?: "live"` フラグ1つで、`index.astro` が緑点滅の
「LIVE」ランプを出している。これには2つの問題がある。

- 「LIVE」が「本番運用中」なのか「ちゃんと公開している」なのか二重含意で、
  採用者がデモを本番と誤読しうる。
- 公開リポ・CI/CD 完備は全カード共通の属性なので、差分バッジにする意味がない
  （GitHub ボタンが全カードに付いていることが既にその証明になっている）。

そこで状態を「2つの独立した事実」に分解し、日本語平文で言い切る。

- 第1節（実態）: 誰がどう使っているか
- 第2節（できること）: 訪問者がそのデモで何をできるか

抽象ランプも凡例も追加しない。英語が残るのは `works.ts` の内部符号のみで、
画面表示はすべて日本語。

### データ定義の変更（src/data/works.ts）

`Work` 型の `status?: "live"` を廃止し、状態を表す2フィールドに置き換える。
命名は実装側に任せるが、意図は以下。

- 実態: `production`（現場で実ユーザーが利用中） / `self`（自己運用で常時稼働） /
  `demo`（技術検証として作成、顧客運用ではない）
- デモ性質: `interactive`（クローンがそのまま動き操作できる Web アプリ） /
  `simulated`（実体はハード/エッジ。ページ内で動作を再現）

各カードへの割り当て:

| カード | 実態 | デモ性質 | 表示される状態行 |
|---|---|---|---|
| NFC Attendance System | production | simulated | 現場で運用中 · デモは動作を再現 |
| Cat Feed Tracker | production | simulated | 現場で運用中 · デモは動作を再現 |
| Training Scheduler | production | interactive | 現場で運用中 · 同じものを操作できる |
| Order System | demo | interactive | 技術デモ · そのまま操作できる |
| Attendance System | demo | interactive | 技術デモ · そのまま操作できる |
| Trading Lab | self | interactive | 自己運用で常時稼働 · 状態を公開 |

※ Trading Lab の第2節は「状態を公開」（バックエンド状態の閲覧公開）。
他の interactive とは文言を変える。実態と文言の対応は実装側で素直にマップ化する。

### 描画の変更（src/pages/index.astro）

レイアウトの入れ替えを伴う。

- 現在の `work.status === "live"` の LIVE バッジブロック（緑点滅 span + "LIVE"、
  122〜128行あたり）を削除。
- 日付（`publishedAt`）を**タイトル行の右上へ移動**（旧 LIVE ランプがあった位置）。
  `ml-auto` でタイトルと同じ行の右端に置き、`font-mono text-[11px]` のまま
  ミュート色で控えめに出す。
- 空いたタイトル直下（旧・日付の位置）に**状態行**を入れる。
  - 第1節（実態）: アイコン + 色付き文字。色は **旧 LIVE で使っていた
    emerald（緑）をキーカラーとして踏襲**する。
    production は emerald 系でしっかり、self/demo はミュート寄りで差をつける。
  - 区切り「·」を挟み、第2節（できること）: ミュート文字。
  - 全体は控えめだが、ラフ（提示済みモックアップ）程度には色を入れて、
    第1節がぱっと目に入るようにする。
- 実態 → ラベル/色、デモ性質 → 第2節文言、の小さなマップを astro 側に置く程度。

レイアウト結果のイメージ:

```
NFC Attendance System                              2026.01   ← 日付は右上へ
● 現場で運用中 · デモは動作を再現                            ← 空いた所に状態行（emerald キーカラー）
（description …）
```

### スコープ外（やらないこと）

- カード個別のカテゴリ表記追加（セクション見出しが既にグルーピング済み）。
- 凡例の追加。
- works.ts のリンク URL や description / rationale / stack の変更。
- レイアウト構造（カード枠・グリッド・フィルタ）の変更。
