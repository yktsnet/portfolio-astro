## 変更内容

縦長フリースクロールをやめ、デスクトップ（≥sm）では About / Approach / Impact / Works の4カテゴリを横スライドのパネルとして左右に切り替えるUIに変更。

- **左ペインの4ラベルを選択器に**: クリックで該当スライドへ移動（`data-nav-link` を参照）
- **順送りコントロール**: 右下に左右矢印ボタンを追加。両端で `disabled`
- **キーボード対応**: ← → キーでスライド移動
- **URL ハッシュ同期**: `history.replaceState` で現在スライドを URL に反映。初期ロード時にハッシュがあればそのスライドから開始
- **アニメーション**: CSS `transform: translateX` のみ。`prefers-reduced-motion` で `transition-none`
- **Works パネル**: パネル内部だけ縦スクロール可。フィルタ・グループはそのまま内包
- **モバイル（<sm）**: 従来の縦積みスクロールを維持。スライドにしない

### ファイル別変更

| ファイル | 変更内容 |
|---|---|
| `src/components/About.astro` | `<section>` に `sm:mb-0 sm:pb-0 sm:border-b-0` を追加（デスクトップで区切り線を非表示） |
| `src/components/Approach.astro` | 同上 |
| `src/components/Impact.astro` | 同上 |
| `src/pages/index.astro` | 右カラムをスライドビューポート化、scroll-spy script を slide 制御 script に差し替え |

## 静的確認結果

`npm run typecheck` → **0 errors, 0 warnings, 12 hints**（既存のヒントのみ、今回の変更由来なし）

変更ファイル確認（`git diff --name-only HEAD~1`）:
```
src/components/About.astro
src/components/Approach.astro
src/components/Impact.astro
src/pages/index.astro
```

Issue の「対象」フィールドと完全一致を確認済み。

import・caller 整合性:
- `getLucideIcon('arrow-right')` は `index.astro` で既存 import 済み ✓
- `About` / `Approach` / `Impact` コンポーネントは既存 import 済み ✓
- `[data-nav-link]` セレクタは `HeroDesktop.astro` の左ペインリンクを参照（既存属性） ✓
- `#work-filter` / `#work-groups` の id は維持（Works フィルタ script が参照） ✓
- scroll-spy `<script>` を削除し、slide 制御 `<script>` に置き換え済み ✓

## 検証手順

- デスクトップ幅で左ペインのラベル（About / Approach / Impact / Works）をクリックして該当スライドに切り替わること
- 右下の ← / → 矢印でスライドが順送りされ、両端で矢印が `disabled` になること
- ← → キーボードでスライド移動できること
- URL の hash がスライドに合わせて更新されること（`#about`, `#approach`, `#impact`, `#works`）
- Works スライドでフィルタが従来どおり機能し、カードが多いとパネル内部で縦スクロールすること
- モバイル幅（< 640px）で縦積みスクロールに戻り、横スライドにならないこと
- `prefers-reduced-motion` 有効時にスライドが瞬時切り替え（transition なし）になること
