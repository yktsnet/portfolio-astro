## Works カードの状態表記を「現場稼働マーカー1つ」に簡素化
id: 22
branch-slug: works-status-simplify
github_issue:
status: open
type: feat
対象: |
  src/data/works.ts
  src/pages/index.astro
内容: |
  Issue 21 で入れた状態行（実態 reality × デモ性質 demoType の2節）を簡素化する。
  全 Works は OSS で公開・クローン可能・CI/CD 整備済みという点が共通で、それは
  GitHub ボタンと Demo ボタンが既に示している。カードごとに本当に差がある事実は
  「いま現場で誰かが実際に使っているか」の1点のみ。
  よって状態行を単一マーカー「現場に導入・稼働中」だけに置き換える。
  デモ性質・操作可否・OSS 表記はマーカー化しない（ボタンが語るため）。
確認: |
  npm run typecheck（型が通る。未使用の型・import が残っていないこと）
  index ページで対象カードのみマーカーが出て、他カードは日付の直下に description が来ること

---

### 背景

Issue 21 で状態を2節（`reality` = production/self/demo × `demoType` = interactive/simulated）
で表現したが、過剰だった。全プロジェクトが「OSS・クローンして使える・CI/CD 整備済み」で
共通しており、これは各カードの GitHub ボタン＋ Demo ボタンが既に示している。
OSS か・触れるか・操作できるかをラベルにするのは共通属性のラベル化＝ノイズ。

カードごとに差があり、かつ採用者に効く事実は1つだけ:

> いま現場で誰かが実際に使っているか（＝ポートフォリオ作品ではなく実依存されている）。

### データ定義の変更（src/data/works.ts）

- `WorkReality` / `WorkDemoType` 型、および各 Work の `reality` / `demoType`
  フィールドを廃止。
- 代わりに単一フラグを追加。例: `inUse?: boolean`（現場に導入・稼働中なら true）。
- フラグを true にするカード: NFC Attendance System / Cat Feed Tracker /
  Training Scheduler。
- それ以外（Order System / Attendance System / Trading Lab）はフラグなし。

### 描画の変更（src/pages/index.astro）

- Issue 21 で追加した `realityMeta` マップ・`getDemoLabel` 関数・
  `worksResolved` 内の `realityInfo` / `demoLabel`・`WorkReality`/`WorkDemoType`
  の import を削除。
- 日付を右上に出す現状のレイアウトは維持。
- 状態行を「単一マーカー」に置換:
  - `inUse` が true のときだけ、タイトル直下に `● 現場に導入・稼働中` を表示。
  - 色は現状踏襲（emerald キーカラー、点ドット + ラベル）。
  - 第2節（操作できる/動作を再現/状態を公開）は出さない。
  - `inUse` でないカードは状態行を一切出さず、日付の直下に description が続く。

### レイアウト結果のイメージ

```
NFC Attendance System                    2026.01
● 現場に導入・稼働中
（description …）

Order System                             2026.05
（状態行なし。日付の直下に description）
```

### スコープ外（やらないこと）

- Demo / GitHub / 制作記事ボタン、リンク URL、description、rationale、stack の変更。
- カード枠・グリッド・フィルタなどレイアウト構造の変更。
- マーカー以外の新しいバッジ・凡例の追加。
