## Works に order-system-rag カードを追加
id: 33
branch-slug: add-order-system-rag
github_issue: 56
status: close
type: feat
対象: |
  src/data/works.ts
  src/lib/brand-icons.ts
内容: |
  order-system-rag リポのカードを Works に追加する。
  既存の「Order System」（order-system-migration / Text-to-SQL 側）とは別カードとして並べる。
確認: |
  npm run typecheck で型エラーがないこと

---

## エントリ案

```ts
{
  categoryTags: ["ai", "office"],
  isOSS: true,
  priority: 1,
  title: "Order System RAG",
  color: "#c792ea",
  icon: "book-search",
  description:
    "取引先帳票 PDF を Azure Document Intelligence で構造化し、AI Search + LangGraph で RAG 化。\n姉妹リポの Text-to-SQL と並べて「質問の性質でツールを選ぶ設計判断」を実証する。",
  rationale:
    "同じ発注ドメイン・同じ質問に対して Text-to-SQL と RAG が出す答えの違いを並べ、手法選択の根拠を見せる構成にした。",
  publishedAt: "2026.06",
  links: [
    { label: "Demo →", href: "https://order-rag.ykts.net/", external: true },
    { label: "GitHub", href: "https://github.com/yktsnet/order-system-rag", external: true },
  ],
  stack: [
    { label: "LangGraph", brand: "langgraph" },
    { label: "Gemini API", brand: "gemini" },
    { label: "Azure AI Search" },
    { label: "Azure Doc Intelligence" },
  ],
}
```

## brand-icons

Azure 系は simple-icons にエントリがあるか要確認。なければ stack に brand なしで載せる（上記案は brand なしで記載済み）。

## 配置

既存の Order System（migration）のすぐ下に置く。同じ発注ドメインなので隣接させる。

## 注意

- icon `book-search` が lucide.ts に未登録なら追加する
- 既存の Order System エントリは変更しない
