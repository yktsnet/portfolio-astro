## About セクション追加とカテゴリ余白改善
id: 16
branch-slug: about-section
github_issue:
status: close
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

タイムラインは @Location グループ構造。location ごとにアクセントカラーの左縦線でイベントをまとめる。

```astro
---
type TimelineEntry = { year: string; label: string };
type LocationGroup = { location: string; items: TimelineEntry[] };

const timeline: LocationGroup[] = [
  {
    location: "Kyoto",
    items: [
      { year: "2013", label: "学習塾 開業" },
      { year: "2019", label: "合同会社設立" },
    ],
  },
  {
    location: "Osaka",
    items: [
      { year: "2025〜", label: "SES 入社 / 個人開発・技術支援" },
    ],
  },
];
---

<section class="mb-24 pb-16 border-b border-zinc-200 dark:border-poi-border">
  <p class="font-mono text-xs text-poi-accent opacity-60 mb-6 tracking-widest">About</p>

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

  <div class="mt-10 space-y-6">
    {timeline.map(({ location, items }) => (
      <div>
        <p class="font-mono text-xs text-poi-accent mb-2">@{location}</p>
        <div class="border-l border-zinc-800 dark:border-zinc-700 pl-4 space-y-2">
          {items.map(({ year, label }) => (
            <div class="flex items-baseline gap-5 text-sm">
              <span class="font-mono text-xs text-zinc-500 w-10 shrink-0 tabular-nums">{year}</span>
              <span class="text-zinc-600 dark:text-poi-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>
```

**タイムラインの表示イメージ**

```
@Kyoto
│  2013   学習塾 開業
│  2019   合同会社設立

@Osaka
│  2025〜  SES 入社 / 個人開発・技術支援
```

- `@Location` は `text-poi-accent font-mono text-xs`
- 縦線（`border-l border-zinc-800`）がイベントをグルーピング
- 拠点変更時は `timeline` 配列に location グループを追加するだけ

### 4. `index.astro` — 上部余白追加・About 挿入・カテゴリタイトル縮小

**import 追加**

```diff
+ import About from '../components/About.astro';
```

**右ペイン上部に余白を追加し、About を挿入**

```diff
- <main class="flex-1 min-w-0">
+ <main class="flex-1 min-w-0 pt-10 sm:pt-16">
+   <About />
    <div>
      {grouped.map(({ category, items }, i) => (
```

`pt-10 sm:pt-16` でテキストが画面端から始まらないようにする（参照サイトと同様の開始位置）。

**カテゴリタイトルのサイズ縮小**

```diff
  <h2
-   class="mb-8 font-mono text-4xl sm:text-5xl font-normal tracking-tight select-none opacity-60"
+   class="mb-6 font-mono text-2xl sm:text-3xl font-normal tracking-tight select-none opacity-60"
    style={`-webkit-text-stroke: 1px ${items[0].color}; color: transparent;`}
  >
```
