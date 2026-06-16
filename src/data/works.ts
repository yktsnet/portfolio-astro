export type StackItem = { label: string; brand?: string };

export type Work = {
  title: string;
  tag: string;
  color: string;
  icon: string;
  postSlug?: string;
  description: string;
  links: { label: string; href: string; external?: boolean }[];
  stack?: StackItem[];
};

export const works: Work[] = [
  {
    title: "NFC Attendance System",
    tag: "現場自動化 · 業務改善",
    color: "#c792ea",
    icon: "id-card",
    postSlug: "nfc-attendance-system",
    description:
      "Sony RC-S300 と Raspberry Pi 2 で作った勤怠管理。カードをかざすだけで記録が完結し、Google スプレッドシートへ自動同期。マンション管理事業者に導入・運用中。",
    links: [
      { label: "Demo →", href: "/nfc-attendance/" },
      { label: "制作記事", href: "/posts/nfc-attendance-system/" },
      { label: "GitHub", href: "https://github.com/yktsnet/nfc-attendance-kit", external: true },
    ],
    stack: [
      { label: "Raspberry Pi", brand: "raspberry-pi" },
      { label: "Python", brand: "python" },
      { label: "GAS", brand: "googleappsscript" },
      { label: "PostgreSQL", brand: "postgresql" },
    ],
  },
  {
    title: "Cat Feed Tracker",
    tag: "IoT · プロダクト",
    color: "#addb67",
    icon: "cat",
    postSlug: "cat-feed-tracker",
    description:
      "Pico W のリードスイッチで給餌棚の開閉を検知し、FastAPI + PostgreSQL で記録。LINE で家族に定時通知・照会・設定変更ができる家庭向け IoT システム。",
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
    title: "Trading Lab",
    tag: "運用基盤 · ダッシュボード",
    color: "#89ddff",
    icon: "trending-up",
    postSlug: "trading-lab",
    description: "ターミナルで見ていた運用導線を Web console に置き直し、Live 状態と戦略選定を同じ画面から確認・操作できる内製ツール。",

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
