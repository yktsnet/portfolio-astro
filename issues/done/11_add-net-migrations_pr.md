## 変更内容

.NET 移行実績2件（Modernizationカテゴリ）の追加、および前回のマージで空になっていた Training Scheduler のリンク情報（Demo / GitHub）の追加を行います。

1. **Training Scheduler のリンク情報の追加**
   - Demo: https://training-scheduler.ykts.net/
   - GitHub: https://github.com/yktsnet/training-scheduler

2. **Attendance System / WebForms の追加**
   - Demo: https://webforms.ykts.net/
   - GitHub: https://github.com/yktsnet/attendance-system-migration
   - アイコン: clock
   - 技術スタック: C#, React, PostgreSQL

3. **Order System / WinForms の追加**
   - Demo: https://winforms.ykts.net/
   - GitHub: https://github.com/yktsnet/order-system-migration
   - アイコン: shopping-cart
   - 技術スタック: LangGraph, Gemini API, C#, React

4. **アイコン定義の追加**
   - brand-icons.ts: csharp（siDotnet を使用）, langgraph, gemini
   - lucide.ts: clock, shopping-cart

## 静的確認結果

- ✅ works.ts 内の Training Scheduler に Demo/GitHub リンクが正しく追加されている
- ✅ works.ts 内に Attendance System / WebForms および Order System / WinForms が追加され、カテゴリが Modernization、color が #c792ea になっている
- ✅ 各実績の Demo/GitHub の遷移先URLが正しく設定されている
- ✅ brand-icons.ts に csharp, langgraph, gemini が追加されている
- ✅ lucide.ts に clock, shopping-cart が追加されている
- ✅ works.ts の BrandKey に csharp, langgraph, gemini が追加されている
- ✅ `npm run typecheck` パス（0 errors）
- ✅ `npm run build` パス

**備考**: simple-icons に `siCsharp` が存在しないため、`siDotnet`（.NET アイコン）を csharp キーにマッピングしています。

## 検証手順

- `npm run dev` を起動し http://localhost:4321 で以下を確認:
  - トップページに Attendance System / WebForms と Order System / WinForms のカードが表示されること
  - 両カードのカテゴリが「Modernization」、色が紫（#c792ea）であること
  - Training Scheduler カードに「Demo →」「GitHub」リンクが表示されること
  - 各カードの Demo / GitHub リンクが正しい URL に遷移すること
  - 各カードにスタックタグ（ブランドアイコン付き）が表示されること
  - clock / shopping-cart アイコンがカードに正しく表示されること
