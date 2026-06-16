## 変更内容

モバイル（sm: 未満）のみに影響する表示調整。PC 側は変えない。

1. **bio テキスト改行**: 1文目「レガシーをバラして作り直すのが好き。」の後にモバイルのみ改行
   → `<br class="sm:hidden" />` を挿入

2. **メタ情報横並びの改行**: GitHub リンクの直後にモバイルのみ強制改行（Osaka / ykts.net / GitHub | 2025〜 / Post / Contact の2行に）
   → `<span class="w-full sm:hidden" />` を挿入して flex 折り返しを強制

3. **Works 説明文の line-clamp 解除**: モバイルで `line-clamp-2` を解除し全文表示
   → `line-clamp-2` → `line-clamp-none sm:line-clamp-2`

## 静的確認結果

- **bio 改行**: モバイル Hero 内 `<p>` に `<br class="sm:hidden" />` を挿入。sm 以上では非表示になるため PC に影響なし ✅
- **メタ情報改行**: GitHub `<a>` 直後に `<span class="w-full sm:hidden" />` を追加。`w-full` が flex コンテナ内で残りを次行に折り返し、`sm:hidden` で PC では非表示（かつ親 `div.sm:hidden` ですでに隠れているため二重安全）✅
- **line-clamp 解除**: `line-clamp-none sm:line-clamp-2` により、モバイルでは制限なし・PC(sm以上)では2行クリップ ✅
- **import・caller 整合性**: 新規 import なし。既存クラス・要素のみ使用 ✅
- **npm run typecheck**: 0 errors ✅

## 検証手順

`npm run dev` を起動し http://localhost:4321 で以下を確認する。

### モバイル幅（< 640px）での確認

1. **bio 改行**: 「レガシーをバラして作り直すのが好き。」の後で改行され、「IoT・インフラ自動化・NixOS。AIエージェントを...」が2行目に続くこと
2. **メタ情報2行化**: メタ情報が「Osaka / ykts.net / GitHub」「2025〜 / Post / Contact」の2行に分かれること
3. **Works 説明文全文表示**: Works 各カードの説明文が `...` で切れず全文表示されること

### PC 幅（640px 以上）での確認

1. **bio**: 改行なしで1段落のまま表示されること
2. **メタ情報**: 縦並びのまま変化なし
3. **Works 説明文**: 2行クリップ（`line-clamp-2`）が維持されること
