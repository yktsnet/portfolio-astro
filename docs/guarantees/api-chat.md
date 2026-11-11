# api-chat

| 保証 | 対応テスト |
|---|---|
| `POST /api/chat` は `DB`・`GEMINI_API_KEY`・`ASSETS` のいずれかが未設定なら、500 で `{ error: 'server_config_error' }` を返す | `POST /api/chat > 500 when DB, GEMINI_API_KEY or ASSETS not bound` |
| `POST /api/chat` は `knowledge.json` を `ASSETS` から取得できなければ、500 で `{ error: 'knowledge_unavailable' }` を返す | `POST /api/chat > 500 knowledge_unavailable when knowledge.json cannot be fetched` |
| `POST /api/chat` は `knowledge.json` を `ASSETS` 経由で `{origin}/knowledge.json` から取得する | `POST /api/chat > loads knowledge.json via ASSETS and delegates to the folio-agent handler` |
| `POST /api/chat` は `knowledge.json` を `formatKnowledge` で整形した knowledge と `contactUrl` を `createGeminiGenerator` に渡す | `POST /api/chat > loads knowledge.json via ASSETS and delegates to the folio-agent handler` |
| `POST /api/chat` は `DB` と、`collectAnswerLinks(knowledge.json, contactUrl)` で集めた `answerLinks` を `createChatHandler` に渡す | `POST /api/chat > loads knowledge.json via ASSETS and delegates to the folio-agent handler` |
| `POST /api/chat` は `createChatHandler` のハンドラが返したレスポンスをそのまま返す | `POST /api/chat > loads knowledge.json via ASSETS and delegates to the folio-agent handler` |
