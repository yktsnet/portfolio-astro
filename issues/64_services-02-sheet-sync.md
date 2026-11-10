## Add the sheet-sync offering to service 02 once mgmt-kit runs it
id: 64
branch-slug: services-02-sheet-sync
status: open
type: feat
対象: src/data/services.ts, src/data/cases.ts, src/pages/index.astro, src/pages/services/ai-development.astro, src/components/services/DiagramAiDevelopment.astro
目的: サービス02の名前は「開発組織の採用・育成・評価」に広げたが、マネジメント側が使い慣れた表計算やドライブのまま採用と評価の状況を一元化する仕組みは、まだサイトに載せていない。`mgmt-kit` に実装して運用が始まったら、提供内容と見出しと導入例に足す。
前提: `mgmt-kit` に、表計算やドライブのファイルの変更を読み取ってウェブアプリへ反映する仕組みを入れる（`excel-kanri` の監視の考え方を下敷きにする）。誰がどの評価で、採用がどこまで進んでいるかを1か所で見られるようにする。この実装は `mgmt-kit` 側の作業で、本 Issue の対象外。
内容:
- `services.ts` のサービス02に、4つ目の提供内容のカードを足す（表計算やドライブのまま、採用と評価の状況を一元化する）
- トップの Services の見出しを、01 と 02 に共通するやり方から語る形に替える（叩き台：「使い慣れたExcelや紙は、そのままでいい。事務も、開発組織の採用・育成・評価も、裏側でつなぐ。」）
- 02 の結果が書けるようになったら、`cases.ts` に導入例を足す。トップの帯は `cases` を順に並べるので、2本目がそのまま出る
- 詳細ページ（`ai-development.astro`）の提供できること・進め方・合う現場と、簡易図を新しい提供内容に合わせる
対象外: `mgmt-kit` の実装そのもの。About の見出しの見直し。サービス02の slug と kicker の変更。
仮定: 02 の導入例に載せる数字は、運用が始まってから決める
確認:
- `npm run typecheck` と `npm run test` が通る
- トップのサービス02のカードに提供内容が4つ並び、4つ目のリンク先が `mgmt-kit` を指す
- トップの Services の見出しが、01 と 02 のどちらの説明とも食い違わない
- `cases.ts` に 02 を足した場合、トップに帯が2本並び、2本目のリンクが `/services/ai-development/#case` へ飛ぶ
人が見るもの: 4つ目のカードと見出しの言い回し。02 の導入例にどの数字を出すか。
