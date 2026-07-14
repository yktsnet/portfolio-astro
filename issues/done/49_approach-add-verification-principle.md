## PR記録: feat: Approach に第4の判断基準「生成より、検証」を追加する
issue: 49 (49_approach-add-verification-principle.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/101
Merged: 640f5506ec75b6ac5b94ceacec4e47cfef6de3cd

## 変更内容
Approach セクションに判断基準「生成より、検証」を追加した。挿入位置は現02（自動より、制御）の直後で、既存の「機能より、安定」は04に繰り下がった。AIとの開発における正しさの担保（保証はuserが承認し、テストの実装はAIに任せ、破られれば機械が検知する）を、非開発者にも読める形で語る内容。

- principles 配列に新項目を挿入（本文2段落は user 承認済みの確定稿をそのまま使用）
- flow03（新規、3ステップ、accent なし）を追加し、旧 flow03（機能より、安定）は flow04 にリネーム
- proofs に dotfiles-public の test-policy.md へのリンクを追加
- ファイル内コメント「3つの判断基準」を「4つの判断基準」に更新
- 既存3項目の見出し・本文・フロー図・証跡リンクの内容は変更なし（番号のみ配列順で自動的に変わる）

## 保証
- 新規: Approach セクションに判断基準が4つ、01〜04の番号で表示される → 対応テストなし（表示コンテンツの変更。担保は typecheck と user のブラウザ目視）
- 新規: 3番目に「生成より、検証」が入り、既存の「機能より、安定」は04として従来と同内容のまま表示される → 対応テストなし（同上）
- 維持: 既存3項目の見出し・本文・フロー図・証跡リンクの内容は変えない（番号のみ変わる） → コードレビューで確認（body・flow・proofs の文言を変更していないことを diff で確認済み）
- 維持: フロー図・証跡リンクの既存の見た目（レイアウト・配色規則）は変えない → テンプレート（.astro のマークアップ部分）は無変更

## 静的確認結果
- npm run typecheck: 0 errors / 0 warnings（Approach.astro に起因する diagnostics なし、既存の他ファイルの warning のみ）
- npm run test: 10 passed（既存テストに Approach.astro を対象にしたものはなし）
- import・caller 整合性: Approach.astro を import しているのは pages 側のみで、シグネチャ（export なし、default export のコンポーネントとしての使用法）に変更なし。principles 配列・flow 定数はファイル内で完結しており外部からの参照なし
- git diff --name-only --cached: src/components/Approach.astro（issue の対象と完全一致）
- docs/guarantees.md: リポジトリに存在せず、保証台帳の更新は対象外

## 検証手順
1. `npm run dev` でローカルサーバーを起動し、`/approach/` にアクセスする
2. 判断基準が01〜04の4項目、番号順に表示されていることを確認する
3. 3番目「生成より、検証」の本文2段落とフロー図（人が決める → AIが書く → 機械が見張る、全ステップ非accentのフラット表示）を目視確認する
4. 3番目の証跡リンクが `dotfiles-public — test-policy` として `https://github.com/yktsnet/dotfiles-public/blob/main/docs-agents/test-policy.md` に外部リンクとして張られていることを確認する
5. 4番目「機能より、安定」が既存と同内容・同見た目で表示されていることを確認する
