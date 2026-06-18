## About 文面の再設計・Works 導入・左ペインタグライン
id: 18a
branch-slug: about-content-and-works-intro
github_issue:
status: open
type: feat
対象: |
  src/components/About.astro
  src/pages/index.astro
  src/components/HeroDesktop.astro
内容: |
  Issue 18 で About の階層は整ったが、文面が「何ができる人か」を伝えず独り言になっている。
  採用ターゲット（Givery AI Lab 型 / Forward Deployed Engineer）に向け、提供価値を前面に出す。
  併せて (a) 閉業・解散の事実をタイムラインに反映、(b) About と Works の間に導入を挟み
  「急に Hardware が出る」問題を解消、(c) PC 表示の左固定ペインに英語タグラインを追加する。
確認: |
  npm run typecheck

---

## 方針（決定事項）

- About の主目的: **提供価値を前面に**。経歴は裏付けに回す。
- リード文: **提供価値の一文**（何ができるか）。
- 締め文: **人間中心の設計思想**を言い切る（ロゴ＝渦／前に回る車輪 が体現する Human centric が源）。装飾は付けず、本文と地続きで「最後の一文」として置く。
- Works 導入: **Works ラベル＋1行リード＋各カテゴリに1行小見出し**。
- Others の小見出しは「実装ツール」ではなく「**3カテゴリに収まらない単発のプロジェクト**」の意。

---

## 変更詳細

### 1. `About.astro` — タイムラインの事実修正

合同会社は 2024 解散、学習塾は 2025 閉業済み。`timeline` を更新する。

```diff
  const timeline: LocationGroup[] = [
    {
      location: "Kyoto",
      items: [
        { year: "2013", label: "学習塾 開業" },
        { year: "2019", label: "合同会社設立" },
+       { year: "2024", label: "合同会社 解散" },
      ],
    },
    {
      location: "Osaka",
      items: [
-       { year: "2025〜", label: "SES 入社 / 個人開発・技術支援" },
+       { year: "2025〜", label: "学習塾 閉業 / SES 入社" },
+       { year: "", label: "個人開発・技術支援" },
      ],
    },
  ];
```

- 「個人開発・技術支援」は年なしの継続項目。year が空でもノード（●）と `w-10` の年カラムは保たれる。
- ノードなしで継続行を地続きに見せたい場合は、1 項目にまとめて `label` を `学習塾 閉業 / SES 入社・個人開発・技術支援` としてもよい（実装者判断）。

### 2. `About.astro` — 本文の全面書き換え

リード（提供価値）／本文2ブロック（裏付け）／締め（思想）の構成は維持し、文面を差し替える。

```diff
  <div class="space-y-5 text-zinc-600 dark:text-poi-muted">
-   <p class="text-base sm:text-lg leading-8 text-zinc-900 dark:text-poi-focus">
-     大学を出てすぐ塾を開業し、12年間経営した。
-   </p>
-
-   <p class="text-sm leading-8">
-     法人を立て、イベントスペースとプログラミング教育支援も手がけた。
-     経営者として現場に向き合ったことで、技術が導入される側の景色を知った。コスト感覚、現場の抵抗、使われなくなるまでの経緯。
-   </p>
-   <p class="text-sm leading-8">
-     2025年に IT へ転身。いまは SES で開発に携わりながら、個人開発と小さな組織への技術支援を並行している。
-     設計から運用まで一人で通すことが多い。
-   </p>
-
-   <p class="text-sm sm:text-base leading-8 text-zinc-800 dark:text-poi-text">
-     AI をワークフローに組み込むことに、今は一番時間を使っている。
-   </p>
+   <!-- リード: 提供価値の一文 -->
+   <p class="text-base sm:text-lg leading-8 text-zinc-900 dark:text-poi-focus">
+     曖昧なビジネス課題を、設計・実装・本番運用まで一人で形にする。
+   </p>
+
+   <!-- 本文: 経歴を裏付けに -->
+   <p class="text-sm leading-8">
+     学習塾を12年経営し、合同会社でイベントスペース運営やプログラミング教育支援も手がけた。
+     技術が導入される側の景色——コスト感覚、現場の抵抗、使われなくなるまでの経緯——を経営者として知っている。
+   </p>
+   <p class="text-sm leading-8">
+     2025年にエンジニアへ転身。いまは SES で開発に携わりながら、個人開発と小さな組織への技術支援を並行している。
+     ハードウェアから業務システム、自動売買まで、設計から運用まで一人で通すことが多い。
+   </p>
+
+   <!-- 締め: 人間中心の設計思想（装飾なし・本文より一段明るい色で浮かせる） -->
+   <p class="text-sm sm:text-base leading-8 text-zinc-800 dark:text-poi-text">
+     人間中心に設計する。システムも AI も、既存のワークフローに自然に溶け込ませる。
+   </p>
  </div>
```

