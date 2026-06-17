## 変更内容

実績カテゴリ構成の整理と、新規実績「Training Scheduler」の追加を行った。

1. カテゴリ名の変更: Platform → Finance（Trading Lab の所属カテゴリ変更を含む）
2. NFC Attendance System を Modernization から Hardware カテゴリに移動し、カラーを `#addb67`（緑）に変更
3. カテゴリ表示順序を Hardware ➔ Modernization ➔ Finance に変更
4. 新規実績「Training Scheduler」を Modernization カテゴリ（カラー `#c792ea`）に追加
5. アイコン定義（graduation-cap / go, vue, sqlite）を追加

## 静的確認結果

- `src/pages/index.astro` の `categoryOrder` が `["Hardware", "Modernization", "Finance"]` になっていること → ✅ 確認済
- `src/data/works.ts` 内で NFC の `category` が `Hardware`、`color` が `#addb67` になっていること → ✅ 確認済
- `src/data/works.ts` 内に Training Scheduler が追加され、カテゴリが `Modernization`、`color` が `#c792ea` になっていること → ✅ 確認済
- `brand-icons.ts` に `go`, `vue`, `sqlite` の3エントリが追加され、`simple-icons` から `siGo`, `siVuedotjs`, `siSqlite` が正しくインポートされていること → ✅ 確認済（node で存在検証）
- `lucide.ts` に `graduation-cap` の SVG パスが追加されていること → ✅ 確認済
- `BrandKey` に `"go" | "vue" | "sqlite"` が追加されていること → ✅ 確認済
- `npm run typecheck` → 0 errors, 0 warnings（hints 12 件はすべて既存のもの）

## 検証手順

- `npm run dev` を起動し `http://localhost:4321` でトップページを確認する
  - カテゴリ順が **Hardware → Modernization → Finance** になっていること
  - Hardware 欄に NFC Attendance System がグリーン（#addb67）で表示されること
  - Modernization 欄に Training Scheduler がパープル（#c792ea）で graduation-cap アイコンとともに表示されること
  - Finance 欄に Trading Lab が表示されること
  - Training Scheduler のスタックタグ（Vue / Go / SQLite）にブランドアイコンが表示されること
