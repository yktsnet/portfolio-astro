## Hero 左・Works 右レイアウト + Hero 細部調整
id: 05
branch-slug: hero-works-layout
github_issue:
status: close
type: feat
対象: |
  src/pages/index.astro
内容: |
  現在全幅センター寄りのレイアウトを Hero 左・Works 右の非対称構成に変更し、
  Hero の細部を追加調整する。
  1. Works を右寄せ（text-right / ml-auto）に変更
  2. Works アイコンをカード左から h3 タイトル横インラインに移動
  3. Hero の「Builder」テキストに Poimandres グリーン（#addb67）を適用
  4. Hero に GitHub リンク（https://github.com/yktsnet）を追加
  5. モバイルも同じ左右構成を維持（全幅フォールバックなし）
確認: |
  - Works セクション全体が右寄せになっていること
  - カテゴリ見出し・各 work カード・リンクが右寄せ揃いであること
  - アイコンが h3 タイトル横にインラインで表示されること
  - 「Builder」が #addb67 で表示されること
  - GitHub リンクが Hero のメタ情報行に追加されていること
  - npm run typecheck が通ること

---

## 設計メモ

### Works 右寄せ方針

Works セクションのルートに `text-right` を適用し、カード内の flex 方向を反転。
カテゴリ見出し（h2）・リンク群も右揃え。

```astro
<section class="mb-16 text-right">
  ...
  <div class="flex flex-row-reverse gap-3">
    <!-- コンテンツ → アイコン の順（右→左）-->
  </div>
```

### アイコン移動

現在: アイコンボックス（w-9 h-9）+ テキストブロックの横並び  
変更後: アイコンを h3 の直後にインライン SVG（16px）として配置し、アイコンボックスを削除

```astro
<h3 class="inline-flex items-center gap-2 font-semibold ...">
  {work.title}
  <svg width="16" height="16" ... set:html={work.iconPath} />
</h3>
```

### Builder グリーン

```astro
<p class="font-mono text-sm ...">
  <span style="color:#addb67">Builder</span> · <span>@yktsnet</span>
</p>
```

### GitHub リンク追加

Hero メタ情報行（Osaka / ykts.net / 2025〜 の並び）に追加：

```astro
<a href="https://github.com/yktsnet" target="_blank" rel="noopener noreferrer" ...>
  <svg ... set:html={getLucideIcon("github")} />
  GitHub
</a>
```
