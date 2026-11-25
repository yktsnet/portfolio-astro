## Photos ページの固定ヘッダー重なり・操作性・アクセシビリティ修正
id: 66
branch-slug: photos-layout-a11y
status: close
type: fix
対象: src/pages/photos/index.astro
目的: `/photos/` でスクロール中や目次ジャンプ時にセクション見出しが固定ヘッダーの下に隠れる表示崩れと、透明な「上へ戻る」ボタンの誤タップ、見出し階層・Lightbox のフォーカス管理の欠落を直す。
内容:
- 各セクション見出しの `sticky` 位置を固定ヘッダー（`#main-header`）の下に収まるよう調整する
- 各 `<section id={section.id}>` に `scroll-mt-32` を付け、目次からのジャンプ時に見出しがヘッダーに隠れないようにする
- `#to-top-btn` の初期クラスに `pointer-events-none` を付け、スクロール前に透明なクリック領域が残らないようにする
- ページに `<h1>`（`sr-only` または控えめな見出し）を置き、`h1 → h2` の見出し階層を整える
- Lightbox に明示的な閉じるボタンを追加し、開いたときにフォーカスを Lightbox 内へ移し、閉じたときに元の写真ボタンへ戻す
対象外: 写真データ（`src/data/photos.ts`）や画像最適化設定（`FULL_WIDTHS` / `PAIR_WIDTHS`）の変更。Lightbox の前後写真送り（矢印キーナビゲーション）の追加。
仮定:
- `<h1>` は既存のミニマルな見た目を崩さないよう `sr-only` で「Photos」を置く（視覚的なレイアウトは変えない）
- セクション見出しの `sticky` 位置は `SiteHeader` の高さ（`main-header` の `py-2` + `h-13` 相当、約 68px / sm 以上 76px）に合わせ、`top-[68px] sm:top-[76px]` 等の固定値またはスクリプト/CSS変数でヘッダー直下に隙間なく張り付くようにする
確認:
- `npm run typecheck` と `npm run test` と `CF_REMOTE_BINDINGS=false npm run build` が通る
- `/photos/` をスクロールしたとき、固定表示されるセクション見出し（`Croatia` 等）の上端が `#main-header` の下端以上（隠れない位置）にある
- `/photos/` の目次（`#photo-index`）からセクションへジャンプしたとき、対象セクションの見出しが `#main-header` の下に隠れない
- `/photos/` の初期表示（`scrollY === 0`）で `#to-top-btn` の計算済み `pointer-events` が `none` であり、300px 以上スクロールすると `auto` になる
- `/photos/` に `<h1>` が 1 つ存在する
- 写真クリックで Lightbox を開くとフォーカスが Lightbox 内の閉じるボタンへ移り、閉じるボタンまたは Escape で閉じると元の `.photo-btn` にフォーカスが戻る
人が見るもの: 実画面（デスクトップ・スマホ幅）での `/photos/` のスクロール時の見出しの張り付き具合と、Lightbox の閉じるボタンの見た目。

---

### 保証
保証: なし（`docs/guarantees/` の対象外であり、Photos ページの静的マークアップとブラウザ上の UI 挙動の修正のため）

### 詳細仕様

#### `src/pages/photos/index.astro`
- L59 付近: `<MainLayout>` 直下に `<h1 class="sr-only">Photos</h1>` を追加する。
- L77: `<section id={section.id} class="mb-20 scroll-mt-32">` とする（他ページのセクションと同じ `scroll-mt-32` に揃える）。
- L79: セクション見出しの `sticky top-0 z-10` を、固定ヘッダー（`#main-header`）の下端に揃う `top-*` に変更する。`SiteHeader` は `SiteHeader.astro` で `py-2 sm:py-3` と `.site-logo-icon`（`height: 3.25rem` = 52px）を持つため、実際の高さを確認のうえ隙間や重なりが出ない値を設定する（レスポンシブ幅で高さが変わる場合は `sm:` プレフィックスで合わせる）。
- L141–145: Lightbox に `<button type="button" id="lightbox-close" aria-label="Close photo viewer" ...>` を追加する。開く直前の `document.activeElement`（またはクリックされた `.photo-btn`）を保持し、開いた直後に `#lightbox-close` へ `.focus()`、閉じたときに保持した要素へ `.focus()` で戻す。Lightbox 内の画像クリックで閉じないか、背景/閉じるボタンクリックで閉じるかは、既存の「どこをクリックしても閉じる」挙動を壊さないようにする。
- L148: `#to-top-btn` のクラスに `pointer-events-none` を追加する（L217 のスクロールハンドラは既存のまま `show ? "auto" : "none"` で切り替える）。
