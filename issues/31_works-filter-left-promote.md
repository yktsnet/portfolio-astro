## Works フィルタ：選択タグを左上へ昇格させる
id: 31
branch-slug: works-filter-left-promote
github_issue: 52
status: close
type: feat
対象: |
  src/pages/works.astro
内容: |
  Works のカテゴリフィルタ（#work-filter）で、選択したタグを「同一コンテナ内で左上へ昇格」させる。
  別枠へ飛ばさず CSS order の並べ替えだけで実現し、本文の上下スクロール位置がズレないようにする。
  あわせて「触り心地」を出すための押下バウンス・色コントラスト強化・✕アイコン（解除明示）を入れる。
  既存の AND 複数選択・件数バッジ・OSS/Demo タイプフィルタの挙動は変更しない。
確認: |
  npm run typecheck が通ること
  選択タグが左上へ寄り、未選択が後ろに続くこと（目視は user）
  選択数が変わっても本文位置がガクつかないこと（min-height 確保）

---

## 設計

### 方針

- **昇格は CSS `order` のみ**。DOM 順は据え置き（Tab フォーカス順・スクリーンリーダー読み上げを壊さない）。
- 選択済み = `order` を選択順に 0,1,2…／未選択 = `order` を 100 以上（必ず選択済みの後ろ）。
- 別 div へは移さない。コンテナを分けると高さが変わり本文が動くため。
- 行数増減による高さ変動は `min-height`（2行分）で先押さえ。
- モーションは最小。`order` 即時切替＋押下時の短いバウンスのみ。FLIP は入れない。

### 1. コンテナに最小高さを確保（高さ変動防止）

`#work-filter` に `min-h` を付与（現状2行想定。タグ8個・2行で収まっている）。

```diff
  <div
    id="work-filter"
-   class="mb-6 mt-8 flex flex-wrap gap-2 font-mono text-xs"
+   class="mb-6 mt-8 flex flex-wrap gap-2 font-mono text-xs min-h-[5.5rem] content-start"
    role="group"
    aria-label="タグで絞り込む"
  >
```

※ `content-start` で行が減ったときに上詰めを維持。`5.5rem` は2行分の目安。ビルド後 user が目視で微調整。

### 2. ボタンに ✕ アイコン領域と昇格時コントラストを追加

各 `.work-filter-btn` の末尾（件数バッジの後）に、選択時のみ出る ✕ を足す。
未選択の薄さを一段下げ、選択済みの塊が色で立つようにする。

```diff
        <span class="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 group-hover/btn:text-poi-accent group-aria-pressed/btn:text-poi-focus transition-colors duration-200 select-none">
          {count}
        </span>
+       {/* 選択時のみ表示する解除アイコン。未選択時は hidden */}
+       <svg
+         xmlns="http://www.w3.org/2000/svg"
+         width="11" height="11" viewBox="0 0 24 24"
+         fill="none" stroke="currentColor" stroke-width="1.5"
+         stroke-linecap="round" stroke-linejoin="round"
+         class="hidden group-aria-pressed/btn:inline-block text-poi-accent shrink-0 -mr-0.5"
+         aria-hidden="true"
+         set:html={getLucideIcon('x')}
+       />
      </button>
```

未選択を一段薄く（任意・コントラスト強化）。既存クラスの `text-zinc-500 dark:text-poi-muted` を据え置きでも成立するが、塊感を強めるなら未選択側のボーダー/背景をさらに淡くする。最小変更なら本項はスキップ可。

> 補足: `getLucideIcon('x')` は `src/lib/lucide.ts` に `x`（close アイコン）が無ければ追加が必要。
> CLAUDE.md の方針どおり npm package は使わず、同ファイルに 1 エントリ手動追加する。
> 既存に close 相当があればそれを流用してよい（実装前に lucide.ts を確認）。

### 3. スクリプト：order 付与とバウンス

既存 `apply()` の末尾、`buttons.forEach` で `aria-pressed` を書く箇所に `order` 設定を足す。
選択順を保持するため `Set` ではなく挿入順を持つ配列を併用する。

```ts
  const activeTags = new Set<string>();
  const selectionOrder: string[] = []; // 選択された順序を保持（左上昇格の並び）
  let activeType: string | null = null;

  function applyOrder() {
    buttons.forEach(b => {
      const tag = b.dataset.tag!;
      const sel = selectionOrder.indexOf(tag);
      // 選択済み: 選択順 0,1,2… / 未選択: 100 以上で必ず後ろ。未選択どうしは DOM 順維持
      b.style.order = sel >= 0 ? String(sel) : '100';
    });
  }
```

`apply()` の `buttons.forEach`（aria-pressed 更新）の直後に `applyOrder()` を呼ぶ。

クリックハンドラを、配列も同期するよう差し替える。

```ts
  filter?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.work-filter-btn');
    if (!btn) return;

    const tag = btn.dataset.tag!;
    if (activeTags.has(tag)) {
      activeTags.delete(tag);
      const i = selectionOrder.indexOf(tag);
      if (i >= 0) selectionOrder.splice(i, 1);
    } else {
      activeTags.add(tag);
      selectionOrder.push(tag);
      bounce(btn); // 選択確定時だけ弾ませる
    }
    apply();
  });
```

押下バウンスは既存カードの reflow パターンを流用（CSS アニメを付け直して再生）。

```ts
  function bounce(el: HTMLElement) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'filter-pop .18s ease-out';
  }
```

### 4. キーフレーム追加

末尾 `<style>` の `work-fade` の隣に追加。

```css
  @keyframes filter-pop {
    0%   { transform: scale(0.95); }
    60%  { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
```

### やらないこと（スコープ外）

- FLIP による移動アニメ（規模に対し過剰。order 即時切替で十分）。
- 選択済みを別コンテナ／別行へ分離（高さ変動の原因になる）。
- 件数バッジの動的更新（押す前に結果数を出す案）は別 Issue 余地として保留。
- OSS/Demo タイプフィルタ、カード側の挙動。

### 確認観点

- typecheck 通過。
- タグ選択で左上に寄り、解除で元の位置（DOM 順）へ戻る。
- 連続選択で選択順に左から並ぶ。
- 選択数 0→複数で `#work-filter` の高さが一定（下の本文が動かない）。
- `aria-pressed` / AND 絞り込み / 件数表示は従来どおり。
