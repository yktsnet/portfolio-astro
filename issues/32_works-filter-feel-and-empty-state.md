## Works フィルタ：OSS/Demo の手触り統一と 404 風 空状態
id: 32
branch-slug: works-filter-feel-and-empty-state
github_issue: 54
status: close
type: feat
対象: |
  src/pages/works.astro
内容: |
  Issue 31 でカテゴリタグに入れた「押下バウンス・選択コントラスト」を OSS/Demo タイプフィルタにも広げ、
  サイト内のフィルタUIの手触りを揃える。OSS/Demo は四角型のまま（ピル化しない）。形状差以外は同じ挙動。
  あわせて、絞り込み結果が 0 件のとき現状は空欄になるだけなので、
  ターミナル / Web の 404 を思わせる英語のポップな空状態を表示する。ワンタップで全解除するボタンを付ける。
確認: |
  npm run typecheck が通ること
  OSS/Demo 押下時にバウンスし、選択コントラストが付くこと（目視は user）
  結果 0 件で 404 風ブロックが出て、解除ボタンで全件へ戻ること（目視は user）

---

## 前提

Issue 31 実装済み（`bounce()` ヘルパー・`filter-pop` キーフレーム・`selectionOrder` 配列が `works.astro` に存在）。
本 Issue はそれらを流用する。実装前に現状の `works.astro` を読み、関数名・変数名を合わせること。

## 設計

### 1. OSS/Demo に手触りを統一（四角のまま）

`.type-filter-btn`（[works.astro](src/pages/works.astro) のタイプフィルタ）はカテゴリタグと違い:

- 形状は **四角（`rounded` のまま）**。`rounded-full` にはしない ← ここが唯一の意図的差分。
- 排他選択（OSS と Demo は同時に立たない、`aria-checked`）。✕アイコンや左上昇格は**入れない**（並び替え対象外・解除は再タップで足りる）。
- 統一するのは「押した時のバウンス」と「選択時のコントラスト」だけ。

クリックハンドラで、選択が ON になった瞬間だけ `bounce()` を呼ぶ。

```ts
  // 公開タイプボタン（排他選択）
  document.querySelectorAll<HTMLButtonElement>('.type-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type')!;
      const isChecked = btn.getAttribute('aria-checked') === 'true';

      if (isChecked) {
        activeType = null;
      } else {
        activeType = type;
        bounce(btn); // 選択確定時のみ弾ませる（31 のヘルパーを流用）
      }
      apply();
    });
  });
```

選択コントラストは既存 `aria-checked:` バリアントで既に付いている。塊感が弱ければカテゴリタグと同程度まで `aria-checked` 時の背景/枠線を強める（最小変更ならクラス据え置きで可）。

### 2. 404 風の空状態（英語・ポップ）

#### 表示要素（`#work-list` の直後に sibling として常設・既定 hidden）

ターミナル / Web 404 のノリ。等幅・アクセントカラー。文言は英語。

```html
  <!-- 結果 0 件のときだけ表示する 404 風ブロック。既定は hidden -->
  <div
    id="work-empty"
    class="hidden mt-2 rounded-xl border border-dashed border-zinc-300/80 dark:border-poi-border/60 bg-white/40 dark:bg-white/[0.02] px-6 py-10 text-center"
    role="status"
    aria-live="polite"
  >
    <p class="font-mono text-5xl font-semibold tracking-tight text-poi-accent/80 select-none">404</p>
    <p class="mt-3 font-mono text-sm text-zinc-700 dark:text-poi-focus">No works matched this filter.</p>
    <p class="mt-1.5 font-mono text-xs text-zinc-400 dark:text-poi-muted select-none">
      <span class="text-poi-accent">$</span> works --filter &rarr; 0 results
    </p>
    <button
      type="button"
      id="work-empty-reset"
      class="mt-6 inline-flex items-center gap-1.5 rounded border border-zinc-200 dark:border-poi-border/50 bg-white/40 dark:bg-white/[0.01] px-3.5 py-1.5 font-mono text-xs text-zinc-500 dark:text-poi-muted hover:text-poi-accent dark:hover:text-poi-accent hover:border-zinc-400 dark:hover:border-poi-border active:scale-95 transition-all duration-200 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-poi-accent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"
        class="shrink-0"
        aria-hidden="true"
        set:html={getLucideIcon('rotate-ccw')}
      />
      Clear filters
    </button>
  </div>
```

> `getLucideIcon('rotate-ccw')` が `src/lib/lucide.ts` に無ければ 1 エントリ手動追加（npm package は使わない）。
> 既存に reset / refresh 系（`refresh-cw` 等）があればそれで代替可。

#### トグル：`apply()` で 0 件判定

`apply()` 内の `visibleIndex`（マッチ件数）を使う。ループ後に空状態の表示/非表示を切り替える。

```ts
  function apply() {
    let visibleIndex = 0;
    cards.forEach(card => {
      // …既存の判定…（変更なし）
    });

    // 0 件なら 404 風ブロックを出す
    const empty = document.getElementById('work-empty');
    if (empty) empty.classList.toggle('hidden', visibleIndex > 0);

    // …既存の aria 更新・applyOrder()…
  }
```

#### 解除ボタン：全フィルタを初期化

タグ・選択順・タイプをすべてクリアして `apply()`。31 の `activeTags` / `selectionOrder` / `activeType` を空に戻す。

```ts
  function resetAll() {
    activeTags.clear();
    selectionOrder.length = 0;
    activeType = null;
    apply();
  }

  document.getElementById('work-empty-reset')?.addEventListener('click', resetAll);
```

### やらないこと（スコープ外）

- OSS/Demo へのピル化・✕アイコン・左上昇格（形状と挙動は現状維持、手触りだけ統一）。
- 空状態のアニメーション演出（タイプライター等）。まずは静的でよい。
- カテゴリタグ側の挙動（31 で完了済み、本 Issue では触らない）。

### 確認観点

- typecheck 通過。
- OSS/Demo 押下でバウンス、選択コントラストが付く。形は四角のまま。
- タグ＋タイプの AND 絞り込みで 0 件になると `#work-empty` が表示される。
- 「Clear filters」でタグ・タイプ・選択順がすべて解除され、全件＋空状態 hidden に戻る。
- 1 件以上ヒット時は `#work-empty` が hidden のまま。
