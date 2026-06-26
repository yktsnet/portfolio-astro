## 変更内容

APPROACH を dotfiles-public README の3本柱（ロールの分離 / 環境の同一化 / 機密の分離）の忠実な投影にし、IMPACT をナラティブ先行へ転換する。あわせて配色を About 基準（無彩色＋グリーン差し色）に揃え、本文の行間を締める。

### Approach.astro（全面差し替え）
- ラベルを `text-poi-accent` → `text-poi-muted`（About 基準に統一）
- 導入文を因果2段の文へ差し替え
- ロール3カードを `roles` 配列化し、mono キャプション `01 / …` と「なぜ」の地の文を追加
- カード枠 `dark:border-poi-accent/20` → `dark:border-poi-border/60`、hover `dark:hover:border-poi-accent/40` → `dark:hover:border-poi-border`
- 柱② フローを `flow` 配列化し CI 文言を `CI（nix flake check）で継続検証` に更新
- 柱③「機密の分離」を新規追加
- チーム適性 border `border-[#c792ea]/50` → `border-zinc-300 dark:border-poi-border`（紫撤去）
- 本文 `leading-8` → `leading-7`、ラッパー `space-y-5` → `space-y-4`

### Impact.astro（全面差し替え）
- ラベルを `text-poi-blue` → `text-poi-muted`（About 基準に統一）
- 導入段落をナラティブ2段落（経営者視点→課題→信頼→法人化伴走 / 使われ続ける仕組み→後付け自動化→UX定着）へ拡充
- 旧「補足テキスト」段落をナラティブに吸収して削除
- 数値・フローを `metrics` / `steps` 配列化
- 数値色 `dark:text-poi-blue` → `dark:text-poi-focus`（白）
- 全カード枠 `dark:border-poi-blue/20` → `dark:border-poi-border/60`、hover → `dark:hover:border-poi-border`
- フローアイコン `text-poi-blue` → `text-poi-accent`（緑）
- poi-blue を完全撤去（0件）

### About.astro（typography のみ局所修正）
- ラッパー `space-y-5` → `space-y-4`
- 本文段落2箇所 `leading-8` → `leading-7`

## 静的確認結果

`npm run typecheck` 実行結果: **0 errors, 0 warnings**（hints 12件は既存のもので今回の変更と無関係）

使用アイコン（message-circle / bot / user-check / arrow-right / github / external-link / id-card / table / calculator）はすべて既存の lucide.ts エントリ — 追加不要を確認済み。

```
git diff --name-only HEAD~1
src/components/About.astro
src/components/Approach.astro
src/components/Impact.astro
```

## 検証手順

- `npm run dev` で `/` を開き、APPROACH に3本柱（01/02/03）と機密の分離カードが出ること
- IMPACT が文章先行になり、青がどこにも残っていないこと（緑の差し色のみ）
- ラベル APPROACH / IMPACT が About と同じ白っぽい色であること
- 本文の行間が About 含め詰まっていること
