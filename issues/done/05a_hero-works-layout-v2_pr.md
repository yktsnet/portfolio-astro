## 変更内容

05 の右寄せ案を廃止し、Hero 左固定（sticky）・Works 右スクロールの 2カラム構成に再設計した。

1. ページ全体を flex 2カラムに変更（Hero `w-52` sticky サイドバー / Works `flex-1`）
2. Works アイコンボックスを廃止し、h3 タイトル左にインライン SVG（16px）として移動
3. Hero の「Builder · @yktsnet」行全体を `text-poi-accent`（#5de4c7）に変更
4. GitHub リンク（https://github.com/yktsnet）が Hero メタ情報行に存在（既存維持）
5. モバイルは `sm:hidden` の Hero ブロックを flex コンテナより前に配置し、縦積み（Hero → Works）を実現

## 静的確認結果

- **レイアウト構造**: `<div class="flex gap-12">` の中に `<aside class="w-52 shrink-0 sticky top-12 self-start hidden sm:block">` と `<main class="flex-1 min-w-0">` が正しく配置されている
- **モバイル Hero**: `<div class="sm:hidden mb-12">` を flex コンテナより前に配置。モバイルでは Hero → Works の縦積みになる
- **アイコン位置**: `<h3>` 内で `<svg>` が `{work.title}` より前に配置されており、タイトル左にインライン表示される
- **アイコンボックス廃止**: `w-9 h-9` の角丸カードラッパーなし。SVG は h3 内に直接配置
- **Builder 行カラー**: `<p class="font-mono text-sm text-poi-accent mt-1">Builder · @yktsnet</p>` — `poi-accent` は tailwind.config.mjs で `#5de4c7` と定義済み
- **GitHub リンク**: デスクトップ aside・モバイル div 両方に `href="https://github.com/yktsnet"` リンクが存在
- **右寄せ廃止**: Works section の `text-right`、stack タグ・リンクの `justify-end` を削除
- **`npm run typecheck`**: 0 errors, 0 warnings

## 検証手順

`npm run dev` を起動し http://localhost:4321 で以下を確認する:

1. **デスクトップ（sm 以上）**:
   - 左カラム（w-52）に Hero（プロフィール画像・名前・Builder · @yktsnet・説明・メタリンク）が表示される
   - ページをスクロールしても Hero が左に固定されたまま（sticky）であること
   - 右カラムに Works が表示されること
2. **Works アイコン**:
   - 各 Work カードの h3 タイトル左に 16px の SVG アイコンがインライン表示されること
   - アイコンを囲む角丸ボックス（`w-9 h-9`）が存在しないこと
3. **「Builder · @yktsnet」行**:
   - テキスト全体が `#5de4c7`（ターコイズ系）で表示されること
4. **GitHub リンク**:
   - Hero メタ情報エリアに GitHub リンクが表示されること
5. **モバイル（sm 未満）**:
   - Hero が最上部に表示され、その下に Works が続く縦積みレイアウトになること
   - 左サイドバー（aside）が非表示になること
