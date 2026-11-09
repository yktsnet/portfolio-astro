import type { MultilingualText } from "./lib/i18n";

export interface SiteConfig {
  author: string;
  description: string;
  lang: string;
  ogLocale: string;
  title: string;
  url: string;
}

export type Link = { label: MultilingualText; href: string; icon?: string };

// サービス詳細ページと、その節を描く部品で共有する
export type Metric = { value: MultilingualText; unit: MultilingualText; label: MultilingualText };
// 見出しはトップの PRINCIPLES と同じ言葉にし、中身はそのサービスで実際にどうしたかだけを書く
export type Step = { no: string; title: MultilingualText; done: MultilingualText };
export type Fit = { text: MultilingualText; reason?: MultilingualText };
export type OfferingDetail = {
  line: MultilingualText;
  before: MultilingualText[];
  after: MultilingualText[];
  decisions: { title: MultilingualText; body: MultilingualText }[];
};
