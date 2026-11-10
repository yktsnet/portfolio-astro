import type { MultilingualText } from "../lib/i18n";
import type { Metric } from "../types";

export type CaseStudy = {
  // services.ts の slug。帯のリンク先と詳細ページの導入例がこれで対応する
  service: string;
  client: MultilingualText;
  lead: MultilingualText;
  action: MultilingualText;
  // 数字の並びの最後に置く、数字にならないその後の広がり
  followUp: MultilingualText;
  article: { label: MultilingualText; href: string };
  metrics: Metric[];
};

// トップの帯と詳細ページの導入例が同じ数字を出すよう、ここに1つだけ置く
export const cases: CaseStudy[] = [
  {
    service: "operations",
    client: { ja: "マンション管理会社", en: "A property management company" },
    lead: {
      ja: "会計を見ると人件費が6割。その根拠の勤務時間は自己申告で、確かめる手段がなかった。",
      en: "The accounts showed labor at 60% of costs, and the hours behind it were self-reported, with no way to check them.",
    },
    action: {
      ja: "勤務の流れは変えずに、出退勤をカードをかざすだけにして、申告を記録に替えた。",
      en: "Without changing the daily routine, clocking in became a single card tap, turning reports into records.",
    },
    followUp: {
      ja: "契約書の作成や法人化の相談も受けている",
      en: "Now also asked to help with contract paperwork and incorporation",
    },
    article: {
      label: { ja: "Zenn — 経緯を書いた記事", en: "Zenn — the full story" },
      href: "https://zenn.dev/yktsnet/articles/202604-nfc-attendance-raspberry-pi-2",
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
