## 変更内容

Works カードの右上「LIVE」ランプ（緑点滅 + "LIVE"）を廃止し、
タイトル直下に「[実態] · [訪問者ができること]」の2節を日本語平文で表示する。

### データ定義（src/data/works.ts）
- `status?: "live"` を廃止し、`reality: WorkReality` と `demoType: WorkDemoType` の2フィールドに置き換え
- `WorkReality`: `"production"` / `"self"` / `"demo"`
- `WorkDemoType`: `"interactive"` / `"simulated"`
- 全6カードに適切な値を割り当て

### 描画（src/pages/index.astro）
- LIVE バッジブロック（緑点滅 span + "LIVE"）を削除
- 日付（`publishedAt`）をタイトル行の右上へ移動（`ml-auto` で右端）
- 空いたタイトル直下に状態行を追加:
  - 第1節（実態）: 色付きドット + ラベル（production は emerald しっかり、self は emerald 控えめ、demo は zinc ミュート）
  - 区切り「·」
  - 第2節（できること）: ミュート文字

### 各カードの表示

| カード | 状態行 |
|---|---|
| NFC Attendance System | ● 現場で運用中 · デモは動作を再現 |
| Cat Feed Tracker | ● 現場で運用中 · デモは動作を再現 |
| Training Scheduler | ● 現場で運用中 · 同じものを操作できる |
| Order System | ● 技術デモ · そのまま操作できる |
| Attendance System | ● 技術デモ · そのまま操作できる |
| Trading Lab | ● 自己運用で常時稼働 · 状態を公開 |

## 静的確認結果

- `npm run typecheck`: 0 errors（warnings/hints は既存のもののみ）
- import 整合性: `works.ts` の `WorkReality`・`WorkDemoType` を `index.astro` で正しく import し使用
- `status` 参照箇所: `index.astro` の旧 LIVE バッジのみ → 削除済み。他ファイルに `work.status` 参照なし
- 対象ファイル: `src/data/works.ts`, `src/pages/index.astro` のみ変更（issue の対象と一致）

## 検証手順

- `npm run dev` を起動し http://localhost:4321 を開く
- 全6カードのタイトル直下に状態行（「● 現場で運用中 · デモは動作を再現」等）が表示されていること
- 旧 LIVE ランプ（緑点滅 + "LIVE"）が消えていること
- 日付がタイトル行の右端に表示されていること
- production カードの第1節が emerald 系の色、demo カードがミュート色、self カードが emerald 控えめであること
- ダークモードでも状態行の色分けが視認できること

Closes #28
