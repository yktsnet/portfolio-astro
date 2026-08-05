import type { MultilingualText } from "../lib/i18n";

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
  | "sqlite"
  | "csharp"
  | "langgraph"
  | "gemini"
  | "pypi"
  | "pandas"
  | "zenn"
  | "docker";

export type StackItem = { label: string; brand?: BrandKey };

/**
 * カテゴリ定義の一元管理。
 * - icon: 表示に使う Lucide アイコン名
 * - weight: 並びの強弱（小さいほど強い）。ai/iot/modernization=1、webui=3、未定義は DEFAULT_CATEGORY_WEIGHT
 * Work.categoryTags は内部用の全カテゴリ（4つ以上可）。表示は displayCategoryTags で重み順・最大3つに絞る。
 */
const DEFAULT_CATEGORY_WEIGHT = 2;

export const CATEGORIES: Record<string, { icon: string; weight: number }> = {
  iot: { icon: "wifi", weight: 1 },
  modernization: { icon: "refresh-cw", weight: 1 },
  office: { icon: "briefcase", weight: DEFAULT_CATEGORY_WEIGHT },
  chatbot: { icon: "message-circle", weight: DEFAULT_CATEGORY_WEIGHT },
  trading: { icon: "trending-up", weight: DEFAULT_CATEGORY_WEIGHT },
  package: { icon: "wrench", weight: DEFAULT_CATEGORY_WEIGHT },
};

/** カテゴリのアイコン名を返す（未定義は汎用 "tag"）。 */
export function getCategoryIcon(tag: string): string {
  return CATEGORIES[tag]?.icon ?? "tag";
}

/** カテゴリの重みを返す（未定義は DEFAULT_CATEGORY_WEIGHT）。 */
function getCategoryWeight(tag: string): number {
  return CATEGORIES[tag]?.weight ?? DEFAULT_CATEGORY_WEIGHT;
}

/**
 * 表示用カテゴリを最大3つに絞る。
 * 重み昇順（強い順）→ 同点はアルファベット順 → 先頭3つ。
 * カードは内部に4つ以上のカテゴリを持てるが、表示は強い3つに限定される。
 */
export function displayCategoryTags(tags: string[]): string[] {
  return [...tags]
    .sort(
      (a, b) =>
        getCategoryWeight(a) - getCategoryWeight(b) || a.localeCompare(b),
    )
    .slice(0, 3);
}

export type Work = {
  categoryTags: string[];
  isOSS: boolean;
  priority: number;
  title: string;
  color: string;
  icon: string;
  postSlug?: string;
  description: MultilingualText;
  /** 現場に導入・稼働中なら true */
  inUse?: boolean;
  /** 公開年月。表記は "2024.08" のようなドット区切り。 */
  publishedAt?: string;
  links: { label: string; href: string; external?: boolean }[];
  stack?: StackItem[];
};

