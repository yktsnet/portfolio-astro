## Hero プロフィールセクション改善
id: 05
branch-slug: hero-profile-redesign
github_issue:
status: open
type: feat
対象: |
  src/pages/index.astro
内容: |
  トップページの Hero セクションを SNS プロフィール風にリデザインする。
  現状は中央揃えの縦積みレイアウトで情報が少ない。
  以下の要素を追加・変更し、まとまりのある印象にする。

  1. レイアウト変更
     - デスクトップ: アバター左寄せ + 情報右の横並び（flex-row）
     - モバイル: 縦積み中央揃え（現状維持）

  2. 追加要素
     - 肩書: "Builder"（名前の直下、モノスペース・ミュートカラー）
     - ハンドル: "@yktsnet"（肩書の隣もしくは下、ミュートカラー）
     - メタ情報行（小さなアイコン + テキスト）:
       - 場所: "Osaka"（map-pin アイコン）
       - ウェブサイト: "ykts.net"（リンクアイコン、href="https://ykts.net"、外部リンク）
       - 活動開始: "2025〜"（カレンダーアイコン）
     - GitHub リンクはヘッダーにアイコンがあるためメタ情報には含めない

  3. アイコン
     - map-pin は src/lib/lucide.ts に既存
     - link・calendar は同ファイルに SVG パスを追記して使用する

確認: |
  - デスクトップ（sm:）でアバターが左寄せ、情報が右に並ぶこと
  - モバイルで縦積み中央揃えになること
  - "Builder" と "@yktsnet" が名前の下に表示されること
  - メタ情報行（Osaka / ykts.net / 2025〜）が表示されること
  - ykts.net リンクが target="_blank" rel="noopener noreferrer" で開くこと
  - npm run typecheck が通ること

---

## デザイン仕様

### レイアウト骨格

```astro
<section class="mb-20">
  <div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-8">
    <!-- アバター -->
    <img ... class="h-24 w-24 rounded-full object-cover shrink-0" />

    <!-- 情報 -->
    <div class="text-center sm:text-left">
      <!-- 名前 -->
      <h1>Katsuhiro Yamakawa</h1>

      <!-- 肩書 + ハンドル -->
      <p class="font-mono text-sm text-zinc-500 dark:text-poi-muted mt-1">
        Builder · <span>@yktsnet</span>
      </p>

      <!-- bio -->
      <p class="mt-3 font-sans text-sm leading-7 ...">...</p>

      <!-- メタ情報行 -->
      <div class="mt-3 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-poi-muted">
        <span class="inline-flex items-center gap-1">
          <!-- map-pin SVG --> Osaka
        </span>
        <a href="https://ykts.net" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-1 hover:text-zinc-700 dark:hover:text-poi-focus transition-colors">
          <!-- link SVG --> ykts.net
        </a>
        <span class="inline-flex items-center gap-1">
          <!-- calendar SVG --> 2025〜
        </span>
      </div>
    </div>
  </div>
</section>
```

### lucide.ts に追加するアイコン

```ts
"link": `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />`,
"calendar": `<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />`,
```
