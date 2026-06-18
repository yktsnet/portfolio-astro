## About セクション 視覚調整
id: 16a
branch-slug: about-visual-refinement
github_issue:
status: open
type: fix
対象: |
  src/components/About.astro
  src/pages/index.astro
内容: |
  Issue 16 実装後の視覚的な調整。参照サイト（Abhishek Ghimire portfolio）との比較から
  テキスト幅・境界表現・タイムライン縦線の視認性に課題があるため修正する。
確認: |
  npm run typecheck

---

## 背景

参照サイト（黒メインのエディトリアル構成）との比較で以下の差分を確認した。
Issue 16 を実装した状態で本 Issue に着手する。

---

## 変更詳細

### 1. `index.astro` — 右ペインのテキスト幅制限

参照サイトはテキスト列が全幅に広がっておらず、右に余白がある。
現状は `flex-1 min-w-0` で横いっぱいに伸びるため、文章が詰まった印象になる。

```diff
- <main class="flex-1 min-w-0 pt-10 sm:pt-16">
+ <main class="flex-1 min-w-0 pt-10 sm:pt-16 max-w-xl">
```

`max-w-xl`（= 36rem = 576px）を基準に、実際の表示で調整する。
Works カードの横幅とのバランスを見て `max-w-2xl` まで広げることも許容する。

### 2. `About.astro` — `border-b` の調整

`border-b` はダークモードで主張が強くなる可能性がある。
参照サイトは余白だけで区切っているため、まず opacity を下げて様子を見る。

```diff
- <section class="mb-24 pb-16 border-b border-zinc-200 dark:border-poi-border">
+ <section class="mb-24 pb-16 border-b border-zinc-200/50 dark:border-poi-border/40">
```

余白だけで十分に区切れている場合は `border-b` ごと削除してよい（実装者判断）。

### 3. `About.astro` — タイムライン縦線の視認性

B案の `border-l border-zinc-800` はダークモードでほぼ不可視になる。
参照サイトの左線は「確かに存在する」程度に見えている。

```diff
- <div class="border-l border-zinc-800 dark:border-zinc-700 pl-4 space-y-2">
+ <div class="border-l border-zinc-600 dark:border-zinc-600 pl-4 space-y-2">
```

`border-zinc-600` は両モードで一定の視認性を保ちながら主張しすぎない。
強すぎると感じた場合は `border-zinc-700` に戻す。
