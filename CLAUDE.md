# CLAUDE.md

@context/conventions.md
@context/structure.md

Claude Code は本ファイルを最優先の指示として実行すること。

## 動作フロー
- 起動時に `issues/` 内の対象 Issue（`status: open`）を確認する。
- 実装開始前に `context/conventions.md` と `context/structure.md` を読み、規約と構造を把握する。
- ローカル環境にて `claude/{id}-{branch-slug}` ブランチ上で作業していることを認識する。
- 実装・検証・PR 作成はグローバルの `pr-workflow` スキル（`~/.claude/skills/pr-workflow/SKILL.md`）の手順に従う。
- 実行者は Issue を読んで実装し PR を出すまでが担当。デプロイ確認・動作確認・マージは user が実施し、検証手順は PR の `## 検証手順` に記載する。

## コマンド

```bash
npm run dev        # ローカル開発サーバー起動（http://localhost:4321）
npm run build      # ビルド（astro build + folio-agent-ingest で knowledge.json 生成）
npm run typecheck  # Astro / TypeScript 型チェック
npm run test       # Vitest でテスト一括実行
npm run test:watch # Vitest ウォッチモード
```

単一テストを実行する場合:

```bash
npx vitest run src/lib/api.test.ts
```

## 検証手段

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

## Issue ワークフロー

- Issue ファイルは `issues/` に `{番号}_{slug}.md` で作成
- テンプレート: `issues/00_template.md`
- 完了した Issue は `issues/done/` に移動
- `status` フィールド: `draft` → `open` → `close`


