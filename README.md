# ykts.net

A personal portfolio and technical blog built with Astro, deployed on Cloudflare Pages.

The site is a space for writing about technical decisions and a showcase of systems I build and operate. Posts are written in Japanese and focus on the reasoning behind design choices — not setup instructions.

<details>
<summary>🇯🇵 日本語による説明を表示する</summary>

## このサイトについて

ykts.net は、技術的な判断の背景を書き残す場であり、実際に作って動かしているシステムのショーケースです。

バックエンドで動かしているものをフロントに接続して公開する、という発想のもとで作品を作っています。自動売買パイプラインのメトリクスをリアルタイムで表示する [Live Demo](https://ykts.net/live-demo/) や、NFC を使った勤怠管理システムなど、実際に稼働しているものをそのまま載せています。

ブログ記事はすべて日本語で書いており、セットアップ手順ではなく「なぜこの構成にしたのか」という判断の背景を中心に記録しています。

</details>

## Works

- **[NFC Attendance System](https://github.com/yktsnet/nfc-attendance-kit)** — Sony RC-S300 + Raspberry Pi 2 による勤怠管理。Python · GAS · Discord Webhook
- **[Live Demo (Trading System)](https://ykts.net/live-demo/)** — 自動売買パイプラインのライブメトリクス。Cloudflare KV + Astro SSR + SVG charts
- **[ykts.net](https://ykts.net/)** — このサイト。Astro SSR + Cloudflare Pages + Hono

## Architecture (Live Demo)
```
Hetzner VPS (NixOS · systemd timer)
  └─ status_metrics_push.py  ─→  Cloudflare KV
                                       │
                              Astro SSR (Cloudflare Pages)
                                  ├─ /api/status  (Hono)
                                  └─ /live-demo   (SVG charts · client-side DOM)
```

## Live Demo — Data Sources

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

- Code: MIT
- Initial foundation: Astro Cactus by Chris Williams (MIT), later heavily reworked for this project.
