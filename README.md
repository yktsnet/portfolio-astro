# ykts.net

> Systems that disappear into the workflow.

個人ポートフォリオ・技術ブログ。Works / Posts / Contact で構成。

https://ykts.net

## 技術選定

柔軟性と実装速度の両立を軸に選定。

| 領域 | 採用技術 | 選定理由 |
|---|---|---|
| フレームワーク | Astro | 静的出力を基本としつつ、後から動的な仕組みを追加できる。設計の方向が変わっても大きく作り直さずに済む |
| ホスティング | Cloudflare Pages | CDNエッジへの配信・Edge Functions・KVがひとつのエコシステムで完結 |
| スタイリング | Tailwind CSS | 設計の速度が上がる。ビルド出力も軽い |
| APIレイヤー | Hono | Edge Functions上で動く軽量ルーター |
| 検索 | Pagefind | ビルド時に静的インデックスを生成。ランタイム依存ゼロ |

## インフラ構成

```
Cloudflare Pages
  ├─ 静的出力 (SSG)
  └─ /api/*  ─ Edge Functions (Hono)
                  ├─ /api/contact  ─ Discord Webhook + Turnstile
                  └─ /api/status   ─ Cloudflare KV
```

## セットアップ

### 環境変数

| 変数名 | 説明 |
|---|---|
| `CONTACT_DISCORD_WEBHOOK_URL` | コンタクトフォーム用 Discord Webhook |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile シークレットキー |

### Cloudflare

1. Cloudflare Pages でプロジェクトを作成
2. KV ネームスペースを2つ作成し、`wrangler.jsonc` の `kv_namespaces` にIDを設定
3. 上記の環境変数を Pages ダッシュボードから追加

## 開発

```bash
npm install
npm run dev
```

## ライセンス

MIT — 初期ベース: [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by Chris Williams（大幅に改変）
