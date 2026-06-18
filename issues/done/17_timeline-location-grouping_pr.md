## 変更内容
タイムラインのデータ構造をフラットな配列から `LocationGroup[]` に変更し、`@Location` 見出し＋縦線でイベントをグルーピングする表示に書き換えた。

- データ: `{ year, label, location }[]` → `{ location, items: { year, label }[] }[]`
- 表示: フラット横並び → `@Kyoto` / `@Osaka` の見出し付き、`border-l` 縦線でまとめるレイアウト
- 拠点追加時は `timeline` 配列に `LocationGroup` を追加するだけで対応可能

## 静的確認結果
- `npm run typecheck`: 0 errors（既存の hints/warnings のみ、本変更に起因するものなし）
- import・型整合性: `TimelineEntry` / `LocationGroup` 型をコンポーネント内で定義し、`timeline` 配列に型注釈を付与。テンプレート側の destructuring も型に合致

## 検証手順
- `npm run dev` を起動し http://localhost:4321 の About セクションを確認
  - `@Kyoto` 見出しの下に縦線で 2013 / 2019 の 2 件がグルーピングされている
  - `@Osaka` 見出しの下に縦線で 2025〜 の 1 件が表示されている
  - ダークモード・ライトモード両方で縦線（`border-zinc-600`）が視認できる
