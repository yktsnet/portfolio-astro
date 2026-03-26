export type Work = {
  title: string;
  tag: string;
  color: string;
  icon: string;
  description: string;
  links: { label: string; href: string; external?: boolean }[];
  featured: boolean;
  featuredDescription?: string; // トップページ用の短い説明
};

export const works: Work[] = [
  {
    title: "NFC Attendance System",
    tag: "現場 · 業務自動化",
    color: "#5de4c7",
    icon: "id-card",
    description:
      "Sony RC-S300 と Raspberry Pi 2 で作った勤怠管理。カードをかざすだけで記録が完結し、Google スプレッドシートへ自動同期。マンション管理事業者に導入・運用中。",
    featuredDescription:
      "Sony RC-S300 と Raspberry Pi 2 で作った勤怠管理。カードをかざすだけで記録が完結。給与自動計算システム。",
    links: [
      { label: "Demo →", href: "/nfc-attendance/" },
      { label: "制作記事", href: "/posts/nfc-attendance-system/" },
      { label: "GitHub", href: "https://github.com/yktsnet/nfc-attendance-kit", external: true },
    ],
    featured: true,
  },
  {
    title: "Cat Feed Tracker",
    tag: "IoT · プロダクト",
    color: "#addb67",
    icon: "cat",
    description:
      "Pico W のリードスイッチで給餌棚の開閉を検知し、FastAPI + PostgreSQL で記録。LINE で家族に定時通知・照会・設定変更ができる家庭向け IoT システム。",
    featuredDescription:
      "Pico W のリードスイッチで給餌棚の開閉を検知。LINE で家族に定時通知・照会ができる IoT システム。",
    links: [
      { label: "Demo →", href: "/cat-feed-tracker/" },
      { label: "制作記事", href: "/posts/cat-feed-tracker/" },
      { label: "GitHub", href: "https://github.com/yktsnet/cat-feed-tracker", external: true },
    ],
    featured: true,
  },
  {
    title: "Live Demo (Trading System)",
    tag: "運用基盤 · 可視化",
    color: "#89ddff",
    icon: "chart-candlestick", 
    description:
      "自動売買パイプラインのログを Cloudflare KV 経由で集約し、Astro でリアルタイムに表示。稼働中バックエンドの状態を外部に見せる可視化基盤。",
    featuredDescription:
      "自動売買パイプラインのログを Cloudflare KV 経由で集約。稼働中バックエンドをリアルタイム可視化。",
    links: [
      { label: "Live Demo →", href: "/live-demo/" },
      { label: "制作記事", href: "/posts/live-demo/" },
      { label: "GitHub", href: "https://github.com/yktsnet/portfolio-astro", external: true },
    ],
    featured: true,
  },
];
