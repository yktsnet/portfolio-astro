import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  author: "Katsuhiro Yamakawa",
  date: {
    locale: "ja-JP",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  description: "human centric DX",
  lang: "ja",
  ogLocale: "ja_JP",
  title: "ykts.net",
  url: "https://ykts.net",
};

export const menuLinks: { path: string; title: string }[] = [
  { path: "/", title: "Home" },
  { path: "/about/", title: "About" },
  { path: "/posts/", title: "Posts" },
  { path: "/Status/", title: "Status" },
];
