# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@context/conventions.md
@context/structure.md

## 担当分離

| 担当 | 作業 |
|---|---|
| WebChat | Issue 設計・仕様議論・ドキュメント作成 |
| Claude Code | コード編集・静的確認・git・PR 作成 |
| user | デプロイ確認・動作確認・マージ |

- WebChat の責務：`issues/` への Issue ファイル書き出しまで。検証手順は記述しない。
- Claude Code の責務：Issue を読んで実装し PR を出すまで。本番環境でのコマンド実行は行わない。
- 検証手順：Claude Code が PR の `## 検証手順` に記載。user が実施。

## コマンド

```bash
npm run dev        # ローカル開発サーバー起動（http://localhost:4321）
npm run build      # ビルド（astro build + pagefind インデックス生成）
npm run typecheck  # Astro / TypeScript 型チェック
npm run test       # Vitest でテスト一括実行
npm run test:watch # Vitest ウォッチモード
```

単一テストを実行する場合:

```bash
npx vitest run src/lib/api.test.ts
```

## 静的チェック（Claude Code が使える手段）

| 対象 | コマンド |
|---|---|
| Astro / TypeScript 型チェック | `npm run typecheck` |
| import・caller 整合性 | コードを読んで確認（実行しない） |

実行確認が必要な検証は `## 検証手順` に書いて user に委ねる。

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

### API レイヤー

Hono アプリを `src/lib/api.ts` に定義し、`src/pages/api/[...route].ts` がブリッジする。
Edge Functions として動作するため `prerender = false` を設定済み。
Cloudflare バインディング（KV・シークレット）は `c.env` 経由でのみアクセスする。

### 検索（Pagefind）

`npm run build` の中で `pagefind --site dist` を実行してインデックスを生成する。
開発サーバーでは検索インデックスが存在しないため Search コンポーネントは動作しない。

## Issue ワークフロー

- Issue ファイルは `issues/` に `{番号}_{slug}.md` で作成
- テンプレート: `issues/00_template.md`
- 完了した Issue は `issues/done/` に移動
- `status` フィールド: `draft` → `open` → `close`


