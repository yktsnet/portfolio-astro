## bt-dynamic を Works に追加

id: 48
branch-slug: add-bt-dynamic
github_issue: 99
status: close
type: feat
対象: |
  src/data/works.ts（worksへの追加）
  src/lib/lucide.ts（trending-up-downアイコンの追加）
内容: |
  公開済み https://github.com/yktsnet/bt-dynamic を Works セクションに追加する。
  isMini: false、priority 2、色は #addb67 グループ（NFC Attendance Kit / Cat Feed Trackerと同じ「実用度の高いOSS」扱い）。
確認: |
  npm run typecheck
---

## 追加内容

`src/data/works.ts` の `works` 配列に以下を追加する。

```ts
{
  categoryTags: ["trading", "pip"],
  isOSS: true,
  priority: 2,
  title: "bt-dynamic",
  color: "#addb67",
  icon: "trending-up-down", // src/lib/lucide.tsに未登録。追加が必要
  publishedAt: "2026.07",
  description:
    "静的バックテストは相場環境が変われば共倒れする。相場を9セル（トレンド強度×ボラティリティ）に分類し、セルごとに順張り/逆張り/ノーポジを切り替える動的レジーム切替を、分類→判定→検証まで通して実装。",
  rationale:
    "セル対応表の本番値・閾値の実数は設定JSONの外部注入とし、パッケージにもリポにも存在しない構造的分離で守秘した。本番側リポ(ops_dynamic)はこのコアをimportするだけの実利用者として別立て。",
  links: [
    { label: "GitHub →", href: "https://github.com/yktsnet/bt-dynamic", external: true },
    { label: "PyPI", href: "https://pypi.org/project/bt-dynamic/", external: true },
  ],
  stack: [
    { label: "Python", brand: "python" },
    { label: "pandas" },
    { label: "PyPI" },
  ],
},
```

## 作業手順

1. `src/lib/lucide.ts` に `trending-up-down` アイコンのSVGパスを追加する（Lucideの公式SVGから該当パスを取得）
2. `src/data/works.ts` の `works` 配列に上記オブジェクトを追加する
3. `brand: "python"` は `src/lib/brand-icons.ts` に既に登録済み。`pandas` / `PyPI` はbrandなしのlabelのみで良い（既存のAzure等と同じ扱い）

## 選定根拠（実装者向け補足）

- `categoryTags`: `trading` はTrading Labと同じ切り口。`pip` はPyPI配布であることを明示するため採用（`CATEGORIES` に既に定義済み、weight=2でoffice等と同格）。`npm` のFolio Agentと対になる位置づけ。
- `color`/`priority`/`isMini`: `#89ddff`（Trading Lab/Folio Agent/Excel Kanriの新規OSS/miniグループ）ではなく、`#addb67`（NFC Attendance Kit/Cat Feed Trackerの「実用度の高いOSS」グループ）を採用。ただしbt-dynamicは自分の本番運用（ops_dynamic、非公開）を明言できないため、他2件と異なり `inUse` フラグは付けない。
- `isMini`: 付けない（false扱い＝キー自体を省略）。Trading Lab/Folio Agent/Excel Kanriのminiグループとは別系統とする判断のため。
- `links`: デモページは無い（ライブラリ配布のため）。GitHub→とPyPIの2本のみ。
- `inUse`: 付けない（本番非公開のため明言不可）。