- 締めはサイズ・装飾を増やさず、内容で1文浮かせる方針。`text-zinc-800 / dark:text-poi-text` の現状トーンを維持する。

### 3. `index.astro` — Works 導入（ラベル＋リード＋カテゴリ小見出し）

`categoryOrder` の下にカテゴリ別の小見出しマップを追加する。

```diff
  const categoryOrder = ["Hardware", "Modernization", "Trading", "Others"];
+
+ const categoryMeta: Record<string, string> = {
+   Hardware: "依存ゼロで動かすエッジ IoT",
+   Modernization: "レガシー解体と .NET 8 + React + AI エージェントへの段階移行",
+   Trading: "自動売買の設計・バックテスト・本番運用",
+   Others: "カテゴリに収まらない単発のプロジェクト",
+ };
```

About と Works グリッドの間にセクション導入を挿入する。

```diff
      <main class="flex-1 min-w-0 max-w-xl">
        <About />
+       <div class="mb-12">
+         <p class="font-mono text-xs text-poi-accent tracking-widest mb-3">Works</p>
+         <p class="text-sm leading-7 text-zinc-600 dark:text-poi-muted">
+           レガシーの作り直しから、IoT、LLM エージェント、自動売買まで。設計判断とともに。
+         </p>
+       </div>
        <div>
          {grouped.map(({ category, items }, i) => (
```

各カテゴリ見出しの直下に小見出しを追加する（`h2` の下マージンを詰めて小見出しに付け替え）。

```diff
              <h2
-               class="mb-6 font-mono text-2xl sm:text-3xl font-normal tracking-tight select-none opacity-60"
+               class="mb-2 font-mono text-2xl sm:text-3xl font-normal tracking-tight select-none opacity-60"
                style={`-webkit-text-stroke: 1px ${items[0].color}; color: transparent;`}
              >
                {category}
              </h2>
+             <p class="mb-6 text-sm text-zinc-500 dark:text-poi-muted">
+               {categoryMeta[category]}
+             </p>
```

- 小見出しは `categoryMeta` 未定義のカテゴリでは空 `<p>` になる。新カテゴリ追加時は `categoryMeta` にも追記する（フォールバックを入れるかは実装者判断）。

### 4. `HeroDesktop.astro` — 左固定ペインに英語タグライン

PC 表示のサイドバーのみ。`Builder` の下、リンク群の上に追加する。`HeroMobile.astro` には追加しない。

```diff
      <p class="text-sm text-poi-accent mt-1">
        Builder
      </p>
+     <p class="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-poi-muted">
+       Breaking down legacy systems and rebuilding them. IoT, infra automation, NixOS. Wiring AI agents into real work.
+     </p>
    </div>
```

---

## 非対象

- `HeroMobile.astro`（タグラインはPC表示のみ）
- About の `max-w-xl` 幅・`border-b` 区切り・タイムラインのノード実装（Issue 16a/18 で確定）
- Works カードの構造・`works.ts` のデータ
