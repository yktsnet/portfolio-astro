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
  categoryTags: string[];
  isOSS: boolean;
  priority: number;
  title: string;
  color: string;
  icon: string;
  postSlug?: string;
  description: string;
  /** 設計判断の一行。なぜその構成にしたかを description と重複させずに語る。 */
  rationale?: string;
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
    title: "NFC Attendance System",
    color: "#addb67",
    icon: "id-card",
    postSlug: "nfc-attendance-system",
    publishedAt: "2026.01",
    description:
      "NFC カードをかざすだけで打刻が完結し、Google スプレッドシートへ自動集計。\nPython 標準ライブラリのみで構成し、Raspberry Pi 2 や旧 PC でも依存ゼロで動く。",
    rationale:
      "現場の非力な Raspberry Pi 2 でそのまま動かすため、pip 依存ゼロ・標準ライブラリだけで打刻から給与計算まで組んだ。",
    inUse: true,
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
    categoryTags: ["iot"],
    isOSS: true,
    priority: 2,
    title: "Cat Feed Tracker",
    color: "#addb67",
    icon: "cat",
    postSlug: "cat-feed-tracker",
    publishedAt: "2026.03",
    description:
      "給餌棚の開閉を自動検知し、LINE で家族へ定時通知する家庭向け IoT。\nPico W → FastAPI → PostgreSQL 構成で、体重管理や設定変更まで LINE から完結。",
    rationale:
      "家族が使うものなので新しいアプリは増やさず、通知も操作も既に使っている LINE 側に寄せた。",
    inUse: true,
    links: [
      { label: "Demo →", href: "/cat-feed-tracker/" },
      { label: "制作記事", href: "/posts/cat-feed-tracker/" },
      { label: "GitHub", href: "https://github.com/yktsnet/cat-feed-tracker", external: true },
    ],
    stack: [
      { label: "Pico W", brand: "raspberry-pi" },
      { label: "LINE API", brand: "line" },
      { label: "FastAPI", brand: "fastapi" },
      { label: "PostgreSQL", brand: "postgresql" },
    ],
  },
  {
    categoryTags: ["webui", "office"],
    isOSS: true,
    priority: 2,
    title: "Training Scheduler",
    color: "#a6accd",
    icon: "graduation-cap",
    publishedAt: "2026.05",
    description:
      "機械的な進捗管理ではなく、新人の手応えをメンターと共有する研修支援ツール。\nVue + Go を go:embed で単一バイナリに固め、SQLite のみでインフレ依存ゼロ。",
    rationale:
      "進捗を機械的に数値化せず、本人の主観的な手応えを指標に据えた。メモリの限られた環境でも常駐できるよう、Go の単一バイナリに軽くまとめている。",
    inUse: true,
    links: [
      { label: "Demo →", href: "https://training-scheduler.ykts.net/", external: true },
      { label: "GitHub", href: "https://github.com/yktsnet/training-scheduler", external: true },
    ],
    stack: [
      { label: "Go", brand: "go" },
      { label: "Vue", brand: "vue" },
      { label: "SQLite", brand: "sqlite" },
    ],
  },
  {
    categoryTags: ["modernization", "ai", "office"],
    isOSS: false,
    priority: 1,
    title: "Order System",
    color: "#c792ea",
    icon: "shopping-cart",
    publishedAt: "2026.05",
    description:
      "WinForms の密結合を解体し、.NET 8 Web API + React へ段階的移行。\nLangGraph を独立追加し、自然言語で在庫・売上を照会できる AI エージェントを統合。",
    rationale:
      "責務分離を終えた構造の上にエージェントを後付けし、担当者の Excel 手作業だった集計を、非エンジニアが自然言語で直接引けるようにした。",
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
    categoryTags: ["modernization", "webui", "office"],
    isOSS: false,
    priority: 1,
    title: "Attendance System",
    color: "#c792ea",
    icon: "clock",
    publishedAt: "2026.05",
    description:
      "AutoPostBack・ViewState を解体し、.NET 8 Web API + React へ段階的移行。\nSignalR を追加し、WebForms では不可能だったリアルタイム打刻監視を実装。",
    rationale:
      "AutoPostBack を消すだけでなく、WebForms では原理的に無理だったリアルタイム監視を SignalR で成立させ、移行を作り直す理由に変えた。",
    links: [
      { label: "Demo →", href: "https://webforms.ykts.net/", external: true },
      { label: "GitHub", href: "https://github.com/yktsnet/attendance-system-migration", external: true },
    ],
    stack: [
      { label: "C#", brand: "csharp" },
      { label: "SignalR" },
      { label: "React", brand: "react" },
      { label: "PostgreSQL", brand: "postgresql" },
    ],
  },
  {
    categoryTags: ["trading", "automation"],
    isOSS: false,
    priority: 3,
    title: "Trading Lab",
    color: "#89ddff",
    icon: "trending-up",
    postSlug: "trading-lab",
    publishedAt: "2026.04",
    description: "ターミナルで分散していた自動売買の運用導線を Web console に集約。\nバックテスト・戦略選定・Live 監視まで、同じ画面から確認・操作できる。",
    rationale:
      "Web フレームワークに頼れない自動売買の運用を 1 画面へ集約し、NixOS で本番の再現性を担保して止めずに走らせ続ける。",
    links: [
      { label: "Demo →", href: "https://trading-lab.pages.dev", external: true },
      { label: "制作記事", href: "/posts/trading-lab/" },
      { label: "GitHub", href: "https://github.com/yktsnet/trading-lab", external: true },
    ],
    stack: [
      { label: "React", brand: "react" },
      { label: "FastAPI", brand: "fastapi" },
      { label: "Cloudflare", brand: "cloudflare" },
      { label: "NixOS", brand: "nixos" },
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
