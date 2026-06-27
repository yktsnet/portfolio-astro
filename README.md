[🇯🇵 日本語](README.md) | [🇬🇧 English](README.en.md)

# ykts.net

[![CI](https://github.com/yktsnet/portfolio-astro/actions/workflows/ci.yml/badge.svg)](https://github.com/yktsnet/portfolio-astro/actions/workflows/ci.yml)

> Systems that disappear into the workflow.

個人ポートフォリオ・技術ブログ。  
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
                  └─ /api/contact  ─ Discord Webhook + Turnstile
```

## Deploy

main ブランチへの push で GitHub Actions が自動ビルド・デプロイ（Cloudflare Pages）。
必要な GitHub Secrets はリポジトリ運用ドキュメントで管理する（README には記載しない）。

## Development

```bash
npm install
npm run dev
npm run build     # 本番ビルド (astro build + pagefind)
npm run preview   # ビルド後のローカル確認
npm test          # APIユニットテスト
npm run typecheck # 型チェック
```

## Docs

- [`context/conventions.md`](context/conventions.md) — 命名規則・コーディング規約
- [`context/structure.md`](context/structure.md) — ディレクトリ構成・ルーティング

## License

MIT
