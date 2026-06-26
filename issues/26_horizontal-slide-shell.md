## トップを横スライドUIに（デスクトップ）／モバイルは縦積み維持
id: 26
branch-slug: horizontal-slide-shell
github_issue: 40
status: close
type: feat
対象: |
  src/pages/index.astro（右カラムをスライド・ビューポート化、ナビ script 差し替え）
  src/components/About.astro（セクション区切りをレスポンシブ化）
  src/components/Approach.astro（同上）
  src/components/Impact.astro（同上）
内容: |
  縦長フリースクロールをやめ、デスクトップ（≥sm）では About / Approach / Impact /
  Works の4カテゴリを横スライドのパネルとして左右に切り替える。左ペインの4ラベルを
  選択器（クリックで該当スライドへ）にし、順送り用に左右矢印と ← → キーを追加する。
  hash と同期。Works パネルだけ内部縦スクロールを許容（横＝カテゴリ間、縦＝Works 内）。
  モバイル（<sm）は現状の縦積みスクロールを維持する。
  ※前提: Issue 25（コンテンツ刷新）が先にマージ済みであること。
確認: |
  npm run typecheck が通ること
  npm run build が通ること

---

## 方針（確定済み）

- ナビ: **左ペインの4ラベルを選択器**（上に別タブは置かない＝重複回避）。順送りは右下の左右矢印＋キーボード ← →。スクロール連動ハイライトは「アクティブなスライド」表示に転用。
- モバイル: スライドにしない。**現状の縦積みのまま**（横スワイプは情報量の多い Works で操作性が落ちるため）。
- Works: パネル内部だけ縦スクロール可。フィルタ（`#work-filter`）と4グループ（`#work-groups`）はそのまま内包。
- アニメーション: CSS `transform: translateX` のみ（JS アニメ・ライブラリ不要）。`prefers-reduced-motion` で transition 無効。

---

## 1. セクション区切りをレスポンシブ化（3コンポーネント）

各セクションの開始タグにある区切り `mb-28 pb-20 border-b border-zinc-200/50 dark:border-poi-border/60` は、**モバイル縦積みでは必要・デスクトップのスライドでは不要**。`sm:` で打ち消す。

About.astro / Approach.astro / Impact.astro の `<section …>` をそれぞれ次のように変更（クラス末尾に打ち消しを追加）:

```diff
- <section id="about" class="relative mb-28 pb-20 border-b border-zinc-200/50 dark:border-poi-border/60">
+ <section id="about" class="relative mb-28 pb-20 border-b border-zinc-200/50 dark:border-poi-border/60 sm:mb-0 sm:pb-0 sm:border-b-0">
```

approach / impact も同様（`id` だけ異なる）。`id="about"` 等の id は**残す**（モバイルのアンカー・初期 hash 判定に使う）。

---

## 2. index.astro — 右カラムをスライド・ビューポート化

現状の `<main class="flex-1 min-w-0 max-w-xl"> … </main>` を以下に置き換える。中身（About/Approach/Impact、Works 見出し・フィルタ・グループ）は**移動するだけで内容は変えない**。

```astro
    <!-- 右カラム: スライド・ビューポート（≥sm で横スライド / <sm は縦積み） -->
    <main class="flex-1 min-w-0">
      <div class="sm:h-[calc(100vh-8rem)] sm:overflow-hidden">
        <div
          id="slides-track"
          class="flex flex-col sm:flex-row sm:h-full sm:transition-transform sm:duration-300 sm:ease-out motion-reduce:sm:transition-none"
        >
          <!-- About -->
          <div class="slide w-full sm:shrink-0 sm:h-full sm:overflow-y-auto sm:pr-2" data-slide="about">
            <div class="max-w-xl"><About /></div>
          </div>
          <!-- Approach -->
          <div class="slide w-full sm:shrink-0 sm:h-full sm:overflow-y-auto sm:pr-2" data-slide="approach">
            <div class="max-w-xl"><Approach /></div>
          </div>
          <!-- Impact -->
          <div class="slide w-full sm:shrink-0 sm:h-full sm:overflow-y-auto sm:pr-2" data-slide="impact">
            <div class="max-w-xl"><Impact /></div>
          </div>
          <!-- Works -->
          <div class="slide w-full sm:shrink-0 sm:h-full sm:overflow-y-auto sm:pr-2" data-slide="works">
            <div class="max-w-xl">
              <div id="works" class="mb-8">
                <p class="mb-2 font-mono text-xs tracking-widest uppercase text-poi-accent">Works</p>
                <h2 class="text-lg sm:text-xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
                  IoTデバイス、レガシー刷新、自動売買。
                </h2>
                <p class="mt-2 text-sm leading-7 text-zinc-600 dark:text-poi-muted">
                  重なりのない三領域を、それぞれ違う制約の中で、設計から運用まで一人で通してきた。
                </p>
              </div>

              <!-- 領域フィルタ（既存のまま） -->
              <div id="work-filter" class="mb-8 flex flex-wrap gap-2 font-mono text-xs" role="group" aria-label="領域で絞り込む">
                {/* …既存の groups.map(...) ボタン群をそのまま… */}
              </div>

              <!-- Works グループ（既存のまま） -->
              <div id="work-groups">
                {/* …既存の groups.map(...) セクション群をそのまま… */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 順送りコントロール（デスクトップのみ） -->
      <nav class="mt-6 hidden sm:flex items-center gap-5 max-w-xl font-mono text-xs text-zinc-500 dark:text-poi-muted" aria-label="セクション送り">
        <button id="slide-prev" type="button" aria-label="前のセクション"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 dark:border-poi-border transition-colors hover:border-poi-accent hover:text-poi-accent disabled:opacity-30 disabled:hover:border-zinc-300 dark:disabled:hover:border-poi-border disabled:hover:text-inherit">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" set:html={getLucideIcon('arrow-right')} style="transform:scaleX(-1)" />
        </button>
        <span id="slide-progress" class="tabular-nums">1 / 4</span>
        <button id="slide-next" type="button" aria-label="次のセクション"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 dark:border-poi-border transition-colors hover:border-poi-accent hover:text-poi-accent disabled:opacity-30 disabled:hover:border-zinc-300 dark:disabled:hover:border-poi-border disabled:hover:text-inherit">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" set:html={getLucideIcon('arrow-right')} />
        </button>
      </nav>
    </main>
```

