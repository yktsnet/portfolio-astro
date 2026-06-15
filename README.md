# ykts.net

[![CI](https://github.com/yktsnet/portfolio-astro/actions/workflows/ci.yml/badge.svg)](https://github.com/yktsnet/portfolio-astro/actions/workflows/ci.yml)

> Systems that disappear into the workflow.

個人ポートフォリオ・技術ブログ。Works / Posts / Contact で構成。  
https://ykts.net

## Tech Stack

柔軟性と実装速度の両立を軸に選定。

| Area | Tech | Reason |
|---|---|---|
| Framework | Astro | 静的出力を基本としつつ、後から動的な仕組みを追加できる。設計の方向が変わっても大きく作り直さずに済む |
| Hosting | Cloudflare Pages | CDNエッジへの配信・Edge Functions・KVがひとつのエコシステムで完結 |
| Styling | Tailwind CSS | 設計の速度が上がる。ビルド出力も軽い |
| API Layer | Hono | Edge Functions上で動く軽量ルーター |
| Search | Pagefind | ビルド時に静的インデックスを生成。ランタイム依存ゼロ |

## Infrastructure

```
Cloudflare Pages
  ├─ 静的出力 (SSG)
  └─ /api/*  ─ Edge Functions (Hono)
                  ├─ /api/contact  ─ Discord Webhook + Turnstile
                  └─ /api/status   ─ Cloudflare KV
```

## Setup

### Environment Variables

| Variable | Description |
|---|---|
| `CONTACT_DISCORD_WEBHOOK_URL` | コンタクトフォーム用 Discord Webhook |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile シークレットキー |

### Cloudflare

1. Cloudflare Pages でプロジェクトを作成
2. KV ネームスペースを2つ作成し、`wrangler.jsonc` の `kv_namespaces` にIDを設定
3. 上記の環境変数を Pages ダッシュボードから追加

## Development

```bash
npm install
npm run dev
npm test          # APIユニットテスト
npm run typecheck # 型チェック
```

## Docs

- [`context/conventions.md`](context/conventions.md) — 命名規則・コーディング規約
- [`context/structure.md`](context/structure.md) — ディレクトリ構成・ルーティング

## License

MIT — 初期ベース: [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by Chris Williams（大幅に改変）
