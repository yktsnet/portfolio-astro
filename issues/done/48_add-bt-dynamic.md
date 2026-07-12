## PR記録: feat: bt-dynamic を Works に追加
issue: 48 (48_add-bt-dynamic.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/98
Merged: c92be11ec89637224d97e89dfe74152329370a32

## 変更内容
- src/data/works.ts の works 配列に bt-dynamic を追加（categoryTags: trading/pip、priority 2、color #addb67、publishedAt 2026.07）
- src/lib/lucide.ts に trending-up-down アイコンの SVG パスを追加（Lucide公式SVGから取得）

## 静的確認結果
- npm run typecheck: 0 errors, 0 warnings（既存の未関連warning/hintのみ）
- git diff --name-only --cached: src/data/works.ts, src/lib/lucide.ts（issue対象と完全一致）
- caller/import整合性: brand: "python" は src/lib/brand-icons.ts に登録済みを確認。icon: "trending-up-down" は getLucideIcon 経由で参照され、追加したエントリで解決されることを確認。pandas/PyPI はbrandなしlabelのみで既存のAzure等と同じ扱い。

## 検証手順
- npm run dev でトップページ Works セクションを開き、bt-dynamic カードが表示されアイコン・リンク（GitHub→, PyPI）が正しく描画されることを目視確認