export const works: Work[] = [
  {
    categoryTags: ["iot", "office"],
    isOSS: true,
    priority: 1,
    title: "NFC Attendance Kit",
    color: "#addb67",
    icon: "id-card",
    postSlug: "nfc-attendance-system",
    publishedAt: "2026.01",
    description: {
      ja: "NFC カードをかざすだけで打刻が完結し、Google スプレッドシートへ自動集計。Python 標準ライブラリのみで構成し、Raspberry Pi 2 や旧 PC でも依存ゼロで動く。",
      en: "Automated attendance tracking by tapping NFC cards, logging directly to Google Sheets. Built using only the Python standard library with zero dependencies, running seamlessly even on Raspberry Pi 2 or old PCs.",
    },
    inUse: true,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/nfc-attendance-kit",
        external: true,
      },
      {
        label: "Zenn",
        href: "https://zenn.dev/yktsnet/articles/202604-nfc-attendance-raspberry-pi-2",
        external: true,
      },
    ],
    stack: [
      { label: "Raspberry Pi", brand: "raspberry-pi" },
      { label: "Python", brand: "python" },
      { label: "GAS", brand: "googleappsscript" },
    ],
  },
  {
    categoryTags: ["iot", "chatbot"],
    isOSS: true,
    priority: 2,
    title: "Cat Feed Tracker",
    color: "#addb67",
    icon: "cat",
    postSlug: "cat-feed-tracker",
    publishedAt: "2026.03",
    description: {
      ja: "給餌棚の開閉を自動検知し、LINE で家族へ定時通知する家庭向け IoT。Pico W → FastAPI → PostgreSQL 構成で、体重管理や設定変更まで LINE から完結。",
      en: "Home IoT system detecting feeding cabinet opening/closing and sending scheduled LINE notifications to family members. Powered by Pico W → FastAPI → PostgreSQL, with weight tracking and configuration manageable via LINE.",
    },
    inUse: true,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/cat-feed-tracker",
        external: true,
      },
      {
        label: "Zenn",
        href: "https://zenn.dev/yktsnet/articles/202604-cat-feed-tracker",
        external: true,
      },
    ],
    stack: [
      { label: "Pico W", brand: "raspberry-pi" },
      { label: "LINE API", brand: "line" },
      { label: "FastAPI", brand: "fastapi" },
      { label: "PostgreSQL", brand: "postgresql" },
    ],
  },
  {
    categoryTags: ["office"],
    isOSS: true,
    priority: 2,
    title: "Training Scheduler",
    color: "#a6accd",
    icon: "graduation-cap",
    publishedAt: "2026.05",
    description: {
      ja: "機械的な進捗管理ではなく、新人の手応えをメンターと共有する研修支援ツール。Vue + Go を go:embed で単一バイナリに固め、SQLite のみでインフラ依存ゼロ。",
      en: "Mentorship-focused training support tool for sharing newcomer feedback instead of mechanical progress tracking. Vue + Go bundled into a single binary via go:embed, requiring zero infrastructure dependencies with SQLite.",
    },
    inUse: true,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/training-scheduler",
        external: true,
      },
    ],
    stack: [
      { label: "Go", brand: "go" },
      { label: "Vue", brand: "vue" },
      { label: "SQLite", brand: "sqlite" },
    ],
  },
  {
    categoryTags: ["modernization", "chatbot", "office"],
    isOSS: true,
    priority: 1,
    title: "Order System",
    color: "#c792ea",
    icon: "shopping-cart",
    publishedAt: "2026.05",
    description: {
      ja: "WinForms の密結合を解体し、.NET 10 Web API + React へ段階的移行。LangGraph を独立追加し、自然言語で在庫・売上を照会できる AI エージェントを統合。",
      en: "Gradual migration from tightly coupled WinForms to .NET 10 Web API + React. Integrates an independent LangGraph AI agent for querying inventory and sales using natural language.",
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/order-system-migration",
        external: true,
      },
    ],
    stack: [
      { label: "LangGraph", brand: "langgraph" },
      { label: "Gemini API", brand: "gemini" },
      { label: "C#", brand: "csharp" },
      { label: "React", brand: "react" },
    ],
  },
  {
    categoryTags: ["chatbot", "office"],
    isOSS: true,
    priority: 1,
    title: "Order System RAG",
    color: "#c792ea",
    icon: "book-search",
    publishedAt: "2026.06",
    description: {
      ja: "SQL は集計に強いが自由記述に答えられず、RAG はその逆で文面の根拠は示せても集計はできない。帳票 PDF を Azure AI Document Intelligence で構造化し、LangGraph が質問を判定して SQL / RAG へ自動で振り分ける。",
      en: "Combines SQL aggregation and RAG document search. Structures form PDFs via Azure AI Document Intelligence, using LangGraph to classify questions and route them automatically to SQL or RAG engines.",
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/order-system-rag",
        external: true,
      },
    ],
    stack: [
      { label: "LangGraph", brand: "langgraph" },
      { label: "Gemini API", brand: "gemini" },
      { label: "Azure" },
      { label: "FastAPI", brand: "fastapi" },
    ],
  },
  {
    categoryTags: ["modernization", "office"],
    isOSS: true,
    priority: 1,
    title: "Attendance System",
    color: "#c792ea",
    icon: "clock",
    publishedAt: "2026.05",
    description: {
      ja: "AutoPostBack・ViewState を解体し、.NET 10 Web API + React へ段階的移行。SignalR を追加し、WebForms では不可能だったリアルタイム打刻監視を実装。",
      en: "Step-by-step modernization of legacy WebForms to .NET 10 Web API + React by eliminating AutoPostBack and ViewState. Adds SignalR for real-time attendance monitoring.",
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/attendance-system-migration",
        external: true,
      },
    ],
    stack: [
      { label: "C#", brand: "csharp" },
      { label: "SignalR" },
      { label: "React", brand: "react" },
      { label: "PostgreSQL", brand: "postgresql" },
    ],
  },
  {
    categoryTags: ["chatbot", "package"],
    isOSS: true,
    priority: 1,
    title: "Folio Agent",
    color: "#89ddff",
    icon: "bot",
    publishedAt: "2026.07",
    description: {
      ja: "開発者ポートフォリオ向けに、ビルド時自動同期で知識更新を不要にした受付チャットボット。Zenn 記事の取り込みや Contact への誘導は、設定のオンオフだけで手軽に切り替えられる。",
      en: "Reception chatbot widget for developer portfolios with zero-maintenance build-time knowledge synchronization. Features easy toggling for Zenn article ingestion and contact routing.",
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/folio-agent",
        external: true,
      },
      {
        label: "npm",
        href: "https://www.npmjs.com/package/@folio-agent/widget",
        external: true,
      },
    ],
    stack: [
      { label: "LangGraph", brand: "langgraph" },
      { label: "Gemini API", brand: "gemini" },
      { label: "Cloudflare", brand: "cloudflare" },
    ],
  },
  {
    categoryTags: ["office"],
    isOSS: true,
    priority: 2,
    title: "Excel Kanri",
    color: "#89ddff",
    icon: "user-pen",
    publishedAt: "2026.07",
    description: {
      ja: "既存の Excel 帳票運用を壊さずに、Web フォーム生成・共有フォルダの PDF 自動変換・全文検索を後付け。clone して使う汎用モジュール群 + FastAPI/React リファレンス実装。",
      en: "Retrofit web forms, shared folder PDF conversion, and full-text search without breaking existing Excel workflows. Provides cloneable modules with a FastAPI/React reference implementation.",
    },
    inUse: true,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/excel-kanri",
        external: true,
      },
    ],
    stack: [
      { label: "Python", brand: "python" },
      { label: "FastAPI", brand: "fastapi" },
      { label: "SQLite", brand: "sqlite" },
      { label: "Docker", brand: "docker" },
    ],
  },
  {
    categoryTags: ["trading"],
    isOSS: true,
    priority: 2,
    title: "bt-lab",
    color: "#addb67",
    icon: "flask-conical",
    publishedAt: "2026.07",
    description: {
      ja: "複数戦略候補を横断的に検証し、エントリー率・ドローダウン・Recovery Factorでランキングする8段のバックテスト探索パイプライン。単一戦略の過剰最適化を避け、崩れない戦略候補を継続選抜する。",
      en: "An 8-stage backtest exploration pipeline ranking multi-strategy candidates by entry rate, drawdown, and Recovery Factor to avoid single-strategy overfitting.",
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/bt-lab",
        external: true,
      },
    ],
    stack: [
      { label: "Python", brand: "python" },
      { label: "pandas", brand: "pandas" },
    ],
  },
  {
    categoryTags: ["trading", "package"],
    isOSS: true,
    priority: 2,
    title: "bt-dynamic",
    color: "#addb67",
    icon: "trending-up-down",
    publishedAt: "2026.07",
    description: {
      ja: "静的バックテストは相場環境が変われば共倒れする。相場を9セル（トレンド強度×ボラティリティ）に分類し、セルごとに順張り/逆張り/ノーポジを切り替える動的レジーム切替を、分類→判定→検証まで通して実装。",
      en: "Dynamic regime switching backtester that classifies market conditions into 9 cells (trend strength x volatility) and adaptively toggles trend-following, mean-reversion, or flat positions.",
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/bt-dynamic",
        external: true,
      },
      {
        label: "PyPI",
        href: "https://pypi.org/project/bt-dynamic/",
        external: true,
      },
    ],
    stack: [
      { label: "Python", brand: "python" },
      { label: "pandas", brand: "pandas" },
      { label: "PyPI", brand: "pypi" },
    ],
  },
  {
    categoryTags: ["trading"],
    isOSS: true,
    priority: 2,
    title: "live-dynamic",
    color: "#addb67",
    icon: "zap",
    publishedAt: "2026.07",
    description: {
      ja: "bt-dynamic で検証した戦略を、同一の判定コード・同一の config のまま実弾に接続する実行層。冪等な発注ゲート・照合型 OCO・EOD 決済・キルスイッチの安全設計を、systemd timer による無人運転ごと参照実装として公開。",
      en: "Execution layer connecting strategies validated in bt-dynamic directly to live trading with identical logic and configs. Features idempotent order gates, OCO matching, EOD settlement, and kill switches.",
    },
    links: [
      {
        label: "GitHub",
        href: "https://github.com/yktsnet/live-dynamic",
        external: true,
      },
    ],
    stack: [
      { label: "Python", brand: "python" },
      { label: "NixOS", brand: "nixos" },
    ],
  },
];

/**
 * Research セクション用の型。
 * Works カードのスタイルを踏襲しつつ、カテゴリタグや技術スタックなどを省いて軽量化したカードを表示する。
 */
export type Research = {
  title: string;
  description: MultilingualText;
  href: string;
  publishedAt?: string;
};

export const researches: Research[] = [
  {
    title: "wiki-guessur",
    description: {
      ja: "冒頭の定義文を消された Wikipedia 記事の同定ベンチマーク。数式 / GBDT / LLM 再判定の 4 手法 × 5 シードで MRR を実測。",
      en: "Identification benchmark for Wikipedia articles with redacted lead definitions. Evaluates MRR across 4 methods (Math / GBDT / LLM re-ranking) x 5 seeds.",
    },
    href: "https://github.com/yktsnet/wiki-guessur",
    publishedAt: "2026.07",
  },
];

const DEFAULT_POST_COLOR = "#5de4c7";

export function getPostVisualMeta(postSlug: string, fallbackIcon = "code") {
  const work = works.find((item) => item.postSlug === postSlug);

  return {
    color: work?.color ?? DEFAULT_POST_COLOR,
    icon: work?.icon ?? fallbackIcon,
  };
}
