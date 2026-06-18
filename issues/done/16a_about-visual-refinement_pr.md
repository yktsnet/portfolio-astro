## 変更内容

Issue 16 実装後の視覚的な調整。参照サイト（Abhishek Ghimire portfolio）との比較から
テキスト幅・境界表現の視認性に課題があるため修正する。

- `index.astro`: 右ペインの `<main>` に `max-w-xl` を追加し、テキスト列が全幅に広がらないよう制限
- `About.astro`: `border-b` の opacity を下げ（`border-zinc-200/50`, `dark:border-poi-border/40`）、ダークモードでの主張を抑制

※ 変更詳細 3（タイムライン縦線 `border-l`）は現在のコードに該当箇所がないためスキップ

## 静的確認結果

- `npm run typecheck`: 0 errors, 0 warnings
- import・caller 整合性: Tailwind ユーティリティクラスの変更のみで、ロジックへの影響なし

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で以下を確認:
  - About セクション下部の `border-b` がライト・ダーク両モードで控えめに表示されること
  - Works カード列が `max-w-xl`（576px）で制限され、右に余白ができること
  - Works カードの横幅とのバランスが不自然でないこと（必要に応じ `max-w-2xl` へ変更を検討）
