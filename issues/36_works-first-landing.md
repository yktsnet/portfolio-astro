## トップページを Works にし、ナビ順を証拠先行に並び替える
id: 36
branch-slug: works-first-landing
github_issue: 63
status: close
type: feat
対象: src/pages/index.astro, src/pages/works.astro, src/pages/about.astro, src/components/HeroDesktop.astro, src/components/HeroMobile.astro, astro.config.mjs, context/structure.md
内容: `/` で最初に見せるものを About（思想）から Works（成果物）に変える。ナビ順も WORKS → IMPACT → ABOUT → APPROACH の証拠先行に並び替える。ページの中身自体は一切変更しない。
確認: `npm run typecheck` と `npm run build` が通ること。全ナビリンクの href と current ハイライトの整合をコードを読んで確認すること。

---

## 背景

訪問者が最初に「何を作れる人か」を見られるようにする。Works ページの1画面目（インフラ設計 + ライブメトリクス）はサイト全体で最も強い「動いている証拠」なので、これを玄関にする。

## 仕様

### ルーティング

- `/` : Works の内容を描画する（現 `src/pages/works.astro` の内容。`current="works"`）
- `/about/` : About の内容を描画する（現 `src/pages/index.astro` が描画している `<About />`。既存の `about.astro` がこの形ならそのまま）
- `/works/` : `/` へリダイレクトする。`astro.config.mjs` の `redirects` を使う（静的ビルドで meta refresh が生成される）。既存の被リンク（Zenn・GitHub 等からの流入）を壊さないための措置
- `/approach/`・`/impact/` : 変更なし

### ナビ（HeroDesktop.astro / HeroMobile.astro）

nav 配列を次の順・href に変更する:

1. WORKS → `/`
2. IMPACT → `/impact/`
3. ABOUT → `/about/`
4. APPROACH → `/approach/`

label・icon・key は既存のものを流用する。

### 内部リンク

`src/` 内で `/works/` を参照している内部リンク（例: Approach の proof リンク）を grep し、`/` に更新する。リダイレクトがあるため壊れはしないが、直リンクに揃える。

### ドキュメント

`context/structure.md` のルーティング表を新しい対応に更新する。

## 実装順序

1. ナビ2ファイルの並び替えと href 変更
2. index.astro / works.astro / about.astro の入れ替えとリダイレクト設定
3. 内部リンクの grep・更新
4. structure.md 更新
