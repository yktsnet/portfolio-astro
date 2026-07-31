## PR記録: chore: Works・ヘッダーからZennリンクを削除
issue: 52 (52_remove-zenn-links.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/113
Merged: 0cd7ccf0d44e73945105f8fdccde61387c6a1cf6

## 変更内容
Works カードとヘッダーから Zenn への外部リンク・アイコンを削除し、GitHub リンクを基本の導線とした。未使用になった Zenn 関連コードも削除した。

- src/data/works.ts: NFC Attendance Kit・Cat Feed Tracker の `links` から Zenn エントリを削除（`postSlug` は `getPostVisualMeta` が使うため残置）
- src/components/WorkCard.astro: `isZenn` 判定とZennアイコン描画分岐を削除
- src/lib/brand-icons.ts: `siZenn` の import・re-export・`"zenn"` マップエントリを削除（他に使用箇所なしを grep で確認済み）
- src/components/RightNav.astro: Zenn への `<a>` リンクと `siZenn` import を削除

## 保証
- NFC Attendance Kit・Cat Feed Tracker の Works カードに Zenn へのリンクは表示されない。GitHub・Demo リンクは従来通り表示される → なし（Astro コンポーネントの描画結果は docs/guarantees.md の対象外。works.ts の diff と WorkCard.astro の分岐削除で目視確認）
- ヘッダー右上のアイコン群（RightNav）に Zenn へのリンクは表示されない → なし（同上、diff で確認）
- 既存の GitHub・Demo リンクの遷移先・ラベル・表示順は変更しない → 維持。diff は Zenn エントリの削除のみで GitHub/Demo エントリは無変更
- zenn.dev 上の既存記事自体は変更・削除しない → 維持。zenn.dev や記事コンテンツ（src/content/post/）には触れていない

## 静的確認結果
- `npm run typecheck`: 0 errors, 0 warnings, 9 hints（`RightNav.astro` の `isPhotos` unused warning は本変更起因ではなく既存）
- `grep -rn "siZenn\|isZenn\|zenn" src/`: 対象ファイル配下に残存参照なし。ヒットは `src/content/post/nfc-attendance-system.md` と `src/content/post/cat-feed-tracker.md` の記事本文中の Zenn 記事への言及のみ（Issue の対象外・保証により記事内容は変更しないため意図した残存）
- import・caller 整合性: `getBrandIcon` は WorkCard.astro で npm 判定に引き続き使用されており import は妥当。brand-icons.ts の "zenn" エントリ削除後も他キーの参照に影響なし
- `git diff --name-only --cached`: src/components/RightNav.astro, src/components/WorkCard.astro, src/data/works.ts, src/lib/brand-icons.ts（Issue の対象と完全一致）

## 検証手順
- `npm run dev` でトップページの Works カード（NFC Attendance Kit・Cat Feed Tracker）に Zenn リンクが表示されないこと、GitHub・Demo リンクが従来通り表示されることを目視確認
- ヘッダー右上（RightNav）に Zenn アイコンが表示されず、GitHub・Photos・Contact・ThemeToggle の並びが崩れていないことを目視確認
