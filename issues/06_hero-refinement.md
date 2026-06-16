## Hero サイドバー 文字組み・余白・ナビ統合
id: 06
branch-slug: hero-refinement
github_issue:
status: open
type: feat
対象: |
  src/pages/index.astro
内容: |
  Hero サイドバーの文字組み・余白・ナビ統合を整理する。
  1. 「Builder」のみに変更（「· @yktsnet」削除）
  2. bio テキストの <br> を削除し自然折り返しに（PC・モバイル共通）
  3. photo → 名前 → Builder → bio → meta のグループ間余白にリズムをつける
  4. メタ情報の行間を space-y-1 に詰める
  5. Post・Contact を Hero メタ情報リストの末尾に統合し、右上ナビから削除
確認: |
  - 「Builder」のみ表示・poi-accent カラーであること
  - bio に <br> がなく自然に折り返していること
  - photo-名前は近く、bio 前・meta 前に余白があること
  - メタ情報リストの行間が詰まっていること
  - Post・Contact が Hero 内に表示されること
  - 右上ナビから Post・Contact アイコンが消えていること
  - npm run typecheck が通ること

---

## 設計メモ

### Hero 構造

```astro
<aside ...>
  <!-- photo -->
  <img class="h-24 w-24 rounded-full object-cover" ... />

  <!-- 名前 + Builder: photo と近づける -->
  <div class="mt-3">
    <h1 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-poi-focus">
      Katsuhiro Yamakawa
    </h1>
    <p class="text-xs text-poi-accent mt-0.5">Builder</p>
  </div>

  <!-- bio: グループ前に余白 -->
  <p class="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-poi-muted">
    レガシーをバラして作り直すのが好き。IoT・インフラ自動化・NixOS。AIエージェントを実務に組み込む実験を続けている。
  </p>

  <!-- meta + nav: グループ前に余白、行間 space-y-1 -->
  <div class="mt-4 space-y-1 text-xs text-zinc-500 dark:text-poi-muted">
    <span class="flex items-center gap-1.5">📍 Osaka</span>
    <a href="https://ykts.net" ...>🔗 ykts.net</a>
    <a href="https://github.com/yktsnet" ...>🐙 GitHub</a>
    <span class="flex items-center gap-1.5">📅 2025〜</span>
    <a href="/post" ...>📄 Post</a>
    <a href="/contact" ...>✉ Contact</a>
  </div>
</aside>
```

### 右上ナビからの削除

NavHeader（またはナビコンポーネント）から Post（document アイコン）と
Contact（mail アイコン）のリンクを削除する。
