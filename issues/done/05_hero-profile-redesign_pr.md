## 変更内容

トップページの Hero セクションを SNS プロフィール風にリデザインした。

- **レイアウト変更**: デスクトップ（`sm:`）でアバター左寄せ＋情報右の横並び（`flex-row`）、モバイルは縦積み中央揃えを維持
- **肩書・ハンドル追加**: "Builder · @yktsnet" を名前の直下にモノスペース・ミュートカラーで表示
- **メタ情報行追加**: 小アイコン付きで Osaka / ykts.net / 2025〜 を表示
  - map-pin: 既存の `getLucideIcon("map-pin")` を使用
  - link・calendar: SVG パスを index.astro にインライン記述
  - ykts.net リンクは `target="_blank" rel="noopener noreferrer"` 付き外部リンク

変更ファイル: `src/pages/index.astro` のみ

## 静的確認結果

- ✅ デスクトップ（`sm:`）でアバターが左寄せ、情報が右に並ぶこと → `flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-8` で実装
- ✅ モバイルで縦積み中央揃えになること → `flex-col items-center` がベース
- ✅ "Builder" と "@yktsnet" が名前の下に表示されること → `<p class="font-mono text-sm text-zinc-500 dark:text-poi-muted mt-1">Builder · <span>@yktsnet</span></p>` を h1 直下に配置
- ✅ メタ情報行（Osaka / ykts.net / 2025〜）が表示されること → `inline-flex items-center gap-1` の 3 要素を配置
- ✅ ykts.net リンクが `target="_blank" rel="noopener noreferrer"` で開くこと → `<a href="https://ykts.net" target="_blank" rel="noopener noreferrer">` で実装
- ✅ `npm run typecheck` が通ること → 0 errors / 0 warnings

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で以下を確認する
  - **デスクトップ幅（640px以上）**: アバターが左、名前・肩書・bio・メタ情報が右に横並びになっていること
  - **モバイル幅（639px以下）**: 縦積み・中央揃えになっていること
  - 名前の下に "Builder · @yktsnet" がモノスペースフォント・ミュートカラーで表示されること
  - メタ情報行に map-pin アイコン＋"Osaka"、link アイコン＋"ykts.net"、calendar アイコン＋"2025〜" が横並びで表示されること
  - "ykts.net" をクリックすると新規タブで https://ykts.net が開くこと
