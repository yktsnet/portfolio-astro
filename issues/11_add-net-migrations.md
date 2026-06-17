## .NET 移行事例実績の追加および Training Scheduler リンク修正
id: 11
branch-slug: add-net-migrations
github_issue:
status: close
type: feat
対象: |
  src/data/works.ts
  src/lib/brand-icons.ts
  src/lib/lucide.ts
内容: |
  .NET 移行実績2件（Modernizationカテゴリ）の追加、および前回のマージで空になっていた Training Scheduler のリンク情報（Demo / GitHub）の追加を行います。

  1. Training Scheduler のリンク情報の追加
     - Demo: https://training-scheduler.ykts.net/
     - GitHub: https://github.com/yktsnet/training-scheduler

  2. Attendance System / WebForms の追加
     - Demo: https://webforms.ykts.net/
     - GitHub: https://github.com/yktsnet/attendance-system-migration
     - アイコン: clock
     - 技術スタック: C#, React, PostgreSQL

  3. Order System / WinForms の追加
     - Demo: https://winforms.ykts.net/
     - GitHub: https://github.com/yktsnet/order-system-migration
     - アイコン: shopping-cart
     - 技術スタック: LangGraph, Gemini API, C#, React

  4. 必要なブランドアイコン定義 (csharp, langgraph, gemini) および Lucide アイコン定義 (clock, shopping-cart) を追加します。
確認: |
  - works.ts 内の Training Scheduler に Demo/GitHub リンクが正しく追加されていること
  - works.ts 内に Attendance System / WebForms および Order System / WinForms が追加され、カテゴリが Modernization、color が #c792ea になっていること
  - 各実績の Demo/GitHub の遷移先URLが正しく設定されていること
  - brand-icons.ts / lucide.ts / works.ts (BrandKey) に csharp, langgraph, gemini / clock, shopping-cart が正しく追加されていること
  - npm run typecheck および npm run build がパスすること

---

## 設計メモ

### 1. works.ts のデータ更新

`src/data/works.ts` 内の実績データを更新・追加する。
- Training Scheduler の `links` を更新する。
- 2つの .NET 移行実績を `Modernization` カテゴリに追加する。カラーは紫 `#c792ea` とする。
- `BrandKey` に `csharp`, `langgraph`, `gemini` を追加する。

```typescript
// src/data/works.ts
export type BrandKey =
  // ... 既存定義
  | "go"
  | "vue"
  | "sqlite"
  | "csharp"
  | "langgraph"
  | "gemini"; // 追加
```

```typescript
// works.ts 内の実績データ

  // Training Scheduler のリンク情報を修正
  {
    category: "Modernization",
    title: "Training Scheduler",
    color: "#c792ea",
    icon: "graduation-cap",
    description:
      "社内研修のスケジュール管理と参加者調整を一元化した Web アプリ。\nVue + Go で構築し、SQLite をバックエンドに採用。",
    links: [
      { label: "Demo →", href: "https://training-scheduler.ykts.net/", external: true },
      { label: "GitHub", href: "https://github.com/yktsnet/training-scheduler", external: true },
    ],
    stack: [
      { label: "Vue", brand: "vue" },
      { label: "Go", brand: "go" },
      { label: "SQLite", brand: "sqlite" },
    ],
  },
  
  // 新規追加実績
  {
    category: "Modernization",
    title: "Attendance System / WebForms",
    color: "#c792ea",
    icon: "clock",
    description:
      "レガシーな WebForms 勤怠管理アプリを React + .NET 8 Web API に段階的移行。\nSignalR による打刻状況のリアルタイム監視機能を追加。",
    links: [
      { label: "Demo →", href: "https://webforms.ykts.net/", external: true },
      { label: "GitHub", href: "https://github.com/yktsnet/attendance-system-migration", external: true },
    ],
    stack: [
      { label: "C#", brand: "csharp" },
      { label: "React", brand: "react" },
      { label: "PostgreSQL", brand: "postgresql" },
    ],
  },
  {
    category: "Modernization",
    title: "Order System / WinForms",
    color: "#c792ea",
    icon: "shopping-cart",
    description:
      "レガシーな WinForms 発注システムを React + .NET 8 Web API に段階的移行。\n自然言語で在庫状況の照会や分析ができる AI エージェント機能を統合。",
    links: [
      { label: "Demo →", href: "https://winforms.ykts.net/", external: true },
      { label: "GitHub", href: "https://github.com/yktsnet/order-system-migration", external: true },
    ],
    stack: [
      { label: "LangGraph", brand: "langgraph" },
      { label: "Gemini API", brand: "gemini" },
      { label: "C#", brand: "csharp" },
      { label: "React", brand: "react" },
    ],
  },
```

### 2. ブランドアイコンの追加 (`src/lib/brand-icons.ts`)

`simple-icons` から `siCsharp`, `siLanggraph`, `siGooglegemini` をインポートしてマッピングに追加する。

```typescript
// src/lib/brand-icons.ts
import {
  // ... 既存インポート
  siCsharp,
  siLanggraph,
  siGooglegemini
} from "simple-icons";

const map: Record<string, BrandIcon> = {
  // ... 既存マッピング
  "csharp":           { path: siCsharp.path,           hex: siCsharp.hex },
  "langgraph":        { path: siLanggraph.path,        hex: siLanggraph.hex },
  "gemini":           { path: siGooglegemini.path,     hex: siGooglegemini.hex },
};
```

### 3. Lucide アイコンの追加 (`src/lib/lucide.ts`)

`clock`, `shopping-cart` アイコンの SVG パスを追加する。

```typescript
// src/lib/lucide.ts
const icons: Record<string, string> = {
  // ... 既存のアイコン
  "clock": `<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />`,
  "shopping-cart": `<circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />`,
};
```
