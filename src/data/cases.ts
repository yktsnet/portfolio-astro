import type { MultilingualText } from "../lib/i18n";
import type { Metric } from "../types";

export type CaseStudy = {
  // services.ts の slug。帯のリンク先と詳細ページの導入例がこれで対応する
  service: string;
  client: MultilingualText;
  headline: MultilingualText;
  story: MultilingualText;
  metrics: Metric[];
};

// トップの帯と詳細ページの導入例が同じ数字と同じ言い方を出すよう、ここに1つだけ置く
export const cases: CaseStudy[] = [
  {
    service: "operations",
    client: { ja: "マンション管理会社", en: "A property management company" },
    headline: {
      ja: "引退を見据えたオーナーが、現場を離れられなかった。",
      en: "The owner wanted to step back ahead of retirement, but could not leave.",
    },
    story: {
      ja: "経営の実務が特定の人に頼ったままだった。そこに外部から入り、勤務の流れは変えずに、勤怠の集計と書類作成を自動にした。",
      en: "Day-to-day management depended on specific people. I came in from outside and automated attendance tallying and paperwork, without changing the daily routine.",
    },
    metrics: [
      {
        value: { ja: "−5", en: "−5" },
        unit: { ja: "時間/月", en: "h/mo" },
        label: { ja: "管理者が勤怠の集計にかけていた時間", en: "Admin time spent tallying attendance" },
      },
      {
        value: { ja: "−3〜4", en: "−30–40k" },
        unit: { ja: "万円/月", en: "JPY/mo" },
        label: { ja: "打刻の偽装と記入漏れで出ていた給与の差異", en: "Payroll gap from faked or missed clock-ins" },
      },
      {
        value: { ja: "初日", en: "Day one" },
        unit: { ja: "から", en: "" },
        label: { ja: "説明なしでスタッフ全員が使い始めた", en: "All staff started using it with no instructions" },
      },
    ],
  },
];
