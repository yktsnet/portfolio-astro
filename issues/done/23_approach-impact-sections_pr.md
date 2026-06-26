## 変更内容

About と Works の間に APPROACH・IMPACT の2セクションを新設する。
履歴書（resume.md）を正とし、サイトが表現すべき主軸をセクションとして具体化する。
Poimandres テーマ（poi-* トークン）はそのまま維持。

### APPROACH セクション
- ラベル `APPROACH`（poi-accent）+ 見出し「AIエージェントを、開発プロセスに組み込む基盤。」
- ロール分離 Bento Grid（3列：設計 / 実装 / 検証、Lucide アイコン付き）
- 環境基盤フローステップ（Nix Flakes → CI → Claude Code / Jules、矢印つなぎ）
- `dotfiles-public` への OSS リンクボタン（GitHub + external-link アイコン）
- チーム適性の補足テキスト（border-left #c792ea）

### IMPACT セクション
- ラベル `IMPACT`（poi-blue）+ 見出し「マンション管理会社の外部CTOとして、現場のDXを推進。」
- 数値メトリクスカード 2列（~5h 工数削減 / 3〜4万 申告差異抑制）
- 補足テキスト（NFC 打刻 → スプレッドシート自動同期 → 給与計算自動化）
- 勤怠 DX フロー図解（3列 Bento：NFC 打刻 / スプレッドシート同期 / 給与計算自動化）

### その他変更
- `About.astro`: `id="about"` 付与、「人間中心に設計する〜」段落を削除
- `index.astro`: Approach / Impact コンポーネントを About と Works の間に挿入、Works ヘッダに `id="works"` 付与
- `HeroDesktop.astro`: ページ内アンカーナビ（About / Approach / Impact / Works）を外部リンク群の上に追加
- `lucide.ts`: `message-circle` / `bot` / `user-check` / `external-link` / `table` / `calculator` / `arrow-right` / `github` の 8 アイコンを追加

## 静的確認結果

### コードレビュー（import・caller 整合性）
- `Approach.astro` / `Impact.astro` で使用するアイコン名（`message-circle`, `bot`, `user-check`, `external-link`, `table`, `calculator`, `arrow-right`, `github`, `id-card`）はすべて `src/lib/lucide.ts` に登録済みであることを確認
- `index.astro` の `import Approach from '../components/Approach.astro'` および `import Impact from '../components/Impact.astro'` のパスはファイル実体と一致
- `getLucideIcon` の呼び出しは既存の型シグネチャ `(name: string): string` と整合

### npm run typecheck
```
Result (31 files): 0 errors, 0 warnings, 12 hints
```
（hints は変更前から存在する既存の無関係な指摘のみ）

### git diff --name-only HEAD~1
```
src/components/About.astro
src/components/Approach.astro
src/components/HeroDesktop.astro
src/components/Impact.astro
src/lib/lucide.ts
src/pages/index.astro
```

## 検証手順

1. `npm run dev` で開発サーバーを起動（http://localhost:4321）
2. トップページを開き、以下を確認:
   - About → Approach → Impact → Works の順でセクションが表示される
   - APPROACH: ロール分離 Bento（設計/実装/検証）、フロー3ステップ、OSS リンクボタン、補足テキストが表示される
   - IMPACT: 数値メトリクス（~5h / 3〜4万）、補足テキスト、フロー図解（NFC打刻/スプレッドシート/給与）が表示される
   - About セクションから「人間中心に設計する〜」段落が削除されている
3. デスクトップ幅でサイドバーに About / Approach / Impact / Works のアンカーリンクが表示され、クリックで対象セクションへスクロールすることを確認
4. アンカーリンクの下に区切り線があり、GitHub / Posts / Contact リンクが続くことを確認
5. ダークモードでカラートークン（poi-accent / poi-blue）が正しく表示されることを確認
6. `npm run build` でビルドエラーがないことを確認
