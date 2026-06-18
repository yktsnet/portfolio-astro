## 変更内容

Issue 18 で About の階層は整ったが、文面が「何ができる人か」を伝えず独り言になっている。
採用ターゲット（Givery AI Lab 型 / Forward Deployed Engineer）に向け、提供価値を前面に出す。

- **About.astro タイムライン事実修正**: 合同会社 2024 解散、学習塾 2025 閉業を反映。「個人開発・技術支援」を年なし継続項目として追加
- **About.astro 本文全面書き換え**: リード文を提供価値（「曖昧なビジネス課題を〜一人で形にする」）に、締め文を人間中心の設計思想に差し替え
- **index.astro Works 導入セクション**: About と Works グリッドの間に Works ラベル＋リード1行を挿入。各カテゴリ見出しの下に `categoryMeta` による1行小見出しを追加
- **HeroDesktop.astro タグライン**: PC 表示の左固定ペインに英語タグラインを追加（モバイルには追加しない）

## 静的確認結果

- `npm run typecheck`: 0 errors, 0 warnings（12 hints は既存）
- import・caller 整合性: `About.astro` は `index.astro` から `<About />` として呼ばれるのみ。`HeroDesktop.astro` も同様。`categoryMeta` は `index.astro` 内で定義・参照が閉じている。問題なし

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で以下を確認
  - About セクション: リード文が「曖昧なビジネス課題を〜」に変わっていること
  - About セクション: 締め文が「人間中心に設計する。〜」に変わっていること
  - タイムライン: Kyoto に「2024 合同会社 解散」が追加されていること
  - タイムライン: Osaka が「2025〜 学習塾 閉業 / SES 入社」＋「個人開発・技術支援」の2行になっていること
  - About と Works の間に「Works」ラベルとリード文が表示されること
  - 各カテゴリ見出し（Hardware, Modernization, Trading, Others）の下に小見出しが表示されること
  - PC 表示の左固定ペインに英語タグラインが表示されること
  - モバイル表示ではタグラインが表示されないこと
