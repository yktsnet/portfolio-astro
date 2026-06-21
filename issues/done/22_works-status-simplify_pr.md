## 変更内容

Issue 21 で導入した状態行（reality × demoType の2節表示）を簡素化。
全 Works は OSS・クローン可能・CI/CD 整備済みという共通属性があり、それは GitHub / Demo ボタンが既に示しているため、カードごとに差がある事実「現場で実際に使われているか」だけをマーカー化した。

- `WorkReality` / `WorkDemoType` 型、各 Work の `reality` / `demoType` フィールドを廃止
- 単一フラグ `inUse?: boolean` を追加（NFC Attendance System / Cat Feed Tracker / Training Scheduler が `true`）
- `index.astro` から `realityMeta` マップ・`getDemoLabel` 関数・`realityInfo` / `demoLabel` の算出・import を削除
- `inUse` が true のカードのみタイトル直下に `● 現場に導入・稼働中`（emerald キーカラー）を表示
- `inUse` でないカード（Order System / Attendance System / Trading Lab）は状態行を一切出さない

## 静的確認結果

- `npm run typecheck`: 0 errors（既存の warnings/hints のみ、本変更に起因するものなし）
- `WorkReality` / `WorkDemoType` / `realityMeta` / `getDemoLabel` / `realityInfo` / `demoLabel` / `.reality` / `.demoType` への参照が `src/` 内に残っていないことを grep で確認済み
- `inUse: true` が NFC Attendance System / Cat Feed Tracker / Training Scheduler の3件に設定され、Order System / Attendance System / Trading Lab には `inUse` フィールドなし（= undefined = 表示なし）

## 検証手順

- `npm run dev` を起動し http://localhost:4321 を開く
- NFC Attendance System / Cat Feed Tracker / Training Scheduler のカードにのみ、タイトル直下に emerald 色の `● 現場に導入・稼働中` マーカーが表示されること
- Order System / Attendance System / Trading Lab のカードには状態行がなく、日付の直下に description が続くこと
- 各カードの Demo / GitHub / 制作記事ボタン、description、rationale、stack が従来通り表示されること

Closes #30
