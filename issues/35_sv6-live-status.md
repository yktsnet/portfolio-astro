## SV6ライブステータス表示

id: 35
branch-slug: sv6-live-status
github_issue:
status: draft
type: feat
対象: |
  - src/components/HostingArchitecture.astro（末尾に「ライブメトリクスを見る」トグルを追加）
  - src/components/status/SV6StatusChart.astro（新規・チャート本体）
  - src/lib/sv6-status.ts（新規・KVペイロードの型と整形ヘルパー）
  - src/pages/api.ts（GET /api/sv6-status を追加、KVから status:sv6 を読む）
  - wrangler.jsonc（既存 ykts_status_metrics KVに `status:sv6` キーを追加運用。ネームスペース追加は不要）
  - （リポ外・申し送りのみ）SV6側の新規メトリクス収集スクリプトと NixOS systemd timer 設定
内容: |
  Worksページ冒頭のHostingArchitecture（共有ホスト基盤の仕様表）に、SV6の稼働実態を裏付けるライブステータスをトグルで追加する。
  既存の /trading-system と同じ「Cloudflare KV → Hono API → Astro SSR」のデータフローを踏襲するが、
  グラフの中身と伝えたい印象は trading-system（イベント密度・活発さ）とは逆で、
  「ずっと動いている・低負荷・キャッシュも健全」という“凪の安定”を見せることが目的。
確認: |
  - npm run typecheck
  - トグル開閉・チャート描画のロジックはコードレビューで確認（実行確認はuser委任）
  - KVペイロードが無い/エラー時のフォールバック表示があることを確認

---

## 背景（申し送り）

元々「Hetzner(het)のトレーディングBotステータス」をCloudflare KV経由で可視化する仕組みがあり（[status_metrics_push.py](file:///Users/ykts/dotfiles/apps/00archive/ops2/core/status_metrics_push.py)、`/trading-system` ページ）、これをテンプレートにSV6（自宅サーバー・NixOS・複数プロダクト同居ホスト）の稼働状況もWorksページに載せたい、という着想から始まった議論の結論。

## 検討の経緯（判断根拠）

- 当初「trading-systemのStatusChartsをそのまま流用し、密度が高いのでトグルで隠す」という案を検討したが、SV6は個人利用のほぼアイドルなホストであり、trading-systemのような「イベントが起きて動きが見える」チャートにはならない（CPU 1〜4%、Load 0.3〜0.6/8コア、idle 97-98%）。
- 実際にSSHでSV6の実測値を取得して確認：
  - CPU: ほぼ常時idle 97-98%
  - Load avg: 0.61/0.45/0.37（8コア中）
  - Mem: Used 3.2GiB(42%) / Available 4.4GiB(58%) / buff+cache 4.7GiB
  - Swap: 1.9GiB/11GiB使用
  - Uptime: 39日
  - コンテナ22個常駐
- 「動きがあって面白い」ではなく「凪＝安定・軽量であることそのものが売り」という方向に転換。Used%は素人に「42%も使ってて大丈夫？」と誤解されるため、キャッシュ込みの余裕を示す **Available%** を採用することにした。

## 最終デザイン方針

**1つのSVGチャート**（`StatusCharts.astro`のタブ切り替えではなく単一表示）に以下を重ねる：

1. **最上段**: ハートビート・ドット列 — 1時間ごとのメトリクスpush成功を示す横一列のドット。途切れなければ「動き続けている」の証拠になる。
2. **下段2本の折れ線**（0-100%共有軸）:
   - **Load%**（`load1 / nproc * 100`）— 低い位置に張り付く線
   - **Available%**（`MemAvailable / MemTotal * 100`）— 高い位置で安定する線

**チャート下に固定の解説3本**（タブ切り替え不要、常時表示）：
1. 稼働継続 — ドット列を指し「◯日連続稼働」
2. 低負荷 — Load%の線を指し「CPU負荷は常時1割未満」
3. メモリの健全性 — Available%の線を指し「キャッシュ込みでも常に○割の余裕を維持」

**トグルで開く追加情報**（デフォルト非表示）：
- Swap使用率
- 稼働コンテナ数
- コア別使用率（btop風の簡易表）
- Slabサイズ（カーネルキャッシュ、玄人向け）

**基礎スペック（静的1行、HostingArchitectureの既存仕様表と同じ体裁）**：
CPU型番・コア数・総メモリ容量を固定テキストで併記する。%だけでは母数が分からず解釈できないため。動的グラフ化はしない。

## データソース（SV6側・新規実装が必要、申し送り）

`status_metrics_push.py`はトレードBotのjsonlを読む実装なので流用不可。SV6用に新規スクリプトが必要：
- `/proc/loadavg`, `/proc/meminfo`（MemTotal/MemAvailable）, `/proc/uptime`, `docker ps -q | wc -l` 等をpsutilや標準ライブラリで収集
- 1時間ごとにsystemd timerで実行し、`_kv_put`相当の処理で `ykts_status_metrics` KVの `status:sv6` キーに書き込む
- NixOS設定は[ops2-service.nix](file:///Users/ykts/dotfiles/apps/00archive/ops2/ops2-service.nix)のサービス/タイマー定義を参考にする

## 未決事項

- push頻度は1時間ごとで妥当か（trading-systemも1時間ごと想定）
- ハートビートドットの表示期間（直近何時間/何日分か）
- Swap使用率をトグル内の追加情報に留めるか、健全性の解説に含めるか（今回はノイズになるため除外方針）
