# portfolio-astro

ykts.net のポートフォリオサイト。Astro + Tailwind CSS + Cloudflare Pages 構成。

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

## 開発環境

- コード編集・git 操作はすべてローカル（WSL ubuntu）で行う
- `npm run dev` でローカル開発サーバー起動（http://localhost:4321）
- デプロイは Cloudflare Pages の自動デプロイ（main へのマージで発火）

## 静的チェック（Claude Code が使える手段）

| 対象 | コマンド |
|---|---|
| Astro / TypeScript 型チェック | `npm run typecheck` |
| import・caller 整合性 | コードを読んで確認（実行しない） |

実行確認が必要な検証は `## 検証手順` に書いて user に委ねる。

## 禁止事項

- `git push origin main` を実行しない（PR マージは user が行う）
- `git push --force` を実行しない
- Cloudflare の設定・シークレットを変更しない
