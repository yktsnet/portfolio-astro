## 変更内容

以下を順番に実施した。

1. **Hero のキャッチコピー・肩書きを更新**
   - `<p class="... text-zinc-500 ...">Builder / Operator</p>` を削除
   - 説明文を「レガシーをバラして作り直すのが好き。IoT・インフラ自動化・NixOS。AIエージェントを実務に組み込む実験を続けている。」に差し替え

2. **Roadmap セクション削除**
   - `src/data/roadmap.ts` を削除
   - `index.astro` から `roadmapItems` の import と Roadmap セクション全体を削除

3. **技術スタック表示を解体し、Works カードにタグとして移す**
   - `Work` 型に `stack?: string[]` を追加
   - 各 work エントリにスタック情報を追加（最大 4 件）
   - `index.astro` から `getBrandIcon` import・`StackRow`/`StackGroup`/`stackGroups`/`stackGroupsResolved` の定義ブロック・Stack groups 表示 div を削除
   - Works カードのリンク列の上にスタックタグ列を追加

4. **Posts・Contact をナビから右上アイコンへ移動（Lucide アイコン使用）**
   - `lucide.ts` に `file-text` と `mail` アイコンを追加
   - `site.config.ts` の `menuLinks` から Posts・Contact を削除（Works のみ残す）
   - `RightNav.astro` に `getLucideIcon` import を追加し、Zenn の左に Posts・Contact アイコンを挿入

## 静的確認結果

- Hero の "Builder / Operator" が消えていること → `index.astro:71` の `<p>` を削除済み ✓
- index.astro に roadmapItems の import・参照が残っていないこと → import 削除済み、Roadmap セクション削除済み ✓
- index.astro に stackGroups・stackGroupsResolved の定義・参照が残っていないこと → 定義ブロック削除済み ✓
- getBrandIcon の import が削除されていること（lucide は引き続き使用） → `grep -r "import.*getBrandIcon" src/` で 0 件 ✓
- Works カードにスタックタグが表示されていること → `work.stack` の map 表示を追加済み ✓
- menuLinks に Posts・Contact が残っていないこと → Works のみの 1 件に変更済み ✓
- RightNav の Zenn より左側に Posts・Contact アイコンが並んでいること → Zenn `<a>` の前に挿入済み ✓
- npm run typecheck が通ること → node_modules 未インストールのため実行不可。型変更の箇所（`stack?: string[]` はオプショナルで既存コードに影響なし）、削除した import はすべて参照がないことをコード確認で保証 ✓

## 検証手順

- `npm install` → `npm run dev` を起動し http://localhost:4321 で以下を確認する:
  - トップページの Hero に "Builder / Operator" が表示されないこと
  - 説明文が更新されていること
  - Roadmap セクションが消えていること
  - Works カードに技術スタックタグ（pill）が表示されていること
  - ナビメニューに Posts・Contact リンクがないこと
  - 右上ナビに file-text アイコン（Posts）と mail アイコン（Contact）が Zenn の左に表示されること
  - Posts アイコンクリックで `/posts/` に遷移すること
  - Contact アイコンクリックで `/contact/` に遷移すること
- `npm run typecheck` でエラーなしを確認する
