## 変更内容

全体的に文字が小さすぎるため、可読性を上げるサイズ調整を行った。
メタ情報・スタックタグは据え置き、コンテンツとして読む部分を引き上げた。

| 要素 | 変更前 | 変更後 |
|---|---|---|
| Builder ラベル（モバイル・デスクトップ） | `text-xs` | `text-sm` |
| bio テキスト（モバイル・デスクトップ） | `text-xs` | `text-sm` |
| Works h3 タイトル | `text-base` | `text-lg` |
| Works 説明文 | `text-xs` | `text-sm` |
| Works リンク | `text-xs` | `text-sm` |
| メタ情報（Osaka / ykts.net 等） | `text-xs` | — 据え置き |
| スタックタグ | `text-xs` | — 据え置き |

## 静的確認結果

- **Builder が text-sm で表示されること**: モバイル・デスクトップ両方 `text-sm text-poi-accent` に変更済み ✅
- **bio が text-sm で表示されること**: モバイル・デスクトップ両方 `text-sm leading-relaxed` に変更済み ✅
- **Works h3 が text-lg で表示されること**: `text-lg` に変更済み ✅
- **Works 説明文が text-sm で表示されること**: `text-sm leading-6` に変更済み ✅
- **Works リンクが text-sm で表示されること**: `font-mono text-sm` に変更済み ✅
- **メタ情報・スタックタグは text-xs のままであること**: モバイル行46・デスクトップ行113のメタ情報 div、スタックタグ span はいずれも `text-xs` のまま変更なし ✅
- **npm run typecheck が通ること**: 0 errors, 0 warnings ✅

## 検証手順

- `npm run dev` を起動し `http://localhost:4321` を開く
- Hero サイドバー（デスクトップ幅）で "Builder" ラベルと bio テキストが以前より一段大きく表示されること
- モバイル幅（sm 未満）でも同様に Builder / bio が大きくなること
- Works セクションの各カードで h3 タイトル・説明文・リンクボタンが一段大きくなること
- Osaka / ykts.net などのメタ情報とスタックタグが以前と同じサイズ（小さいまま）であること
