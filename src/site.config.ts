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
  description: "Systems that disappear into the workflow.",
  lang: "ja",
  ogLocale: "ja_JP",
  title: "ykts.net",
  url: "https://ykts.net",
};

export const menuLinks: { path: string; title: string }[] = [
  { path: "/works/", title: "Works" },
  { path: "/posts/", title: "Posts" },
  { path: "/contact/", title: "Contact" },
];
