## About セクション追加とカテゴリ余白改善
id: 16
branch-slug: about-section
github_issue:
status: open
type: feat
対象: |
  src/components/HeroDesktop.astro
  src/components/HeroMobile.astro
  src/components/About.astro （新規）
  src/pages/index.astro
内容: |
  自己紹介・経歴が伝わらないため、Works の上部に About セクションを新設する。
  左サイドバーの日本語テキストは About に統合して削除する。
  カテゴリタイトルのサイズを縮小し、余白で章の区切りを表現するエディトリアルな構成にする。
確認: |
  npm run typecheck

---

## 変更詳細

### 1. `HeroDesktop.astro` — 日本語テキスト削除

```diff
- <p class="border-t border-zinc-200 dark:border-zinc-700 mt-5 pt-5 text-sm leading-relaxed text-zinc-600 dark:text-poi-muted">
-   レガシーをバラして作り直すのが好き。IoT・インフラ自動化・NixOS。AIエージェントを実務に組み込む実験を続けている。
- </p>
```

### 2. `HeroMobile.astro` — 日本語テキスト削除

```diff
- <p class="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-poi-muted">
-   レガシーをバラして作り直すのが好き。<br class="sm:hidden" />IoT・インフラ自動化・NixOS。AIエージェントを実務に組み込む実験を続けている。
- </p>
```

### 3. `About.astro` — 新規作成

```astro
---
const timeline = [
  { year: "2013", label: "学習塾 開業", location: "Kyoto" },
  { year: "2019", label: "合同会社設立", location: "Kyoto" },
  { year: "2025〜", label: "SES 入社 / 個人開発・技術支援", location: "Osaka" },
];
---

<section class="mb-20 pb-16 border-b border-zinc-200 dark:border-poi-border">
  <div class="space-y-3 text-sm leading-7 text-zinc-600 dark:text-poi-muted">
    <p>
      大学を出てすぐ塾を開業し、12年間経営した。法人を立て、イベントスペースとプログラミング教育支援も手がけた。
      経営者として現場に向き合ったことで、技術が導入される側の景色を知った。コスト感覚、現場の抵抗、使われなくなるまでの経緯。
    </p>
    <p>
      2025年に IT へ転身。いまは SES で開発に携わりながら、個人開発と小さな組織への技術支援を並行している。
      設計から運用まで一人で通すことが多い。AI をワークフローに組み込むことに、今は一番時間を使っている。
    </p>
  </div>

  <div class="mt-8 space-y-2.5">
    {timeline.map(({ year, label, location }) => (
      <div class="flex items-baseline gap-5 text-sm">
        <span class="font-mono text-xs text-poi-accent w-12 shrink-0 tabular-nums">{year}</span>
        <span class="text-zinc-600 dark:text-poi-muted">{label}</span>
        <span class="font-mono text-xs text-poi-accent opacity-60">at {location}</span>
      </div>
    ))}
  </div>
</section>
```

**タイムラインの表示イメージ**

```
2013    学習塾 開業                        at Kyoto
2019    合同会社設立                        at Kyoto
2025〜  SES 入社 / 個人開発・技術支援       at Osaka
```

- 年・`at City` を同じ `text-poi-accent` で統一。`at City` は `opacity-60` で少し抑える
- `location` フィールドを分離しているため、拠点変更時は data だけ更新すればよい

### 4. `index.astro` — About 挿入とカテゴリタイトル縮小

**About の挿入**

```diff
+ import About from '../components/About.astro';
```

```diff
  <main class="flex-1 min-w-0">
+   <About />
    <div>
      {grouped.map(({ category, items }, i) => (
```

**カテゴリタイトルのサイズ縮小**

```diff
  <h2
-   class="mb-8 font-mono text-4xl sm:text-5xl font-normal tracking-tight select-none opacity-60"
+   class="mb-6 font-mono text-2xl sm:text-3xl font-normal tracking-tight select-none opacity-60"
    style={`-webkit-text-stroke: 1px ${items[0].color}; color: transparent;`}
  >
```
