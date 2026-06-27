## 変更内容

Impact セクションを縦タイムライン構成に再設計（Issue #48）。

- **上層：縦タイムライン（経歴の弧）** を新設
  - NFC勤怠キット納品 → オーナーの現場離脱 → 外部CTO・法人化伴走 の3ノード
  - 絶対配置の縦レール＋丸ノードを Tailwind ユーティリティのみで実装
  - 現在地ノード（3つ目）だけ `poi-accent` 色＋塗りつぶし丸で強調
  - 起点ノードに Works ページへの導線リンク（`arrow-right` アイコン使用）
- **下層：いま動いている戦線** として既存の3ストリームを再配置
  - `Stream` 型・`streams` 配列・`metric`・`repo` リンクはすべて現状維持
- **リード文** を1段落に圧縮（「機能を増やすより〜」の旧2段落目を削除）
- 新規ライブラリ・新規ファイルなし

## 静的確認結果

- `npm run typecheck`: **0 errors, 0 warnings** ✅
- `arrow-right` アイコン: `src/lib/lucide.ts` 8行目に存在を確認 ✅
- `Stream` 型・`streams` 配列・`metric`（月 −5h ／ 差異 −3〜4万）・`repo` リンク: 保持確認 ✅
- `import { getLucideIcon } from '../lib/lucide'` の caller 整合性: 既存の `Approach.astro` と同一パターン ✅

```
git diff --name-only HEAD~1
src/components/Impact.astro
```

## 検証手順

`npm run dev` でローカルサーバーを起動し、トップページの Impact セクションで以下を目視確認：
- 縦タイムライン（3ノード）が縦レール付きで表示される
- 3つ目のノード「外部CTOとして法人化を伴走」が accent 色＋塗りつぶし丸＋「現在」バッジで表示される
- 「Works — NFC勤怠」リンクが起点ノード下に表示され `/works/` へ遷移する
- 「いま動いている戦線」セクションに3ストリームが表示され、勤怠 DX の metric と GitHub リンクが確認できる
- ダークモード切り替えで配色が崩れないことを確認
