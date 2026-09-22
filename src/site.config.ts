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
  description:
    "Find what's worth fixing in the numbers, build it without changing how people already work, and hand it over so the team can keep it running on their own.",
  lang: "ja",
  ogLocale: "ja_JP",
  title: "ykts.net",
  url: "https://ykts.net",
};

export const menuLinks: { path: string; title: string }[] = [];
