## 変更内容

フォントサイズの底上げと、ホバースタイルを poi-accent に統一する。

1. Hero メタ情報（Osaka / ykts.net / GitHub / 2025〜 / Post / Contact）: `text-xs` → `text-sm`（モバイル・デスクトップ両方）
2. Hero メタ情報リンクに `hover:text-poi-accent dark:hover:text-poi-accent` を追加（旧: `hover:text-zinc-700 dark:hover:text-poi-focus`）
3. Search ボタン: `hover:bg-zinc-100 dark:hover:bg-poi-panel` を削除し `hover:text-poi-accent dark:hover:text-poi-accent` に変更
4. ThemeToggle ボタン: `hover:bg-zinc-100 dark:hover:bg-poi-panel` を削除し `hover:text-poi-accent dark:hover:text-poi-accent` に変更

## 静的確認結果

- `src/pages/index.astro`
  - モバイル Hero メタ情報 div: `text-xs` → `text-sm` ✅
  - デスクトップ Hero メタ情報 div: `text-xs` → `text-sm` ✅
  - モバイルのリンク 4 件（ykts.net / GitHub / Post / Contact）: `hover:text-zinc-700 dark:hover:text-poi-focus` → `hover:text-poi-accent dark:hover:text-poi-accent` ✅
  - デスクトップのリンク 4 件（ykts.net / GitHub / Post / Contact）: 同上 ✅
- `src/components/Search.astro`
  - open ボタン: `hover:bg-zinc-100 dark:hover:bg-poi-panel` → `hover:text-poi-accent dark:hover:text-poi-accent` ✅
- `src/components/ThemeToggle.astro`
  - toggle ボタン: `hover:bg-zinc-100 dark:hover:bg-poi-panel` → `hover:text-poi-accent dark:hover:text-poi-accent` ✅
- `npm run typecheck`: 0 errors ✅

## 検証手順

`npm run dev` を起動し http://localhost:4321 で以下を確認する。

- **Hero メタ情報のフォントサイズ**: サイドバー（デスクトップ）およびモバイル Hero で Osaka / ykts.net / GitHub / 2025〜 / Post / Contact のテキストが以前より若干大きくなっていること
- **Hero メタ情報リンクのホバー**: ykts.net / GitHub / Post / Contact リンクにカーソルを当てたとき、テキストがグリーン（poi-accent）に変わること
- **Search ボタンのホバー**: ヘッダーの検索アイコンにカーソルを当てたとき、背景ブロックが出ずアイコンがグリーンになること
- **ThemeToggle ボタンのホバー**: ヘッダーのテーマ切り替えアイコンにカーソルを当てたとき、背景ブロックが出ずアイコンがグリーンになること
- **ダークモード**: 上記すべてをダークモードでも確認する
