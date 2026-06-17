import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  author: "Katsuhiro Yamakawa",
  date: {
    locale: "en-GB",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  description: "Systems that disappear into the workflow.",
  lang: "ja",
  ogLocale: "ja_JP",
  title: "ykts.net",
  url: "https://ykts.net",
};

export const menuLinks: { path: string; title: string }[] = [];
