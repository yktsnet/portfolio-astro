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
      "Sony RC-S300 と Raspberry Pi 2 で作った NFC 勤怠管理。\nカードをかざすだけで記録が完結し、Google スプレッドシートへ自動同期。",
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
      "Pico W のリードスイッチで給餌棚の開閉を検知し、FastAPI + PostgreSQL で記録。\nLINE で家族に定時通知・照会・設定変更できる家庭向け IoT システム。",
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
  {
    category: "Finance",
    title: "Trading Lab",
    color: "#89ddff",
    icon: "trending-up",
    postSlug: "trading-lab",
    description: "ターミナル中心だった運用導線を Web console に置き直した内製ツール。\nLive 状態と戦略選定を同じ画面から確認・操作できる。",

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
