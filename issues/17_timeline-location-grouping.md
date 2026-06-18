## タイムライン @Location グループ化
id: 17
branch-slug: timeline-location-grouping
github_issue:
status: open
type: fix
対象: |
  src/components/About.astro
内容: |
  現状のタイムラインは year / label / at City をフラットに横並びする構造。
  場所を上位概念として @Location でグルーピングし、縦線でイベントをまとめる B案に変更する。
確認: |
  npm run typecheck

---

## 現状

```astro
const timeline = [
  { year: "2013", label: "学習塾 開業", location: "Kyoto" },
  { year: "2019", label: "合同会社設立", location: "Kyoto" },
  { year: "2025〜", label: "SES 入社 / 個人開発・技術支援", location: "Osaka" },
];
```

```astro
<div class="mt-8 space-y-2.5">
  {timeline.map(({ year, label, location }) => (
    <div class="flex items-baseline gap-5 text-sm">
      <span class="font-mono text-xs text-poi-accent w-12 shrink-0 tabular-nums">{year}</span>
      <span class="text-zinc-600 dark:text-poi-muted">{label}</span>
      <span class="font-mono text-xs text-poi-accent opacity-60">at {location}</span>
    </div>
  ))}
</div>
```

表示イメージ（現状）:
```
2013    学習塾 開業        at Kyoto
2019    合同会社設立       at Kyoto
2025〜  SES 入社 / 個人…  at Osaka
```

## 変更後

データ構造を location グループ配列に変更し、レンダリングも合わせて書き換える。

```diff
- const timeline = [
-   { year: "2013", label: "学習塾 開業", location: "Kyoto" },
-   { year: "2019", label: "合同会社設立", location: "Kyoto" },
-   { year: "2025〜", label: "SES 入社 / 個人開発・技術支援", location: "Osaka" },
- ];
+ type TimelineEntry = { year: string; label: string };
+ type LocationGroup = { location: string; items: TimelineEntry[] };
+
+ const timeline: LocationGroup[] = [
+   {
+     location: "Kyoto",
+     items: [
+       { year: "2013", label: "学習塾 開業" },
+       { year: "2019", label: "合同会社設立" },
+     ],
+   },
+   {
+     location: "Osaka",
+     items: [
+       { year: "2025〜", label: "SES 入社 / 個人開発・技術支援" },
+     ],
+   },
+ ];
```

```diff
- <div class="mt-8 space-y-2.5">
-   {timeline.map(({ year, label, location }) => (
-     <div class="flex items-baseline gap-5 text-sm">
-       <span class="font-mono text-xs text-poi-accent w-12 shrink-0 tabular-nums">{year}</span>
-       <span class="text-zinc-600 dark:text-poi-muted">{label}</span>
-       <span class="font-mono text-xs text-poi-accent opacity-60">at {location}</span>
-     </div>
-   ))}
- </div>
+ <div class="mt-8 space-y-6">
+   {timeline.map(({ location, items }) => (
+     <div>
+       <p class="font-mono text-xs text-poi-accent mb-2">@{location}</p>
+       <div class="border-l border-zinc-600 pl-4 space-y-2">
+         {items.map(({ year, label }) => (
+           <div class="flex items-baseline gap-5 text-sm">
+             <span class="font-mono text-xs text-zinc-500 w-10 shrink-0 tabular-nums">{year}</span>
+             <span class="text-zinc-600 dark:text-poi-muted">{label}</span>
+           </div>
+         ))}
+       </div>
+     </div>
+   ))}
+ </div>
```

表示イメージ（変更後）:
```
@Kyoto
│  2013   学習塾 開業
│  2019   合同会社設立

@Osaka
│  2025〜  SES 入社 / 個人開発・技術支援
```

- `border-zinc-600` は両モードで縦線が視認できる最低限の濃さ
- 拠点変更時は `timeline` 配列に location グループを追加するだけ
