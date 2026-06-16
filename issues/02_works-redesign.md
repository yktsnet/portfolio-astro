## Works セクション再設計（Antfu スタイル）
id: 02
branch-slug: works-redesign
github_issue:
status: open
type: feat
対象: |
  src/pages/index.astro
  src/data/works.ts
  src/pages/works/index.astro  (削除)
内容: |
  Works セクションを Antfu スタイルに再設計する。
  カード枠・背景色を撤廃し、カテゴリを大きなウォーターマーク見出しとした
  3列グリッドのフラットなリスト形式に変える。
  /works/ ページは廃止済み（_redirects で / へリダイレクト済み）のため削除する。
確認: |
  - カード枠・背景色が消えていること
  - カテゴリ見出しが英語の大文字ウォーターマークテキストで表示されること
  - Works が 3列グリッドでカテゴリ別にグループ表示されること
  - brand icon がスタックタグに表示されること
  - works/index.astro が削除されていること
  - npm run typecheck が通ること

---

## 1. works.ts に category フィールドを追加

`Work` 型に `category: string` を追加:
```ts
export type Work = {
  category: string;  // 追加（英語、セクション見出しに使用）
  // ...既存フィールド
};
```

各 work エントリに category を設定:
- NFC Attendance System: `"Automation"`
- Cat Feed Tracker: `"Hardware"`
- Trading Lab: `"Platform"`

`tag` フィールドは削除する（category に統合）。
`getPostVisualMeta` など tag を参照している箇所がないことを確認すること。

---

## 2. index.astro を Antfu スタイルに書き換え

### データ準備
works を category でグループ化:
```ts
import { getBrandIcon } from '../lib/brand-icons';

const worksResolved = works.map(work => ({
  ...work,
  iconPath: getLucideIcon(work.icon),
  stackResolved: (work.stack ?? []).map(s => ({
    ...s,
    brandIcon: s.brand ? getBrandIcon(s.brand) : null,
  })),
}));

// カテゴリ順を固定
const categoryOrder = ["Automation", "Hardware", "Platform"];

const grouped = categoryOrder
  .map(cat => ({
    category: cat,
    items: worksResolved.filter(w => w.category === cat),
  }))
  .filter(g => g.items.length > 0);
```

### Works セクションのマークアップ
カード枠・背景なし。カテゴリは超大テキスト（opacity 低め）、アイテムは3列グリッド:

```astro
<section class="mb-16">
  <div class="space-y-16">
    {grouped.map(({ category, items }) => (
      <div>
        <!-- ウォーターマーク見出し -->
        <h2 class="mb-6 font-mono text-5xl font-bold tracking-tight text-zinc-900/10 dark:text-white/10 select-none">
          {category}
        </h2>

        <!-- 3列グリッド -->
        <div class="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((work) => (
            <div class="flex gap-3">
              <!-- アイコン -->
              <div class="mt-0.5 shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-zinc-600 dark:text-zinc-400"
                  set:html={work.iconPath}
                />
              </div>

              <!-- コンテンツ -->
              <div class="min-w-0">
                <h3 class="font-semibold text-sm text-zinc-900 dark:text-poi-focus">
                  {work.title}
                </h3>
                <p class="mt-1 font-sans text-xs leading-6 text-zinc-500 dark:text-poi-muted">
                  {work.description}
                </p>

                <!-- スタックタグ -->
                {work.stackResolved.length > 0 && (
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    {work.stackResolved.map((s) => (
                      <span class="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                        {s.brandIcon && (
                          <svg
                            width="10" height="10"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            style={`color:#${s.brandIcon.hex}`}
                            aria-hidden="true"
                          >
                            <path d={s.brandIcon.path} />
                          </svg>
                        )}
                        {s.label}
                      </span>
                    ))}
                  </div>
                )}

                <!-- リンク -->
                <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                  {work.links.map((link) => (
                    <a
                      class="hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline underline-offset-2 transition-colors"
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>
```

---

## 3. works/index.astro を削除

`src/pages/works/index.astro` を削除する。
`/works/` → `/` のリダイレクトは `public/_redirects` で対応済み。

---

## 補足

- スタックタグの区切り記号（ `·` など）はデザイン確認後に調整する
- カテゴリを増やす場合は `categoryOrder` 配列に追加するだけでよい
