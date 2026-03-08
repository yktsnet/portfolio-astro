# ykts.net

A personal portfolio and technical blog built with Astro, deployed on Cloudflare Pages. The site serves as both a writing space and a live demonstration of systems I actively develop and operate myself.

The Status page is a direct example of this: logs from an automation pipeline running on my Hetzner VPS are aggregated every five minutes and pushed to Cloudflare KV. The Astro SSR worker fetches that payload on each request and renders four SVG charts client-side — no charting library involved. The goal is to show what an SSR site can do, rather than describe it.

<details>
<summary>🇯🇵 日本語による説明を表示する</summary>

## このサイトについて

ykts.net は、ポートフォリオとしての文章発信の場であり、同時に私が普段から開発・運用しているシステムをそのままサイトに組み込んだ実例集でもあります。

Statusページはその代表例です。自宅サーバー上で継続的に動かしている自動化パイプラインのログを集約し、Cloudflare KV経由でWebへ接続しています。「SSRを使うとどんなサイトが作れるのか」という問いに対して、説明するより見せるほうが早いという考えのもとで設計しました。

Hetzner VPS で5分ごとにKVへ書き込み、AstroのSSRエンドポイントがそれをJSONで返す3層構造がStatusページのバックボーンです。静的サイトでは実現できない、データと画面が常に連動する構成をCloudflare Pages上で動かしています。

表示されるデータは個人情報に関わる部分を除外し、5分の遅延を挟んで公開しています。

ブログ記事はすべて日本語で書いており、セットアップ手順ではなく「なぜこの構成にしたのか」という判断の背景を中心に記録しています。

</details>

## Architecture

```
Hetzner VPS (NixOS · systemd timer)
  └─ status_metrics_push.py  ─→  Cloudflare KV
                                       │
                              Astro SSR (Cloudflare Pages)
                                  ├─ /api/status  (Hono)
                                  └─ /Status      (SVG charts · client-side DOM)
```

## Status Page — Data Sources

| Chart | Source | What it shows |
|---|---|---|
| Order Latency | `sent.jsonl` | Time from bar close to order send |
| Session Activity | `outbox.jsonl` | Open / close event rhythm over 12h |
| Activity Heatmap | `outbox.jsonl` | Events aggregated by UTC hour × date |
| Data Freshness | `bar_lag.log` | Bar data staleness, sampled every 30s |

Sensitive values (instrument, lot size, P&L figures) are excluded. A 5-minute delay is applied before publication.

## Tech Stack

**Framework & Deployment**
- [Astro](https://astro.build/) — SSR mode, `@astrojs/cloudflare` adapter
- [Cloudflare Pages](https://pages.cloudflare.com/) — hosting and edge runtime
- [Cloudflare KV](https://developers.cloudflare.com/kv/) — key-value store for live metrics
- [Hono](https://hono.dev/) — API routing within Astro's catch-all route

**Frontend**
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Fira Code](https://github.com/tonsky/FiraCode) — monospace font throughout
- SVG charts rendered via `document.createElementNS` — zero runtime dependencies
- [Poimandres](https://github.com/drcmda/poimandres) color palette

**Backend (Hetzner VPS)**
- NixOS with systemd timers for scheduled data push
- Python 3 — log parsing and KV write via Cloudflare REST API
- rsync-based dotfiles sync from T14 (development machine)

## Content

Blog posts are written in Japanese and focus on the reasoning behind technical decisions — not setup instructions. Tags, RSS, and full-text search via [Pagefind](https://pagefind.app/) are supported.

## License & Credits

- **Code**: MIT
- **Theme foundation**: [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) — minimalist philosophy inherited, reimagined for Astro + Hono. (c) 2022 Chris Williams
