## 変更内容

現在全幅センター寄りのレイアウトを Hero 左・Works 右の非対称構成に変更し、Hero の細部を追加調整する。

1. Works セクション（`<section>`）に `text-right` を追加し、全体を右寄せに変更
2. Works アイコンをカード左のボックス（`w-9 h-9 rounded-lg`）から h3 タイトル横インライン SVG（16px）に移動し、アイコンボックスを削除
3. Works スタックタグ行・リンク行の flex コンテナに `justify-end` を追加して右揃え
4. Hero の「Builder」テキストに Poimandres グリーン（`#addb67`）を `style` 属性で適用
5. Hero メタ情報行（Osaka / ykts.net / 2025〜）に GitHub リンク（https://github.com/yktsnet）を追加（SVG アイコンはインライン記述）
6. モバイル：`text-right` は無条件適用のため全画面幅で右寄せを維持（全幅フォールバックなし）

## 静的確認結果

- **Works セクション全体が右寄せ**: `<section class="mb-16 text-right">` で確認 ✅
- **カテゴリ見出し・各 work カード・リンクが右寄せ揃い**: `text-right` が h2・p・`inline-flex` h3 すべてに継承、flex コンテナに `justify-end` を追加 ✅
- **アイコンが h3 タイトル横にインライン表示**: `<h3 class="inline-flex items-center gap-2 ...">` 内に SVG を配置、旧アイコンボックスは削除済み ✅
- **「Builder」が #addb67 で表示**: `<span style="color:#addb67">Builder</span>` で確認 ✅
- **GitHub リンクがメタ情報行に追加**: `href="https://github.com/yktsnet"` の `<a>` タグが Osaka / ykts.net / 2025〜 と並列に配置 ✅
- **import・caller 整合性**: `getLucideIcon`・`getBrandIcon`・`works` は引き続き使用、GitHub アイコン SVG はインライン記述のため新規 import 不要 ✅
- **`npm run typecheck`**: 0 errors / 0 warnings（hints 12 件は既存のもの） ✅

## 検証手順

`npm run dev` を起動し http://localhost:4321 で以下を確認する。

- **Works 右寄せ**: Automation / Hardware / Platform の各カテゴリ見出し・カード・リンクボタンが右端寄りに表示されること
- **アイコン位置**: 各 Work のタイトル（h3）の右横に 16px のアイコンがインラインで表示されること（旧アイコンボックスが消えていること）
- **Builder グリーン**: Hero の「Builder · @yktsnet」の「Builder」部分が緑色（#addb67）で表示されること
- **GitHub リンク**: Hero のメタ情報行に GitHub アイコン＋「GitHub」テキストのリンクが追加されており、クリックで https://github.com/yktsnet が開くこと
- **モバイル**: ブラウザ幅を 375px 相当に縮小しても Works が右寄せのままであること
