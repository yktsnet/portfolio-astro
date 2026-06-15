## Roadmap 削除・スタック解体・ナビアイコン化
id: 01
branch-slug: cleanup-bundle
github_issue:
status: open
type: cleanup
対象: |
  src/pages/index.astro
  src/data/roadmap.ts  (削除)
  src/data/works.ts
  src/site.config.ts
  src/components/RightNav.astro
内容: |
  以下を順番に実施する。
  1. Roadmap セクション削除
  2. 技術スタック表示を解体し、Works カードにタグとして移す
  3. Posts・Contact をナビから右上アイコンへ移動
確認: |
  - index.astro に roadmapItems の import・参照が残っていないこと
  - index.astro に stackGroups・stackGroupsResolved の定義・参照が残っていないこと
  - getBrandIcon の import が削除されていること（lucide は引き続き使用）
  - menuLinks に Posts・Contact が残っていないこと
  - npm run typecheck が通ること

---

## 1. Roadmap 削除

- `src/data/roadmap.ts` を削除
- `index.astro` から以下を削除:
  - `import { roadmapItems } from '../data/roadmap';`
  - `<!-- ===== Roadmap ===== -->` セクション全体（`<section class="mb-14">` 〜 `</section>`）

## 2. 技術スタック解体・Works タグ化

### works.ts
- `Work` 型に `stack?: string[]` を追加
- 各 work エントリに stack を設定（最大 4 件）:
  - NFC Attendance System: `["Raspberry Pi", "Python", "GAS", "PostgreSQL"]`
  - Cat Feed Tracker: `["Pico W", "FastAPI", "PostgreSQL", "LINE API"]`
  - Trading Lab: `["React", "Hono", "Cloudflare", "Python"]`

### index.astro
- `import { getBrandIcon } from '../lib/brand-icons';` を削除
- `type StackRow` / `type StackGroup` / `stackGroups` / `stackGroupsResolved` の定義ブロックを削除
- `<!-- ===== Description + Stack ===== -->` セクションの Stack groups `<div class="mt-5 space-y-1.5">` ブロックを削除
- Works カードのリンク列（`<div class="mt-2 flex flex-wrap gap-x-4 ...">` ）の上に stack タグ列を追加:

```astro
{work.stack && work.stack.length > 0 && (
  <div class="mt-1.5 flex flex-wrap gap-1">
    {work.stack.map((s) => (
      <span class="inline-flex items-center rounded-full border border-zinc-200 dark:border-poi-border px-2 py-0.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
        {s}
      </span>
    ))}
  </div>
)}
```

## 3. Posts・Contact をナビから右上アイコンへ

### site.config.ts
`menuLinks` から Posts・Contact を削除（Works のみ残す）:
```ts
export const menuLinks: { path: string; title: string }[] = [
  { path: "/works/", title: "Works" },
];
```

### RightNav.astro
既存アイコン列の先頭（Zenn の前）に Posts・Contact を追加:

```astro
<a
  href="/posts/"
  aria-label="Posts"
  class="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-poi-text dark:hover:bg-poi-panel"
>
  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
</a>
<a
  href="/contact/"
  aria-label="Contact"
  class="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-poi-text dark:hover:bg-poi-panel"
>
  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
</a>
```
