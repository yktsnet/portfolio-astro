## PR記録: feat: Works先頭にライブメトリクス帯を新設しブループリント詳説をカード群の下へ移動
issue: 37 (37_works-live-strip.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/64
Merged: 562dde6308a77ea281c9d43364403396536a34df

## 変更内容

`/`（Works）の1画面目にプロダクトカードが入るよう、SHARED INFRASTRUCTURE BLUEPRINT の詳説カードをカード群の下へ移動した。代わりに先頭へ1行のライブメトリクス帯（稼働日数・CPU・メモリ + 詳細へのアンカー）を置き、「動いている証拠」は先頭に残した。

- `src/components/HostingArchitecture.astro`: 見出し + リード文のみを残し、`LiveStatusStrip` を直後に配置。仕様表カード・SV6トグル・トグル用スクリプトは削除（`InfrastructureBlueprint.astro` へ移設）
- `src/components/InfrastructureBlueprint.astro`（新規）: 旧 `HostingArchitecture.astro` の仕様表カード（18–110行相当）とSV6トグル・トグル用スクリプトを内容無変更で移設。ルート `<section>` に `id="infrastructure"` を付与し、`mt-14 sm:mt-16` の上マージンでセクション間隔を確保
- `src/components/status/LiveStatusStrip.astro`（新規）: 1行のコンパクトな帯。稼働ドット + 「全デモ同居ホスト 稼働中」+ 稼働日数/CPU/メモリの3値 + 「設計の詳細 ↓」（`#infrastructure` アンカー）を表示。`GET /api/sv6-status` をクライアント側 fetch で取得し、`src/lib/sv6-status.ts` の既存ヘルパー（`uptimeDays` / `latestLoadPercent` / `latestAvailablePercent`）を再利用（新規ロジック追加なし）
- `src/pages/index.astro`: `InfrastructureBlueprint` を import し、`WorkCard` 一覧の直後に配置

ページ構成は「見出し+リード → ライブメトリクス帯 → WorkFilter+WorkCard群 → ブループリント詳説」の順になった。

## 静的確認結果

- `npm run typecheck`: 0 errors（既存の警告のみ、今回変更ファイルに起因するものなし）
- `npm run build`: 成功。`dist/index.html` を確認し、`#live-status-strip` → WorkFilter/カード群 → `<section id="infrastructure">`（SHARED INFRASTRUCTURE BLUEPRINT）の順で出力されていることを確認
- SV6StatusChart のトグル・fetch: `InfrastructureBlueprint.astro` に `#sv6-status-toggle` / `#sv6-status-panel` / `initSv6Toggle` スクリプトを内容無変更で移設しただけで、`SV6StatusChart.astro` 自体・`sv6-status:open` イベント配線・`/api/sv6-status` fetchロジックには一切手を加えていないことをコードを読んで確認。壊れていない
- `LiveStatusStrip.astro` の fetch失敗時挙動: `try/catch` で数値部分（`#live-status-metrics`、初期状態 `hidden`）を更新せず握りつぶすのみで、帯自体・`#infrastructure` へのアンカーは常に表示されるため、fetch失敗時・開発サーバー時（KV未接続で `/api/sv6-status` が500）もページ描画は壊れないことを確認
- `git diff --name-only HEAD~1`:
```
src/components/HostingArchitecture.astro
src/components/InfrastructureBlueprint.astro
src/components/status/LiveStatusStrip.astro
src/pages/index.astro
```

## 検証手順

- [ ] `npm run dev` でトップページ（`/`）を開き、デスクトップ幅（1280x800目安）の初回ビューポートで最初のカード先頭まで見えることを目視確認
- [ ] ライブメトリクス帯の「設計の詳細 ↓」リンクをクリックし、ページ下部の `#infrastructure`（SHARED INFRASTRUCTURE BLUEPRINT）へスクロールすることを確認
- [ ] 本番相当環境（KV接続あり）で稼働日数・CPU・メモリの数値が表示されることを確認（開発サーバーでは非表示のままで問題ない）
- [ ] `#infrastructure` 内の「ライブメトリクスを見る」トグルが従来どおり開閉し、SV6StatusChart のグラフが表示されることを確認
- [ ] ダーク/ライトモード双方でライブメトリクス帯の配色（ドット・テキスト・リンク）が既存トーンと違和感ないことを確認
