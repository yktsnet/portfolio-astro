## 変更内容

Works のカテゴリフィルタ（#work-filter）で、選択したタグを「同一コンテナ内で左上へ昇格」させる。
別枠へ飛ばさず CSS order の並べ替えだけで実現し、本文の上下スクロール位置がズレないようにする。
あわせて「触り心地」を出すための押下バウンス・✕アイコン（解除明示）を入れる。
既存の AND 複数選択・件数バッジ・OSS/Demo タイプフィルタの挙動は変更しない。

### 実装詳細

1. **コンテナ最小高さ確保（`src/pages/works.astro`）**
   - `#work-filter` に `min-h-[5.5rem] content-start` を追加
   - 選択数が変わっても高さが一定に保たれ、下のコンテンツが動かない

2. **✕ アイコン追加（`src/pages/works.astro`）**
   - 各フィルタボタンの末尾に `group-aria-pressed/btn:inline-block` 制御の SVG ✕ を追加
   - 未選択時は `hidden`、選択時のみ表示

3. **order による昇格（`src/pages/works.astro`）**
   - `selectionOrder: string[]` 配列で選択順を管理
   - `applyOrder()` 関数で選択済みに `order: 0,1,2...`、未選択に `order: 100` を付与
   - DOM 順は変えないため Tab フォーカス順・スクリーンリーダーに影響なし

4. **バウンスアニメーション（`src/pages/works.astro`）**
   - `bounce()` 関数で選択確定時のみ `filter-pop` キーフレームを再生
   - `@keyframes filter-pop`: scale 0.95 → 1.03 → 1 の 180ms アニメ

5. **x アイコン追加（`src/lib/lucide.ts`）**
   - Issue 設計に「`x` が無ければ追加が必要」と明記されており、不在のため追加

## 静的確認結果

`npm run typecheck` 実行結果: **0 errors, 0 warnings, 12 hints（既存の hints のみ）**

`git diff --name-only HEAD~1` の出力:
```
src/lib/lucide.ts
src/pages/works.astro
```

- `getLucideIcon('x')` の呼び出し → `lucide.ts` に `x` エントリあり ✅
- `selectionOrder` / `applyOrder` / `bounce` の型 → TypeScript strict mode で問題なし ✅
- `group-aria-pressed/btn:inline-block` クラス → 既存の `aria-pressed` ハンドラで `setAttribute` 済み ✅
- OSS/Demo タイプフィルタのイベントリスナー → 変更なし ✅

## 検証手順

- `/works` ページを開き、タグボタンをクリックして左上に移動することを確認
- 複数タグを選択し、選択順に左から並ぶことを確認
- タグを選択/解除しても下のカード一覧の位置がズレないことを確認
- 選択ボタンに ✕ アイコンが表示され、再クリックで解除できることを確認
