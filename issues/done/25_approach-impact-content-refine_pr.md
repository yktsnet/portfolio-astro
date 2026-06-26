## 変更内容

APPROACH／IMPACT のコンテンツを承認済みデザインへ刷新し、About の余白・モバイルリンクのテキストラベルをあわせて修正。

- **Approach.astro（全面差し替え）**
  - icon 付き Bento カード 3 枚 + Nix Flakes フロー図 2 本 → 軽量フロー（設計→実装→検証）1 本に集約
  - 3 本柱（環境の同一化／ロールの分離／機密の隔離）を `dl` 定義リストへ圧縮
  - 導入文を「三層で構造的に担保」の 1 段落に再構成 (`text-[15px] text-zinc-700 dark:text-zinc-300`)
  - OSS リンクに「Claude Code / Jules 両対応」テキストを追加

- **Impact.astro（全面差し替え）**
  - 数値メトリクスカード 2 枚 + 勤怠フロー図（icon 付き）→ 3 戦線リストへ置換
  - 勤怠 DX（稼働中）／書類作成の自動化（進行中）／空室情報の配信（設計中）の 3 ストリーム
  - 稼働中は緑ドット、進行中・設計中はグレーのテキストのみ（色は点だけルール遵守）
  - 数値（月 −5h ／ 差異 −3〜4万）を勤怠行の右端にインライン mono で表示
  - 導入をナラティブ 2 段落に再構成

- **About.astro（見出し下の余白を局所修正）**
  - `space-y-4` のラッパーを廃止し、見出しと本文塊を分離
  - 本文塊に `mt-6 space-y-4` を適用して窮屈さを解消
  - `!mt-2` → `mt-2`（important 修飾子を除去）

- **HeroMobile.astro（外部リンクに text ラベルを付与）**
  - GitHub / Zenn / Contact のアイコンのみ → アイコン＋テキストラベル
  - `aria-label` はテキスト追加により削除（重複読み上げ回避）
  - コンテナを `mt-4 gap-4 text-zinc-400` → `mt-5 gap-5 text-sm text-zinc-500` に調整

## 静的確認結果

`npm run typecheck` 結果:
- **エラー: 0**
- **警告: 0**（12 hints は既存・本 Issue と無関係）

`git diff --name-only HEAD~1`:
```
src/components/About.astro
src/components/Approach.astro
src/components/HeroMobile.astro
src/components/Impact.astro
```
→ Issue の「対象」フィールドと完全一致。

lucide.ts アイコン確認（`arrow-right` / `github` / `external-link` / `mail`）: すべて既存エントリに存在。新規追加なし。

## 検証手順

`npm run dev` → ブラウザでトップページを開き、以下を目視確認:

- APPROACH: 設計→実装→検証の 3 カードフロー（矢印は緑）が表示され、検証カードのみ緑ボーダー・背景になること
- APPROACH: 3 本柱が定義リスト形式で表示されること
- IMPACT: 3 戦線リストが表示され、勤怠 DX に緑ドット + ステータス「稼働中」が表示されること
- IMPACT: 数値が勤怠行の右端に mono で表示されること
- About: 見出しと本文の間隔が広がっていること（`mt-6` 余白）
- モバイル幅（< 640px）: GitHub / Zenn / Contact リンクにテキストラベルが表示されること
