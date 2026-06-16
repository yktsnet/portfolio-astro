## 変更内容

Hero サイドバーの文字組み・余白・ナビ統合を整理した。

1. **「Builder」のみに変更** — 「· @yktsnet」を削除。`text-xs text-poi-accent mt-0.5` で名前直下に配置。
2. **bio の `<br>` を削除** — 自然折り返しに変更。`text-xs leading-relaxed` で可読性を確保。
3. **グループ間余白にリズムをつける** — photo→名前は `mt-3`、bio 前は `mt-4`、meta 前は `mt-4` で差をつけた。
4. **メタ情報の行間を `space-y-1` に詰める** — Osaka / ykts.net / GitHub / 2025〜 の縦間隔を縮小。
5. **Post・Contact を Hero メタリストに統合** — `RightNav.astro` から削除し、`index.astro` のメタ情報リスト末尾に追加。

## 静的確認結果

- **「Builder」のみ表示** — `· @yktsnet` の削除を確認 ✅
- **bio の `<br>` なし** — 自然折り返しに変更済み ✅
- **余白のリズム** — photo→名前 `mt-3`、bio `mt-4`、meta `mt-4` で差をつけた ✅
- **メタ行間** — `space-y-1` に変更済み ✅
- **Post・Contact が Hero 内に追加** — `/posts/` と `/contact/` へのリンクをメタリスト末尾に配置 ✅
- **RightNav から Post・Contact を削除** — `getLucideIcon` の import も合わせて削除 ✅

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で確認する
  - Hero 左・Works 右の 2 カラムが表示されること
  - 「Builder」のみが poi-accent カラーで表示されること
  - bio が自然に折り返すこと（途中で不自然に切れないこと）
  - Osaka / ykts.net / GitHub / 2025〜 / Post / Contact が縦に詰まって並ぶこと
  - 右上ナビに Post・Contact アイコンがないこと
  - モバイルで Hero が縦積みで表示されること
