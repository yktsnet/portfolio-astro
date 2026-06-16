## Works レイアウト調整・Hero 統合
id: 03
branch-slug: works-layout-refine
github_issue:
status: close
type: feat
対象: |
  src/pages/index.astro
内容: |
  Issue 02 実装後の見た目の問題を修正し、デザインを完成させる。
  1. Hero と説明文を1セクションに統合
  2. Works を1列レイアウトに変更
  3. カテゴリ見出しに Serif フォント + カテゴリカラーを適用
  4. リンクをカテゴリ（= work）カラーに変更
  5. コンテンツ幅の制約を解除
確認: |
  - Hero と説明文が1つの section に収まっていること
  - Works が1列で表示されること
  - カテゴリ見出しが serif フォント + work.color で表示されること
  - リンクが work.color で表示されること
  - コンテンツがページ幅いっぱいに広がっていること
  - npm run typecheck が通ること

---

## 設計メモ

### カテゴリカラーのルール
同一カテゴリの works は同じ `color` を持つことを前提とする。
カテゴリ見出しの色は `items[0].color` で取得する。
リンク色も同様に各 work の `work.color` を使う。

### Serif フォント
Tailwind のデフォルト `font-serif`（Georgia 系システムフォント）を使用する。
`tailwind.config.mjs` への追加は不要。

---

## 1. Hero + 説明文を統合

現状は `<!-- Hero -->` と `<!-- Description -->` が別 section になっている。
1つの section にまとめる:

```astro
<!-- ===== Hero ===== -->
<section class="mb-12">
  <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
    <img
      src="/images/profile/me.webp"
      alt="Katsuhiro Yamakawa"
      class="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
    />
    <div class="min-w-0">
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-poi-focus">
        Katsuhiro Yamakawa
      </h1>
      <p class="mt-2 font-sans text-sm leading-7 text-zinc-600 dark:text-poi-muted">
        レガシーをバラして作り直すのが好き。IoT・インフラ自動化・NixOS。<br />
        AIエージェントを実務に組み込む実験を続けている。
      </p>
    </div>
  </div>
</section>
```

---

## 2. Works を1列レイアウトに変更・カラー適用

`grid` を廃止し `space-y` の1列に。
カテゴリ見出しに `font-serif` と `items[0].color`。
リンクに `work.color`。
コンテンツ div に `flex-1` を追加（幅制約の解消）:

```astro
<!-- ===== Works ===== -->
<section class="mb-16">
  <div class="space-y-16">
    {grouped.map(({ category, items }) => (
      <div>
        <!-- Serif + カテゴリカラー見出し -->
        <h2
          class="mb-8 font-serif text-4xl font-bold tracking-tight opacity-20 select-none"
          style={`color: ${items[0].color};`}
        >
          {category}
        </h2>

        <!-- 1列リスト -->
        <div class="space-y-8">
          {items.map((work) => (
            <div class="flex gap-4">
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

              <!-- コンテンツ（flex-1 で幅を確保） -->
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold text-sm text-zinc-900 dark:text-poi-focus">
                  {work.title}
                </h3>
                <p class="mt-1 font-sans text-xs leading-6 text-zinc-500 dark:text-poi-muted">
                  {work.description}
                </p>

                <!-- スタックタグ -->
                {work.stackResolved.length > 0 && (
                  <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1">
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

                <!-- リンク（work.color） -->
                <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
                  {work.links.map((link) => (
                    <a
                      class="hover:underline underline-offset-2 transition-opacity hover:opacity-80"
                      style={`color: ${work.color};`}
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
