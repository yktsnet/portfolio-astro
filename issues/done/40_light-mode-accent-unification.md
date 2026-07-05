## PR記録: fix: ライトモードのアクセント色をピンクに統一する
issue: 40 (40_light-mode-accent-unification.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/70
Merged: 4b002288e58a199d26388ac45c3ddb2d04b0f434

## 変更内容

ライトモードでアクセント色がピンク（light.accent #d0679d）とティール（poi.accent #5de4c7）で混在していた問題を、トークン側で解決。

- `src/styles/global.css`: `--color-accent` CSS変数を追加。`:root` でピンク(#d0679d)のRGB値、`.dark` でティール(#5de4c7)のRGB値を定義。
- `tailwind.config.mjs`: `poi.accent` を `"rgb(var(--color-accent) / <alpha-value>)"` に変更。`<alpha-value>` プレースホルダにより opacity modifier 付きクラス（`bg-poi-accent/[0.06]` 等）を維持。
- `src/components/Impact.astro`: ドット背景の hex 直書き `bg-[radial-gradient(#5de4c7_1px,transparent_1px)]` を `rgb(var(--color-accent))` を使う arbitrary value に置き換え。

これにより既存の素の `poi-accent` 系クラス（約70箇所）が自動的にライトでピンク・ダークでティールになる。既存の `text-light-accent dark:text-poi-accent` ペアは Issue の指示通り触っていない（両モードで従来どおりの色になるため実害なし）。

`poi.accent-hover`（#4ebca5）は grep で使用箇所を確認したところ、`tailwind.config.mjs` 内の定義のみで実クラスとしての使用箇所が無かったため、Issue の指示（装飾的用途のみなら現状維持でよい）に従い変更していない。

## 静的確認結果

- `npm run typecheck`: 0 errors（既存の warning のみ、本変更と無関係）
- `npm run build`: 成功
- ビルド後 CSS (`dist/_astro/about.*.css`) を確認:
  - `:root{--color-accent: 208 103 157}` / `.dark{--color-accent: 93 228 199}` が出力されている
  - `.bg-poi-accent\/5{background-color:rgb(var(--color-accent) / .05)}` など opacity modifier 付きクラスが alpha 値付きで正しく展開されている（`/[0.02]`, `/[0.04]`, `/[0.06]`, `/30`, `/50`, `/70`, `/80` すべて確認）
  - Impact.astro のドット背景が `radial-gradient(rgb(var(--color-accent)) 1px,transparent 1px)` として出力されている

```
$ git diff --name-only HEAD~1 HEAD
src/components/Impact.astro
src/styles/global.css
tailwind.config.mjs
```

### 補足（スコープ外の発見事項）

`src/components/InfrastructureBlueprint.astro` に Impact.astro と全く同じパターンの hex 直書き（`bg-[radial-gradient(#5de4c7_1px,transparent_1px)]`）が存在し、同様の問題を抱えている。本 Issue の対象・制約に含まれていないため今回は触っていないが、別 Issue化を検討されたい。

## 検証手順

- ライトモードで `/`・`/about/`・`/approach/`・`/impact/` を開き、ナビのアクティブ表示・"Builder"・フィルタピル・Approach の番号・Impact の「現在」フェーズがすべてピンク系で表示されること。
- ダークモードで同4ページがすべて従来どおりティールであること。