注:
- `getLucideIcon` は index.astro で既に import 済み。`arrow-right` を左右に流用（左は `scaleX(-1)`）。
- フィルタ／グループの中身（`groups.map(...)`）は**現状の JSX をそのまま移植**。`id="work-filter"` `id="work-groups"` は維持（Works フィルタ script が参照）。
- `max-w-xl` は各パネル内の `<div>` に付与（旧 `main` の `max-w-xl` 相当を維持）。

---

## 3. index.astro — script を差し替え

### 3-1. ナビ scroll-spy の script を削除
現状の「左ペインナビのスクロール連動アクティブ表示」（`IntersectionObserver` を使う2つ目の `<script>` ブロック）を**丸ごと削除**。スライド側の active 表示に置き換わるため。

### 3-2. Works フィルタ script・`work-fade` style は維持
1つ目の `<script>`（`#work-filter` のトグル）と末尾 `<style>`（`@keyframes work-fade`）はそのまま残す。

### 3-3. スライド制御 script を追加
新規 `<script>` を追加する:

```astro
<script>
  const mq = window.matchMedia('(min-width: 640px)');
  const track = document.getElementById('slides-track');
  const slides = ['about', 'approach', 'impact', 'works'];
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  const progress = document.getElementById('slide-progress');
  let index = 0;

  const clamp = (i: number) => Math.max(0, Math.min(slides.length - 1, i));

  function render() {
    if (track) {
      track.style.transform = mq.matches ? `translateX(-${index * 100}%)` : '';
    }
    for (const link of navLinks) {
      const on = mq.matches && link.dataset.section === slides[index];
      link.style.color = on ? '#5de4c7' : '';
    }
    if (progress) progress.textContent = `${index + 1} / ${slides.length}`;
    if (prevBtn) (prevBtn as HTMLButtonElement).disabled = index === 0;
    if (nextBtn) (nextBtn as HTMLButtonElement).disabled = index === slides.length - 1;
    history.replaceState(null, '', `#${slides[index]}`);
  }

  function go(i: number) {
    index = clamp(i);
    render();
  }

  for (const link of navLinks) {
    link.addEventListener('click', (e) => {
      if (!mq.matches) return; // モバイルはアンカーで通常スクロール
      const target = slides.indexOf(link.dataset.section!);
      if (target < 0) return;
      e.preventDefault();
      go(target);
    });
  }
  prevBtn?.addEventListener('click', () => go(index - 1));
  nextBtn?.addEventListener('click', () => go(index + 1));
  window.addEventListener('keydown', (e) => {
    if (!mq.matches) return;
    if (e.key === 'ArrowLeft') go(index - 1);
    if (e.key === 'ArrowRight') go(index + 1);
  });
  mq.addEventListener('change', render);

  const hash = location.hash.replace('#', '');
  if (slides.includes(hash)) index = slides.indexOf(hash);
  render();
</script>
```

---

## 挙動メモ・既知の割り切り

- デスクトップ: 左ペインの About/Approach/Impact/Works クリック → 該当スライドへ。← → キー・右下の矢印で順送り。両端で矢印は `disabled`。アクティブなラベルは緑（`#5de4c7`）。
- モバイル: 左ペイン（HeroDesktop）は `hidden sm:block` で非表示。`#slides-track` は `flex-col` で縦積み・transform なし＝現状どおりの縦スクロール。区切り線も `sm:` 打ち消し前のモバイル値が効く。
- hash: 初期ロード時に `#approach` 等があればそのスライドから開始。`history.replaceState` で URL を同期。
  - 既知の割り切り: セクション内 `id` が残るため、深いリンクで初回に微小なネイティブスクロールが起きうる。実害が出る場合は実装時に viewport へ `scroll-margin` 等で調整可。
- ビューポート高: `sm:h-[calc(100vh-8rem)]`。短いパネル（About 等）は下に余白が出るが、スライドとして許容。Works はパネル内部で縦スクロール。

## 検証手順（Code が PR に記載・user 実施）

- デスクトップ幅で左ペインのラベル／矢印／← →キーでスライドが切り替わること
- Works スライドでフィルタが従来どおり機能し、カードが多いとパネル内部で縦スクロールすること
- モバイル幅で縦積みスクロールに戻り、左右スライドにならないこと
- `prefers-reduced-motion` でスライドが瞬時切り替えになること
