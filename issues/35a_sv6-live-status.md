## SV6ライブステータス表示

id: 35a
branch-slug: sv6-live-status
github_issue:
status: open
type: feat
対象: |
  - src/components/HostingArchitecture.astro（末尾に「ライブメトリクスを見る」トグルを追加）
  - src/components/status/SV6StatusChart.astro（新規・チャート本体）
  - src/lib/sv6-status.ts（新規・KVペイロードの型と整形ヘルパー）
  - src/pages/api.ts（GET /api/sv6-status を追加、KVから status:sv6 を読む）
  - wrangler.jsonc（既存 ykts_status_metrics KVに `status:sv6` キーを追加運用。ネームスペース追加は不要）
内容: |
  Worksページ冒頭のHostingArchitecture（共有ホスト基盤の仕様表）に、SV6の稼働実態を裏付けるライブステータスをトグルで追加する。
  既存の /trading-system と同じ「Cloudflare KV → Hono API → Astro SSR」のデータフローを踏襲するが、
  グラフの中身と伝えたい印象は trading-system（イベント密度・活発さ）とは逆で、
  「ずっと動いている・低負荷・キャッシュも健全」という“凪の安定”を見せることが目的。

  SV6側のメトリクス収集スクリプト・KV書き込みは別途リポ外で用意される前提（本Issueの対象外）。
  KVペイロード `status:sv6` は以下の形を想定する：
  - 1時間ごとのハートビート（push成功タイムスタンプの配列）
  - load1, nproc（Load%算出用）
  - MemTotal, MemAvailable（Available%算出用）
  - uptime
  - swap使用率、稼働コンテナ数、コア別使用率、Slabサイズ（トグル内の追加情報用）
確認: |
  - npm run typecheck
  - トグル開閉・チャート描画のロジックはコードレビューで確認（実行確認はuser委任）
  - KVペイロードが無い/エラー時のフォールバック表示があることを確認

---

## デザイン方針

**1つのSVGチャート**（`StatusCharts.astro`のタブ切り替えではなく単一表示）に以下を重ねる：

1. **最上段**: ハートビート・ドット列 — 1時間ごとのメトリクスpush成功を示す横一列のドット。途切れなければ「動き続けている」の証拠になる。
2. **下段2本の折れ線**（0-100%共有軸）:
   - **Load%**（`load1 / nproc * 100`）— 低い位置に張り付く線
   - **Available%**（`MemAvailable / MemTotal * 100`）— 高い位置で安定する線

**チャート下に固定の解説3本**（タブ切り替え不要、常時表示）：
1. 稼働継続 — ドット列を指し「◯日連続稼働」
2. 低負荷 — Load%の線を指し「CPU負荷は常時1割未満」
3. メモリの健全性 — Available%の線を指し「キャッシュ込みでも常に○割の余裕を維持」

Used%ではなく**Available%**を採用する理由：Used%だと「42%も使ってて大丈夫？」と素人に誤解されるため、キャッシュ込みの余裕を示すAvailable%の方が意図が伝わる。

**トグルで開く追加情報**（デフォルト非表示）：
- Swap使用率
- 稼働コンテナ数
- コア別使用率（btop風の簡易表）
- Slabサイズ（カーネルキャッシュ、玄人向け）

**基礎スペック（静的1行、HostingArchitectureの既存仕様表と同じ体裁）**：
CPU型番・コア数・総メモリ容量を固定テキストで併記する。%だけでは母数が分からず解釈できないため。動的グラフ化はしない。

## 未決事項

- push頻度は1時間ごとで妥当か（trading-systemも1時間ごと想定）
- ハートビートドットの表示期間（直近何時間/何日分か）
- Swap使用率をトグル内の追加情報に留めるか、健全性の解説に含めるか（今回はノイズになるため除外方針）
