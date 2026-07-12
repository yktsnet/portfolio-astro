## Excel Kanri を Works に追加

id: 47
branch-slug: add-excel-kanri
github_issue:
status: open
type: feat
対象: |
  src/data/works.ts（worksへの追加）
  src/lib/lucide.ts（user-penアイコンの追加）
内容: |
  完成した https://github.com/yktsnet/excel-kanri を Works セクションに mini 枠で追加する。
  既存 mini 2件（Trading Lab, Folio Agent）と同じ isMini:true 構成。
確認: |
  npm run typecheck
---

## 追加内容

`src/data/works.ts` の `works` 配列に以下を追加する。

```ts
{
  categoryTags: ["office"],
  isOSS: true,
  isMini: true,
  priority: 2, // 既存mini2件(Trading Lab:3, Folio Agent:1)との並び順は要調整可
  title: "Excel Kanri",
  color: "#89ddff",
  icon: "user-pen", // src/lib/lucide.tsに未登録。追加が必要
  publishedAt: "2026.07",
  description:
    "既存のExcel帳票運用を壊さずに、Webフォーム生成・共有フォルダのPDF自動変換・全文検索を後付け。\nclone して使う汎用モジュール群 + FastAPI/React リファレンス実装。",
  rationale:
    "帳票運用そのものの置き換えではなく、ドメイン語彙をexamples/にのみ閉じ込めることで、テンプレート差し替えだけで他業種へ転用できる構造にした。",
  inUse: true,
  links: [
    { label: "Demo →", href: "https://excel-kanri.ykts.net/", external: true }, // links[0]はカード全体(タイトル+カード全面)のクリック導線になる。デモURLを最優先に置く
    { label: "GitHub", href: "https://github.com/yktsnet/excel-kanri", external: true },
  ],
  stack: [
    { label: "Python", brand: "python" },
    { label: "FastAPI", brand: "fastapi" },
    { label: "SQLite", brand: "sqlite" },
    { label: "Docker", brand: "docker" },
  ],
},
```

## 作業手順

1. `src/lib/lucide.ts` に `user-pen` アイコンのSVGパスを追加する（Lucideの公式SVGから該当パスを取得）
2. `src/data/works.ts` の `works` 配列に上記オブジェクトを追加する
3. `priority` は既存mini2件（Trading Lab: 3, Folio Agent: 1）との並び順を見て妥当な値に調整してよい

`brand: "python"` / `"fastapi"` / `"sqlite"` / `"docker"` は `src/lib/brand-icons.ts` に既に登録済み。`BrandKey`型（`src/data/works.ts`内）に `"docker"` が未追加なら型定義に追加すること。

## 選定根拠（実装者向け補足）

- `categoryTags`: `modernization` は既存4件で「既存システムの解体・刷新」案件専用の意味で使われており、excel-kanriの「既存Excelを壊さず後付け」という思想とは逆のため不採用。`pip` はカテゴリ定義はあるがexcel-kanriはPyPI非公開（clone配布方針）のため不採用。`office` のみを採用。
- `stack`: README「Tech Stack」表のReason列で明記されている設計判断（FastAPI=pip installだけで完結、SQLite+FTS5=別立て検索基盤を持たない、Gotenberg/Docker=subprocess管理を無くす）を体現する技術を優先し、Python/FastAPI/SQLite/Dockerを選んだ。Reactは一般的なSPA構成としての採用理由であり差別化要素ではないため見送った。
- `inUse: true`: 現場で使われているフラグをオンにする。
