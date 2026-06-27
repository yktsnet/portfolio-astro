## 変更内容

Impact セクションを「上部テキスト＋下部縦タイムライン」の2部構成に再設計（Issue #50）。

- **上部**: 見出し（既存維持）＋厚めの説明文（経歴の弧を地続きで読ませる）
- **下部**: 1本の縦タイムライン。各フェーズ（きっかけ・転機・現在）からワークが branch（左罫線でぶら下がり）する形に統合
  - 旧来の「タイムライン3件 ＋ 戦線リスト3件」の分割を廃止
  - 勤怠 DX の metric を `−5 h` / `−3〜4 万` として mono 26px で大きく表示
  - 現在ノードのみ accent 色＋塗りつぶし丸
  - repo リンクは「きっかけ」branch にのみ配置（重複なし）

## 静的確認結果

`npm run typecheck` → **0 errors, 0 warnings** (12 hints はすべて既存のもの)

```
git diff --name-only HEAD~1
src/components/Impact.astro
```

- 各 work の body・status・repo リンク・勤怠の metric 値: 保持確認 ✅
- `getLucideIcon` の import: 新実装では外部リンクアイコンをインライン SVG で記述するため削除（依存なし） ✅
- 型定義はコンポーネント内ローカル（`Metric` / `Work` / `Phase`）: conventions 準拠 ✅

## 検証手順

- `npm run dev` でトップページを開き、Impact セクションが「上部テキスト＋縦タイムライン」で表示されることを確認
- ダークモード切替で色が適切に変わることを確認
- 「勤怠 DX」branch に `−5 h` / `−3〜4 万` が大きい mono フォントで表示されることを確認
- 「現在」ノードの丸が accent 色で塗りつぶされていることを確認
- GitHub リンクが正しく `https://github.com/yktsnet/nfc-attendance-kit` を開くことを確認
