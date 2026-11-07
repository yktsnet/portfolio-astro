import type { MultilingualText } from "../lib/i18n";

export type Repo = { name: string; href: string };

export type Offering = {
  icon: string;
  title: MultilingualText;
  // トップのカードで名前の下に添える1行
  short: MultilingualText;
  repos: Repo[];
};

export type Link = { label: string; href: string };

export type Service = {
  slug: string;
  no: string;
  icon: string;
  kicker: string;
  title: MultilingualText;
  summary: MultilingualText;
  offerings: Offering[];
  // トップのカードに出す、導入先と結果の1行
  proof?: MultilingualText;
};

const gh = (name: string): Repo => ({ name, href: `https://github.com/yktsnet/${name}` });

export const services: Service[] = [
  {
    slug: "operations",
    no: "01",
    icon: "table",
    kicker: "OPERATIONS",
    title: { ja: "事務作業の自動化", en: "Office Work Automation" },
    summary: {
      ja: "現場のExcelや紙は変えずに、転記と集計だけを裏側で自動にする。どこを自動にすれば経費が減り、売上につながるかを、会計の数字を見ながら話すところから始める。",
      en: "The Excel and paper on the floor stay as they are; only the copying and tallying behind them are automated. It starts with looking at the accounts together to see where automation would cut costs or help sales.",
    },
    proof: {
      ja: "マンション管理会社で稼働中。勤怠の集計 −5時間/月、説明なしで初日から定着",
      en: "Running at a property management company: −5 h/mo of attendance tallying, adopted on day one with no instructions",
    },
    offerings: [
      {
        icon: "id-card",
        title: { ja: "勤怠システム", en: "Attendance System" },
        short: { ja: "カードをかざすだけで打刻と給与の集計が済む", en: "A card tap handles clock-ins and the payroll tally" },
        repos: [gh("nfc-attendance-kit")],
      },
      {
        icon: "file-text",
        title: { ja: "Excel帳票の書類管理", en: "Excel Document Management" },
        short: { ja: "Excelを保存すればPDFになり、一覧から検索できる", en: "Saving the Excel file makes the PDF, searchable from one list" },
        repos: [gh("excel-kanri")],
      },
    ],
  },
  {
    slug: "ai-development",
    no: "02",
    icon: "sparkles",
    kicker: "AI DEVELOPMENT",
    title: { ja: "開発組織のAI活用", en: "AI in Development Teams" },
    summary: {
      ja: "AIの使い方が個人任せで、人によって差が開き、うまくいくやり方もチームに広がらない。開発の手順をそろえて配り（標準化）、使い方と現在地が分かるようにする（可視化）。",
      en: "AI use is left to each person, so the gap widens and what works never spreads across the team. I align and distribute the development process (standardization) and make usage and where each person stands visible (visibility).",
    },
    offerings: [
      {
        icon: "package",
        title: { ja: "AI駆動開発の標準化", en: "Standardizing AI-Driven Development" },
        short: { ja: "手順をそろえ、誰が担当しても同じ形の成果物が出る", en: "One process, so output keeps its shape whoever does the work" },
        repos: [gh("sdlc-kit"), gh("dotfiles-public")],
      },
      {
        icon: "user-check",
        title: { ja: "エンジニア評価制度づくり", en: "Engineer Evaluation System" },
        short: { ja: "AIの利用状況と評価基準で、育成と採用を決める", en: "AI usage data and shared criteria decide growth and hiring" },
        repos: [gh("mgmt-kit")],
      },
      {
        icon: "notebook-pen",
        title: { ja: "客先常駐の社員向けAI勉強会", en: "AI Study Group for Client-Site Staff" },
        short: { ja: "客先がAIを認めていなくても、社員どうしで作って教え合える", en: "Staff build and teach each other with AI, even if their client bans it" },
        repos: [],
      },
    ],
    proof: {
      ja: "勤務先の開発会社で運用中。14のSkillで手順をそろえ、16の指標を毎日集計",
      en: "In use at the development company I work for: 14 skills align the process, 16 metrics tallied daily",
    },
  },
];
