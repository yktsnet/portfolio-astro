[🇯🇵 日本語](README.md) | [🇬🇧 English](README.en.md)

# ykts.net

[![CI](https://github.com/yktsnet/portfolio-astro/actions/workflows/ci.yml/badge.svg)](https://github.com/yktsnet/portfolio-astro/actions/workflows/ci.yml)

> Systems that disappear into the workflow.

Personal portfolio and tech blog.  
https://ykts.net

## Tech Stack

Selected with a focus on balancing flexibility and implementation speed.

| Area | Tech | Reason |
|---|---|---|
| Framework | Astro | Static output as default while allowing dynamic features to be added later. No major rebuilding needed even if the design direction changes |
| Hosting | Cloudflare Pages | CDN edge delivery, Edge Functions, and KV all in one ecosystem |
| Styling | Tailwind CSS | Speeds up design. Build output is also lightweight |
| API Layer | Hono | Lightweight router running on Edge Functions |

## Infrastructure

```
Cloudflare Pages
  ├─ Static output (SSG)
  └─ /api/*  ─ Edge Functions (Hono)
                  └─ /api/contact  ─ Discord Webhook + Turnstile
```

## Deploy

Pushing to the main branch triggers automatic build and deployment via GitHub Actions (Cloudflare Pages).  
Required GitHub Secrets are managed in repository operations documentation (not included in README).

## Development

```bash
npm install
npm run dev
npm run build     # Production build (astro build + pagefind)
npm run preview   # Local check after build
npm test          # API unit tests
npm run typecheck # Type checking
```

## Docs

- [`context/conventions.md`](context/conventions.md) — Naming conventions and coding standards
- [`context/structure.md`](context/structure.md) — Directory structure and routing

## License

MIT
