## PR記録: feat: 既存記事の一覧非表示化とBlog一覧のミニマル化
issue: 53 (53_blog-list-hidden-and-minimal.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/115
Merged: 9ba34b256f9bc152e48acffb6058693536a28f5f

## 変更内容
既存記事4本を frontmatter フラグで一覧・タグ一覧・RSS から除外しつつ URL は維持する。あわせて Blog 一覧のUIをカード式から日付＋タイトルのミニマルな箇条書きに変更する。

- `src/content.config.ts`: `post` コレクションの schema に `hidden: z.boolean().default(false)` を追加
- `src/content/post/{cat-feed-tracker,live-demo,nfc-attendance-system,trading-lab}.md`: frontmatter に `hidden: true` を追加（本文・他フィールドは無変更）
- `src/data/post.ts`: `getAllPosts` で `hidden: true` の記事を除外（一覧・タグ集計・RSS の呼び出し元すべてに反映）
- `src/pages/rss.xml.ts`, `src/pages/tags/index.astro`: `getAllPosts` 経由で自動的に除外が反映されるため、その旨をコメントで明記（ロジック変更なし）
- `src/pages/tags/[tag]/[...page].astro`: カード式グリッド表示（`PostPreview cardMode={true}`）を、`/posts/` 一覧と同じ日付＋タイトルの箇条書き表示に変更
- `src/components/blog/PostPreview.astro`: `cardMode` プロパティとカード式レンダリング分岐（画像的なアイコンボックス・説明文表示）を廃止し、日付＋タイトルの1行表示のみに統一。`pinned` 記事自体の抽出・強調表示ロジック（`src/pages/posts/[...page].astro` 側、対象外ファイル）は変更していない

## 保証
- `hidden: true` を持つ記事は `/posts/` 一覧・ページネーション・タグ一覧・RSS のいずれにも含まれない → `getAllPosts`（`src/data/post.ts`）で除外し、一覧・タグ・RSS の全呼び出し元が同関数を経由することをコードで確認（テストなし。理由: 本リポの保証台帳 `docs/guarantees.md` の対象は `src/lib/api.ts` の HTTP ルートに限定されており、Astro ページ・コンポーネントの描画結果は明示的に対象外のため台帳更新は不要）
- `hidden: true` の記事も `/posts/{slug}/` への直接アクセスでは表示される → `src/pages/posts/[slug].astro` の `getStaticPaths` は `getCollection("post")` を直接使用しており `getAllPosts` の除外ロジックを経由しないことをコードで確認（変更なし）
- 対象4記事に `hidden: true` を付与 → frontmatter の diff で確認
- `/posts/` 一覧が日付＋タイトルの1行リスト形式で画像・説明文を含まない → `PostPreview.astro` からカード式分岐を削除し1形式に統一したことをコードで確認
- なし（理由: 上記いずれも Astro ページ描画結果の検証であり、`npm run test` の対象である `src/lib/api.test.ts` のスコープ外。目視確認は検証手順に記載し user に委ねる）

## 静的確認結果
- `npm run typecheck`: 0 errors / 0 warnings（既存の他ファイル由来の warning・hint は本変更と無関係、変化なし）
- `npx vitest run`: 17 passed（既存テストのみ、本変更に伴う新規テストなし）
- import・caller整合性をコードで確認:
  - `PostPreview` の呼び出し元（`src/pages/posts/[...page].astro`, `src/pages/tags/[tag]/[...page].astro`）で `cardMode` を渡している箇所が無いことを確認（後者は本PRで除去）
  - `getAllPosts` の呼び出し元（`rss.xml.ts`, `tags/index.astro`, `tags/[tag]/[...page].astro`, `posts/[...page].astro`）はすべて同一関数経由のため除外が一貫して反映される
  - `posts/[slug].astro` は `getCollection("post")` を直接使用しており `hidden` に関わらず個別ページは全件生成されることを確認
- `git diff --name-only --cached`:
  ```
  src/components/blog/PostPreview.astro
  src/content.config.ts
  src/content/post/cat-feed-tracker.md
  src/content/post/live-demo.md
  src/content/post/nfc-attendance-system.md
  src/content/post/trading-lab.md
  src/data/post.ts
  src/pages/rss.xml.ts
  src/pages/tags/[tag]/[...page].astro
  src/pages/tags/index.astro
  ```
  issueの「対象」フィールドと完全一致。

## 検証手順
1. `npm run dev` でローカル起動し `http://localhost:4321/posts/` を開く。一覧が日付＋タイトルの箇条書き表示になっており、対象4記事（Cat feeding tracker with a reed switch / Turning backend work into a live demo / NFC attendance system for a small office / Beyond the Terminal）が表示されないことを確認する
2. `http://localhost:4321/tags/` および各タグページ（`/tags/{tag}/`）でも対象4記事とそのタグ由来のカウントが表示されないことを確認する（タグページの表示も箇条書きに変更されている）
3. `http://localhost:4321/rss.xml` を開き、対象4記事の `<item>` が含まれないことを確認する
4. `http://localhost:4321/posts/cat-feed-tracker/` 等、対象4記事のURLへ直接アクセスし、記事本文が通常どおり表示されることを確認する
