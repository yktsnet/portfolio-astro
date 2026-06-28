## 変更内容

Issue #54 / Issue 32 の実装。

- **OSS/Demo タイプフィルタの手触り統一**：カテゴリタグと同じ `bounce()` ヘルパー（`filter-pop` キーフレーム）を流用し、選択確定時（ON になった瞬間のみ）バウンスアニメーションを付与。形状は四角（`rounded`）のまま、ピル化・✕アイコン・左上昇格はなし。
- **404 風空状態 (`#work-empty`)**：絞り込み結果が 0 件になったとき、ターミナル / Web 404 風のブロックを表示。等幅フォント・アクセントカラーで "404" を大きく表示し、`$ works --filter → 0 results` の一文を添える。
- **Clear filters ボタン**：`#work-empty` 内に配置。クリックで `activeTags`・`selectionOrder`・`activeType` をすべて初期化して `apply()` を再実行し、全件表示・空状態 hidden に戻す。
- `rotate-ccw` が lucide.ts に存在しないため、既存の `refresh-cw` アイコンで代替。

## 静的確認結果

- `npm run typecheck` → 0 errors, 0 warnings ✅
- `git diff --name-only HEAD~1` の出力: `src/pages/works.astro`（Issue の「対象」と完全一致）✅
- `bounce(btn)` の呼び出し箇所：type-filter-btn の `isChecked === false`（選択確定）ブランチのみ。解除時は呼ばない（カテゴリタグと同じ設計）✅
- `apply()` 末尾で `visibleIndex > 0` を判定して `empty.classList.toggle('hidden', ...)` を実行。0 件で表示、1 件以上で hidden ✅
- `resetAll()` は `activeTags.clear()`, `selectionOrder.length = 0`, `activeType = null` の後 `apply()` を呼ぶ。カテゴリタグ側の `aria-pressed` / `order` も `apply()` 内でリセットされる ✅

## 検証手順

- Works ページを開き、OSS または Demo ボタンを押す → バウンスし、選択コントラスト（背景・枠線）が付くことを目視確認。形は四角のまま。
- カテゴリタグ＋タイプで AND 絞り込みし 0 件になる組み合わせを試す → `#work-empty` の 404 ブロックが表示されることを確認。
- 「Clear filters」ボタンを押す → タグ・タイプがすべて解除され、全件表示・空状態 hidden に戻ることを確認。
- 1 件以上ヒット時は `#work-empty` が hidden のままであることを確認。
