## Sticky サイドバーレイアウト + Hero 細部調整
id: 05a
branch-slug: hero-works-layout-v2
github_issue:
status: close
type: feat
対象: |
  src/pages/index.astro
内容: |
  05 の右寄せ案を廃止し、Hero 左固定（sticky）・Works 右スクロールの
  2カラム構成に再設計する。
  1. ページ全体を flex 2カラムに変更（Hero 220px sticky / Works flex-1）
  2. Works アイコンボックスを廃止し、h3 タイトル左にインライン SVG（16px）として移動
  3. Hero の「Builder · @yktsnet」行全体を poi-accent（#5de4c7）に変更
  4. Hero に GitHub リンク（https://github.com/yktsnet）を追加
  5. モバイルは縦積み（Hero → Works）
確認: |
  - デスクトップで Hero が左に sticky 固定されスクロール時も残ること
  - Works が右カラムに表示されること
  - アイコンが h3 タイトルの左にインラインで表示されること
  - アイコンボックス（w-9 h-9 の角丸カード）が消えていること
  - 「Builder · @yktsnet」行全体が #5de4c7 で表示されること
  - GitHub リンクが Hero のメタ情報行に追加されていること
  - npm run typecheck が通ること

---

## 設計メモ

### 全体レイアウト構造

```astro
<MainLayout>
  <div class="flex gap-12">

    <!-- Hero: sticky サイドバー -->
    <aside class="w-52 shrink-0 sticky top-12 self-start hidden sm:block">
      ...
    </aside>

    <!-- Works: スクロール領域 -->
    <main class="flex-1 min-w-0">
      ...
    </main>

  </div>

  <!-- モバイル: Hero を上に縦積み -->
  <div class="sm:hidden mb-12">...</div>
</MainLayout>
```

### Works アイコン移動

現在: アイコンボックス（`w-9 h-9` 角丸）+ テキストブロックの横並び  
変更後: ボックス廃止、h3 左にインライン SVG（16px）

```astro
<h3 class="flex items-center gap-2 font-semibold text-base ...">
  <svg width="16" height="16" stroke="currentColor" ... set:html={work.iconPath} />
  {work.title}
</h3>
```

### Builder 行カラー

行全体（「Builder · @yktsnet」）を `poi-accent` で統一。

```astro
<p class="font-mono text-sm text-poi-accent mt-1">
  Builder · @yktsnet
</p>
```

### GitHub リンク追加

Hero メタ情報行（Osaka / ykts.net / 2025〜 の並び）に追加：

```astro
<a href="https://github.com/yktsnet" target="_blank" rel="noopener noreferrer"
   class="inline-flex items-center gap-1 hover:text-zinc-700 dark:hover:text-poi-focus transition-colors">
  <svg ... set:html={getLucideIcon("github")} />
  GitHub
</a>
```
