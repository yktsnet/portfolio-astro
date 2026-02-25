---
title: "Initial setup and configuration"
description: "プロジェクトの初期セットアップとTailwind CSS、フォント、テーマ設定について"
publishDate: "23 Feb 2026"
tags: ["astro", "tailwind"]
---

## セットアップ手順

Astroプロジェクトの作成からデプロイまでの流れを記録します。

### Tailwind CSS

`@astrojs/tailwind` インテグレーションを使用。ダークモードは `class` ベースで制御しています。

```js
// tailwind.config.mjs
export default {
  darkMode: 'class',
  // ...
};
```

### フォント

コードブロックには **Fira Code** を採用しました。リガチャ対応のモノスペースフォントで、コードの可読性が向上します。

## 次のステップ

- コンテンツコレクションの構築
- RSS フィードの実装
- タグシステムの導入
