# ykts.net

A personal portfolio and technical blog built with Astro, deployed on Cloudflare Pages.

The focus is on documenting *why* systems are designed a certain way, and connecting working backend systems to public-facing surfaces.

> 日本語の記事・作品一覧: [ykts.net](https://ykts.net/)

## Selected Works

- **[NFC Attendance System](https://ykts.net/nfc-attendance/)** — Attendance management with Sony RC-S300 + Raspberry Pi 2. Python · GAS · Discord Webhook
- **[Trading System](https://ykts.net/trading-system/)** — Public monitoring surface for an automated trading system. Cloudflare KV + Astro + SVG charts
- **[Cat Feed Tracker](https://ykts.net/cat-feed-tracker/)** — Cat feeding log system built around a Pico W. FastAPI · PostgreSQL · LINE Messaging API · NixOS

→ Full list: [ykts.net/works](https://ykts.net/works/)

## Architecture (Trading System)

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

1. Create a project on Cloudflare Pages
2. Create a KV namespace and bind it as `SESSION`
3. Add the KV binding to your Wrangler config
4. Add the environment variables above via the Pages dashboard

## Development
```bash
npm install
npm run dev
```

## License & Credits

MIT — Initial foundation: [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by Chris Williams, heavily reworked.
