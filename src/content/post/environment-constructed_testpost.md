---
title: "Environment constructed"
description: "Astro + Cloudflare Workers + Hono による開発環境の構築記録"
publishDate: "24 Feb 2026"
tags: ["astro", "cloudflare"]
---

## 構成

このサイトは以下の技術スタックで構築されています。

- **Astro** — Static Site Generator / SSR framework
- **Cloudflare Workers** — Edge runtime
- **Hono** — API routing
- **Tailwind CSS** — Utility-first CSS

## なぜこの構成か

パフォーマンスとDXのバランスを重視しました。Astroのアイランドアーキテクチャにより、必要な箇所にのみJavaScriptを配信できます。

```bash
npm create astro@latest
```

Cloudflare Workersによるエッジ配信で、グローバルに低レイテンシなレスポンスを実現しています。
