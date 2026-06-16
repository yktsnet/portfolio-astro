## 変更内容

Works セクションを Antfu スタイルに再設計する。
カード枠・背景色を撤廃し、カテゴリを大きなウォーターマーク見出しとした 3列グリッドのフラットなリスト形式に変える。
/works/ ページは廃止済み（_redirects で / へリダイレクト済み）のため削除する。

- `src/data/works.ts`: `Work` 型の `tag` フィールドを削除し `category: string` を追加。各エントリに `category` を設定（Automation / Hardware / Platform）
- `src/pages/index.astro`: Works セクションを `categoryOrder` によるグループ化 + 3列グリッド表示に書き換え。カード枠・背景色・カラーアクセントを撤廃し、ウォーターマーク見出しとフラットなリスト形式を採用
- `src/pages/works/index.astro`: ファイルを削除（/works/ は public/_redirects で / へリダイレクト済み）

## 静的確認結果

- カード枠・背景色が消えていること: 旧 `rounded-xl border bg-white dark:bg-poi-panel` を持つ div を削除済み。新マークアップにカード枠・背景なし ✅
- カテゴリ見出しが英語の大文字ウォーターマークテキストで表示されること: `font-mono text-5xl font-bold tracking-tight text-zinc-900/10 dark:text-white/10 select-none` で実装済み ✅
- Works が 3列グリッドでカテゴリ別にグループ表示されること: `grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3` + `categoryOrder` によるグループ化で実装済み ✅
- brand icon がスタックタグに表示されること: `s.brandIcon` を参照し SVG で描画するロジックを引き継ぎ済み ✅
- works/index.astro が削除されていること: `delete mode 100644 src/pages/works/index.astro` をコミット済み ✅
- npm run typecheck が通ること: 0 errors, 0 warnings ✅（11 hints はすべて既存）

## 検証手順

- `npm run dev` を起動し http://localhost:4321 を開く
  - Works セクションでカード枠・背景色がなく、フラットなリスト形式で表示されること
  - 「Automation」「Hardware」「Platform」の大きなウォーターマーク見出しが表示されること
  - 各カテゴリ内で Works アイテムが最大3列グリッドで並ぶこと
  - スタックタグにブランドアイコンが色付きで表示されること
- http://localhost:4321/works/ にアクセスし `/` にリダイレクトされること
