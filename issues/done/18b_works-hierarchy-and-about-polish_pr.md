## 変更内容

右カラムの見出し階層を再設計し、Works を唯一の大型アウトライン見出しに昇格、カテゴリ（Hardware / Modernization / Trading / Others）を小型の色付き mono ラベルへ降格。併せて以下を実施:

- **タイムライン年次修正**: `2025〜 学習塾 閉業 / SES 入社` → `2025 学習塾 閉業 / 個人開発` と `2026〜 SES 入社 / 技術支援` に分離
- **締め文サイズ縮小**: `sm:text-base` を除去し本文と同じ `text-sm` に統一。色（`poi-text`）のみで最後の一文として浮かせる
- **ロゴ watermark**: About セクション右下に `Logo.astro` を低不透明度（7%/10%）で配置

## 静的確認結果

- `npm run typecheck`: 0 errors, 0 warnings（12 hints は既存）
- import 確認: `About.astro` で `Logo.astro` を `../layouts/Logo.astro` から import。`Logo.astro` は `size`（number）と `class`（string）を受け取る既存コンポーネントで、渡している props は型に適合
- `index.astro` の変更: カテゴリ見出しを `<h2>` から `<p>` に変更、Works 導入を `<p>` から `<h2>` に昇格。`categoryMeta`・`grouped` のデータフローに変更なし

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で以下を確認:
  - Works セクション冒頭に大型アウトライン（`-webkit-text-stroke` による透明文字）の「Works」見出しが表示される
  - カテゴリ名（Hardware 等）が小型の色付き mono ラベルに変わり、カテゴリ間の `border-t` 区切り線がなくなっている
  - About セクション右下にロゴ watermark が薄く表示される（テキストと重ならない）
  - タイムラインの Osaka セクションが「2025 学習塾 閉業 / 個人開発」「2026〜 SES 入社 / 技術支援」の2行になっている
  - 締め文「人間中心に設計する〜」がモバイル・デスクトップ共に同じサイズ（`text-sm`）で表示される
  - ダークモードでロゴ watermark の不透明度がライトモード（7%）より若干高く（10%）なっている
