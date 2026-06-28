## 変更内容

order-system-rag リポのカードを Works に追加する。
既存の「Order System」（order-system-migration / Text-to-SQL 側）とは別カードとして、そのすぐ下に並べた。

**追加エントリ（Order System RAG）**
- categoryTags: `["ai", "office"]`
- icon: `book-search`（Lucide）
- color: `#c792ea`（Order System と同色）
- stack: LangGraph / Gemini API / Azure AI Search / Azure Doc Intelligence
- links: Demo（order-rag.ykts.net）/ GitHub（yktsnet/order-system-rag）

## 静的確認結果

`npm run typecheck` → 0 errors, 0 warnings, 12 hints（hints は既存コードのもの）

### 変更ファイル

```
src/data/works.ts
src/lib/lucide.ts
```

- `src/data/works.ts` — Order System RAG エントリを Order System の直後に追加
- `src/lib/lucide.ts` — `book-search` アイコン（lucide-static v0.577.0 の SVG パス）を追加
- `src/lib/brand-icons.ts` — `langgraph` / `gemini` は既登録、Azure 系は brand なしのため変更なし

Issue 対象フィールドには `brand-icons.ts` が記載されていたが、使用ブランドが既登録であったため実変更なし。代わりに Issue 注意欄（「book-search が未登録なら追加する」）に従い `lucide.ts` を変更した。

## 検証手順

- Works ページ（`/works/`）で「Order System RAG」カードが表示されること
- Order System カードの直下に並んでいること
- `book-search` アイコンが正しくレンダリングされること
- Demo リンク・GitHub リンクが正しいこと
