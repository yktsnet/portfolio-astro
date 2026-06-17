## カテゴリ構成の整理と Training Scheduler の追加
id: 10
branch-slug: category-and-work-update
github_issue:
status: close
type: feat
対象: |
  src/data/works.ts
  src/pages/index.astro
  src/lib/brand-icons.ts
  src/lib/lucide.ts
内容: |
  実績カテゴリ構成の整理と、新規実績「Training Scheduler」の追加を行う。
  1. カテゴリ名の変更: Platform から Finance に変更 (Trading Lab の所属カテゴリ変更を含む)
  2. NFC Attendance System を Modernization から Hardware カテゴリに移動し、カラーを `#addb67` (緑) に変更
  3. カテゴリ表示順序を Hardware ➔ Modernization ➔ Finance に変更
  4. 新規実績「Training Scheduler」を Modernization カテゴリ (カラー `#c792ea`) に追加
  5. 必要なアイコン定義 (graduation-cap / go, vue, sqlite) を追加
確認: |
  - index.astro の categoryOrder が ["Hardware", "Modernization", "Finance"] になっていること
  - works.ts 内で NFC の category が Hardware になり、color が #addb67 になっていること
  - works.ts 内に Training Scheduler が追加され、カテゴリが Modernization、color が #c792ea になっていること
  - brand-icons.ts / lucide.ts / works.ts (BrandKey) に go, vue, sqlite / graduation-cap が正しく追加されていること
  - npm run typecheck および npm run build がパスすること

---

## 設計メモ

### 1. カテゴリ順序と整理

`src/pages/index.astro` 側のカテゴリ表示順序を変更する。
```astro
// src/pages/index.astro
const categoryOrder = ["Hardware", "Modernization", "Finance"];
```

### 2. works.ts のデータ更新

`src/data/works.ts` 内の実績データを更新・追加する。
- NFC Attendance System のカテゴリを `Hardware`、カラーを `#addb67` に変更する。
- Trading Lab のカテゴリを `Finance` に変更する。
- Training Scheduler を `Modernization` カテゴリに追加する。カラーは紫 `#c792ea` とする。
- `BrandKey` に `go`, `vue`, `sqlite` を追加する。

```typescript
// src/data/works.ts
export type BrandKey =
  | "raspberry-pi"
  | "cloudflare"
  | "nixos"
  | "espressif"
  | "python"
  | "astro"
  | "hono"
  | "react"
  | "fastapi"
  | "postgresql"
  | "googleappsscript"
  | "line"
  | "go"
  | "vue"
  | "sqlite";
```

### 3. ブランドアイコンの追加 (`src/lib/brand-icons.ts`)

`simple-icons` から `siGo`, `siVuedotjs`, `siSqlite` をインポートしてマッピングに追加する。

```typescript
// src/lib/brand-icons.ts
import {
  // ... 既存インポート
  siGo,
  siVuedotjs,
  siSqlite
} from "simple-icons";

const map: Record<string, BrandIcon> = {
  // ... 既存マッピング
  "go":               { path: siGo.path,               hex: siGo.hex },
  "vue":              { path: siVuedotjs.path,          hex: siVuedotjs.hex },
  "sqlite":           { path: siSqlite.path,           hex: siSqlite.hex },
};
```

### 4. Lucide アイコンの追加 (`src/lib/lucide.ts`)

`graduation-cap` アイコンの SVG パスを追加する。

```typescript
// src/lib/lucide.ts
const icons: Record<string, string> = {
  // ... 既存のアイコン
  "graduation-cap": `<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />`,
};
```
