## 変更内容

Worksページ冒頭のHostingArchitecture（共有ホスト基盤の仕様表）に、SV6の稼働実態を裏付けるライブステータスをトグルで追加した。既存の `/trading-system` と同じ「Cloudflare KV → Hono API → Astro SSR」のデータフローを踏襲しつつ、グラフの中身と伝えたい印象は trading-system（イベント密度・活発さ）とは逆で、「ずっと動いている・低負荷・キャッシュも健全」という“凪の安定”を見せることを目的とした。

- `src/components/HostingArchitecture.astro`: 既存の仕様表の末尾に「ライブメトリクスを見る」トグルを追加。初回オープン時に `sv6-status:open` カスタムイベントを発火し、`SV6StatusChart` 側で遅延フェッチする。
- `src/components/status/SV6StatusChart.astro`（新規）: 単一SVGチャート（最上段=1時間ごとのハートビート・ドット列、下段2本=Load%・Available%の折れ線、0-100%共有軸）、固定の解説3本（稼働継続・低負荷・メモリの健全性、いずれも取得データから動的算出）、基礎スペック静的1行、トグルで開く追加情報（Swap使用率・稼働コンテナ数・コア別使用率・Slabサイズ）を実装。
- `src/lib/sv6-status.ts`（新規）: KVペイロード `status:sv6` の型定義と整形ヘルパー（Load%/Available%系列化、uptime日数、Slab表示フォーマット等）。
- `src/lib/api.ts`: `GET /api/sv6-status` を追加。既存 `/api/status` と同じパターンで `ykts_status_metrics` KVの `status:sv6` キーを読み、未バインド時500・データ無し時404を返す。

### 対象ファイルからの変更点（要確認）

- **`src/pages/api.ts` → `src/lib/api.ts`**: issueの対象には `src/pages/api.ts` と記載があったが、実際のHonoアプリ本体は `src/lib/api.ts`（既存 `/api/status` もここに定義）であり、ブリッジ層 `src/pages/api/[...route].ts` は全ルートを `app.fetch` に委譲する汎用実装のため変更不要。プロジェクト規約（`context/conventions.md`「Honoのアプリケーション本体は `src/lib/api.ts` に定義」）に従い、既存パターンと同じ場所にエンドポイントを追加した。
- **`wrangler.jsonc`**: issue本文に「既存 `ykts_status_metrics` KVに `status:sv6` キーを追加運用。ネームスペース追加は不要」と明記されている通り、設定ファイル自体の変更は発生しない（運用上のキー追加のみ）ため、diffなし。

### KVペイロード契約に関する補足

issueに列挙された `load1` / `MemAvailable` は、デザイン方針にある「下段2本の折れ線」を成立させるため、`heartbeats` と同じ長さ・同じ順序の時系列配列（`load1: number[]`, `mem_available_kb: number[]`）として定義した。`nproc` / `mem_total_kb` はマシンスペックとして不変な固定値、`uptime_seconds` 以降（swap・コンテナ数・コア別使用率・Slab）は最新スナップショット値として扱う。SV6側の収集スクリプト（リポ外・別Issue）はこの契約に合わせてKVへ書き込む必要がある。

基礎スペック行（CPU型番・コア数・総メモリ容量）はuserから提供された実測値 `Intel Core i5-8365U (4C/8T) ・ 8コア ・ 8GB RAM` を固定テキストとして反映した。

## 静的確認結果

- `npm run typecheck`: 0 errors / 0 warnings（既存ファイル由来の無関係なhintのみ）。新規・変更ファイルに起因する診断なし。
- `npx vitest run src/lib/api.test.ts`: 既存10件すべてpass（新エンドポイント追加による既存 `/api/status` への影響なし）。
- import・caller整合性（コードリーディングで確認）:
  - `HostingArchitecture.astro` が `./status/SV6StatusChart.astro` を正しくimportし、既存の仕様表と同じ `relative z-10 space-y-4` コンテナ内にトグルを配置。
  - `SV6StatusChart.astro` の `<script>` は `../../lib/sv6-status` と `../../lib/status`（`formatUpdatedAt` 再利用）を正しい相対パスでimport。
  - `src/pages/api/[...route].ts` は変更不要（全ルートを `app.fetch` に委譲する既存実装のまま `/api/sv6-status` を透過的にハンドリングする）。
- KVペイロードが無い/エラー時のフォールバック表示:
  - `/api/sv6-status` はKV未バインド時500・キー未設定時404を返す（`/api/status` と同一パターン）。
  - クライアント側 `loadAndRender()` は `fetch` 失敗・非2xx・JSON異常のいずれも `catch` し `renderFallback()` を呼び、「データを取得できませんでした」表示とトグル内追加情報ボタンの非表示化を行う。
  - `sv6-status.ts` の各ヘルパーは `heartbeats` / `load1` / `mem_available_kb` / `cpu_cores` 等の配列欠落を `?? []` で吸収し、`nproc` / `mem_total_kb` が0の場合もゼロ除算せず0を返す。

`git diff --name-only HEAD~1`:
```
src/components/HostingArchitecture.astro
src/components/status/SV6StatusChart.astro
src/lib/api.ts
src/lib/sv6-status.ts
```

## 検証手順

- `npm run dev` でローカル起動し `/works/` にアクセス、HostingArchitecture末尾の「ライブメトリクスを見る」をクリックしてトグル開閉・チャート描画（またはKV未設定時のフォールバック表示）を目視確認する。
- トグル内「詳細を見る」ボタンでSwap使用率・稼働コンテナ数・コア別使用率・Slabサイズの表示/非表示を確認する。
- SV6側のメトリクス収集スクリプト・KV書き込み（本Issue対象外）が別途用意された後、`status:sv6` キーの実データでチャートが期待通り描画されることを確認する。
