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
  | "gemini";

export type StackItem = { label: string; brand?: BrandKey };

export type Work = {
  category: string;
  title: string;
  color: string;
  icon: string;
  postSlug?: string;
  description: string;
  links: { label: string; href: string; external?: boolean }[];
  stack?: StackItem[];
};

export const works: Work[] = [
  {
    category: "Hardware",
    title: "NFC Attendance System",
    color: "#addb67",
    icon: "id-card",
    postSlug: "nfc-attendance-system",
    description:
      "NFC カードをかざすだけで打刻が完結し、Google スプレッドシートへ自動集計。\nPython 標準ライブラリのみで構成し、Raspberry Pi 2 や旧 PC でも依存ゼロで動く。",
    links: [
      { label: "Demo →", href: "/nfc-attendance/" },
      { label: "制作記事", href: "/posts/nfc-attendance-system/" },
      { label: "GitHub", href: "https://github.com/yktsnet/nfc-attendance-kit", external: true },
    ],
    stack: [
      { label: "Raspberry Pi", brand: "raspberry-pi" },
      { label: "Python", brand: "python" },
      { label: "GAS", brand: "googleappsscript" },
    ],
  },
  {
    category: "Hardware",
    title: "Cat Feed Tracker",
    color: "#addb67",
    icon: "cat",
    postSlug: "cat-feed-tracker",
    description:
      "給餌棚に取り付けたリードスイッチで開閉を自動検知し、LINE で家族へ通知する家庭向け IoT。\nPico W → FastAPI → PostgreSQL の構成で、体重管理や設定変更まで LINE から完結。",
    links: [
      { label: "Demo →", href: "/cat-feed-tracker/" },
      { label: "制作記事", href: "/posts/cat-feed-tracker/" },
      { label: "GitHub", href: "https://github.com/yktsnet/cat-feed-tracker", external: true },
    ],
    stack: [
      { label: "Pico W", brand: "raspberry-pi" },
      { label: "FastAPI", brand: "fastapi" },
      { label: "PostgreSQL", brand: "postgresql" },
      { label: "LINE API", brand: "line" },
    ],
  },
  {
    category: "Others",
    title: "Training Scheduler",
    color: "#a6accd",
    icon: "graduation-cap",
    description:
      "機械的な進捗率管理ではなく、新人の主観的な手応えをメンターと共有するための研修支援ツール。\nVue + Go を go:embed で単一バイナリに固め、SQLite のみでインフラ依存ゼロ。",
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
  {
    category: "Modernization",
    title: "Order System",
    color: "#c792ea",
    icon: "shopping-cart",
    description:
      "WinForms の密結合（UI にロジック全入り）を解体し、.NET 8 Web API + React へ段階的移行。\n責務分離が完了した構造に LangGraph を独立追加し、自然言語で在庫・売上を照会できる AI エージェントを統合。",
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
  {
    category: "Modernization",
    title: "Attendance System",
    color: "#c792ea",
    icon: "clock",
    description:
      "AutoPostBack・ViewState という WebForms の構造的問題を解体し、.NET 8 Web API + React に移行。\n分離後の構造に SignalR を追加し、WebForms では実現不可能だったリアルタイム打刻監視を実装。",
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
    category: "Trading",
    title: "Trading Lab",
    color: "#89ddff",
    icon: "trending-up",
    postSlug: "trading-lab",
    description: "ターミナルで分散していたバックテスト・戦略選定・Live 監視を一画面に集約した自動売買用 Web console。\n異常検知から戦略選定まで、運用判断の全入口をひとつに。",

    links: [
      { label: "Demo →", href: "https://trading-lab.pages.dev", external: true },
      { label: "制作記事", href: "/posts/trading-lab/" },
      { label: "GitHub", href: "https://github.com/yktsnet/trading-lab", external: true },
    ],
    stack: [
      { label: "React", brand: "react" },
      { label: "Hono", brand: "hono" },
      { label: "Cloudflare", brand: "cloudflare" },
      { label: "Python", brand: "python" },
    ],
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
