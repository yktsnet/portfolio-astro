# ykts.net

A personal portfolio and technical blog built with Astro, deployed on Cloudflare Pages.

The focus is on documenting *why* systems are designed a certain way, and connecting backend infrastructure to public-facing work.

> 日本語の記事・作品一覧: [ykts.net](https://ykts.net/)

## Selected Works

- **[NFC Attendance System](https://github.com/yktsnet/nfc-attendance-kit)** — Sony RC-S300 + Raspberry Pi 2 による勤怠管理。Python · GAS · Discord Webhook
- **[Live Demo (Trading System)](https://ykts.net/live-demo/)** — 自動売買パイプラインのライブメトリクス。Cloudflare KV + Astro + SVG charts
- **[Cat Feed Tracker](https://ykts.net/posts/cat-feed-tracker/)** — Pico W を起点にした給餌記録システム。FastAPI · PostgreSQL · LINE Messaging API · NixOS

→ Full list: [ykts.net/works](https://ykts.net/works/)

## Architecture (Live Demo)
```text
Hetzner VPS (NixOS · systemd timer)
  └─ status_metrics_push.py  ─→  Cloudflare KV
                                       │
                              Astro (Cloudflare Pages)
                                  ├─ /api/status  (Hono)
                                  └─ /live-demo   (SVG charts · client-side DOM)
```

Sensitive values (instrument names, lot size, P&L) are excluded. A 5-minute delay is applied.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Astro + Cloudflare Pages adapter (static output + Edge Functions for API routes) |
| Styling | Tailwind CSS · Fira Code · Poimandres palette |
| API | Hono (catch-all route) |
| KV store | Cloudflare KV |
| Charts | SVG via `document.createElementNS` — zero runtime deps |
| Search | Pagefind (full-text, static) |
| Backend | NixOS · systemd timers · Python 3 |

## Setup

### Environment Variables

| Variable | Description |
|---|---|
| `CONTACT_DISCORD_WEBHOOK_URL` | Discord webhook for contact form |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |

### Cloudflare

1. Cloudflare Pages でプロジェクトを作成
2. KV namespace を作成し、`SESSION` としてバインド
3. Wrangler config に KV バインディングを追記
4. 上記の環境変数を Pages の設定から追加

## Development
```bash
npm install
npm run dev
```

## License & Credits

MIT — Initial foundation: [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by Chris Williams, heavily reworked.
