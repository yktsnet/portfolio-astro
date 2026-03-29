export type Work = {
  title: string;
  tag: string;
  color: string;
  icon: string;
  description: string;
  links: { label: string; href: string; external?: boolean }[];
  featured: boolean;
  featuredDescription?: string;
};

export const works: Work[] = [
  {
    title: "NFC Attendance System",
    tag: "現場自動化 · 業務改善",
    color: "#c792ea",
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
    title: "Trading System",
    tag: "運用基盤 · ライブ",
    color: "#89ddff",
    icon: "chart-candlestick",
    description:
      "自動売買パイプラインのログを Cloudflare KV 経由で集約し、Astro でリアルタイムに表示。稼働中のバックエンドを5分ディレイで外部に公開するライブモニタリング基盤。",
    featuredDescription:
      "自動売買パイプラインのログを Cloudflare KV 経由で集約。稼働中バックエンドをリアルタイムで外部公開。",
    links: [
      { label: "Demo →", href: "/trading-system/" },
      { label: "制作記事", href: "/posts/live-demo/" },
    ],
    featured: true,
  },
  {
    title: "Trading Lab",
    tag: "運用基盤 · バックテスト",
    color: "#89ddff",
    icon: "trending-up",
    description:
      "自動売買で使う戦略を選ぶための内製コンソール。パイプラインで候補を段階的に絞り込み、セッション別の成績ランキングをブラウザから確認・操作できる。",
    featuredDescription:
      "自動売買の戦略選定を管理する内製コンソール。段階的に候補を絞り込み、成績ランキングをブラウザから操作できる。",
    links: [
      { label: "Demo →", href: "https://trading-lab.pages.dev", external: true },
      { label: "制作記事", href: "/posts/trading-lab/" },
      { label: "GitHub", href: "https://github.com/yktsnet/trading-lab", external: true },
    ],
    featured: true,
  },
];
