# CLAUDE.md

@context/conventions.md
@context/structure.md

## コマンド

```bash
npm run dev        # ローカル開発サーバー起動（http://localhost:4321）
npm run build      # ビルド（astro build + folio-agent-ingest で knowledge.json 生成）
npm run typecheck  # Astro / TypeScript 型チェック
npm run test       # Vitest でテスト一括実行
npm run test:watch # Vitest ウォッチモード
npm run sync-zenn  # Zenn 記事のスナップショット取得（zenn-snapshot.json）
```

単一テストを実行する場合:

```bash
npx vitest run src/lib/api.test.ts
```

## 検証手段

PR 前に `npm run typecheck` と `npm run test` を通す。実行確認が必要な検証は PR の `## 検証手順` に書いて user に委ねる。

## アーキテクチャの要点

### ページ描画とデータの流れ

`src/data/works.ts` がトップページ Works セクションのデータソース。Works の追加・変更はここだけを触れば反映される。

About・Approach・Impact の各セクションは `src/data/` を経由せず、`src/components/{About,Approach,Impact}.astro` 内にデータを直書きしている。これらの内容変更は各コンポーネントを編集する。

### アイコンシステム

**Lucide アイコン**（Works カードのアイコン、ナビゲーション等）:
- `src/lib/lucide.ts` に SVG パスを手動で列挙した独自サブセット
- 新しいアイコンを使う際は同ファイルにエントリを追加する（npm package は使わない）

**ブランドアイコン**（スタックタグの色付きロゴ）:
- `src/lib/brand-icons.ts` で `simple-icons` から必要なものだけ re-export
- 新しいブランドを追加する際は同ファイルに追記する

### 多言語

`src/lib/i18n.ts` が文言と言語判定を持ち、`LangToggle.astro` が切り替える。

### API レイヤー

Hono アプリを `src/lib/api.ts` に定義し、`src/pages/api/[...route].ts` がブリッジする。
Edge Functions として動作するため `prerender = false` を設定済み。
Cloudflare バインディング（KV・シークレット）は `c.env` 経由でのみアクセスする。
