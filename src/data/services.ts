import type { MultilingualText } from "../lib/i18n";

export type Repo = { name: string; href: string };

export type Offering = {
  icon: string;
  title: MultilingualText;
  body: MultilingualText;
  points: MultilingualText[];
  repos: Repo[];
  // 公開リポが無い理由を一言添える（非公開の素材を下敷きにしているとき）
  note?: MultilingualText;
  // トップのカードで名前の下に添える1行
  short?: MultilingualText;
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
        body: {
          ja: "ICカードをかざすだけで打刻が済み、スプレッドシートへの集計と通知まで自動で回る。スマホの操作も要らないので、PCに不慣れなスタッフでも初日から使える。",
          en: "Tap an IC card and the clock-in is done; tallying into a spreadsheet and notifications run on their own. No smartphone step either, so staff unused to PCs can use it from day one.",
        },
        points: [
          { ja: "Raspberry Piと市販のカードリーダーで動く", en: "Runs on a Raspberry Pi and an off-the-shelf card reader" },
          { ja: "給与計算用の集計まで自動で作る", en: "Builds the payroll tally automatically" },
          { ja: "打刻の偽装と記入漏れを防ぐ", en: "Prevents faked clock-ins and missed entries" },
        ],
        repos: [gh("nfc-attendance-kit")],
      },
      {
        icon: "file-text",
        title: { ja: "Excel帳票の書類管理", en: "Excel Document Management" },
        short: { ja: "Excelを保存すればPDFになり、一覧から検索できる", en: "Saving the Excel file makes the PDF, searchable from one list" },
        body: {
          ja: "Webフォームの入力か、共有フォルダのExcelの保存を合図に、契約書などの書類を自動で作ってPDFにする。作った書類は1つの一覧から全文検索で探せる。",
          en: "A web form entry, or saving an Excel file in a shared folder, triggers generating documents such as contracts as PDFs. Everything produced can be found from one list with full-text search.",
        },
        points: [
          { ja: "テンプレートのExcelをそのまま使う", en: "Uses the existing Excel templates as they are" },
          { ja: "共有フォルダの変更を検知してPDFを更新する", en: "Detects changes in the shared folder and refreshes the PDFs" },
          { ja: "テンプレートと対応表を替えれば別の業種にも使える", en: "Swap the templates and mappings to reuse it in another industry" },
        ],
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
        body: {
          ja: "IssueとPRの運用、mainへの直接pushを止める安全機構、文書の規範を単位に切り分けて配る。型にするのは、人の判断を省かせない・セッションを超えて残す・担当者が替わっても揃う、の3つのどれかに当たるものだけ。相手の規模に合わせて粒度を落とし、1単位ずつ入れる。",
          en: "Issue and PR workflows, guards that block direct pushes to main, and writing standards are split into units. Only what keeps a human decision from being skipped, must survive across sessions, or must come out the same when people change becomes a unit. The grain is scaled to the team, and units go in one at a time.",
        },
        points: [
          { ja: "1人・チーム・依頼主ありの3つの作業フローから選ぶ", en: "Pick one of three workflows: solo, team, or with a client" },
          { ja: "誰が何を約束し、何を確かめたかがリポジトリに残る", en: "What was promised and what was verified stays in the repository" },
          { ja: "1人の開発環境で回している実例も公開している", en: "A working example from my own solo setup is public too" },
        ],
        repos: [gh("sdlc-kit"), gh("dotfiles-public")],
      },
      {
        icon: "user-check",
        title: { ja: "エンジニア評価制度づくり", en: "Engineer Evaluation System" },
        short: { ja: "AIの利用状況と評価基準で、育成と採用を決める", en: "AI usage data and shared criteria decide growth and hiring" },
        body: {
          ja: "5つの軸と5つの段階で、在籍者と採用候補者を同じ尺度で測る。メンバーごとのAIの利用量と成果も毎日集計し、評価と配分の材料にする。",
          en: "Five axes and five levels measure current staff and candidates on the same scale. AI usage and output per member are tallied daily and feed into evaluation and allocation.",
        },
        points: [
          { ja: "判定文が成果物の置き場を名指しするので、書式でなく中身で読める", en: "Criteria point to where deliverables live, so content is judged, not formatting" },
          { ja: "利用時間・トークン量・PR・Issueをメンバー別に並べる", en: "Usage time, tokens, PRs and issues side by side per member" },
          { ja: "採用では証拠にするものだけを替えて同じ軸を当てる", en: "For hiring, only the evidence changes; the axes stay the same" },
        ],
        repos: [gh("mgmt-kit")],
      },
      {
        icon: "notebook-pen",
        title: { ja: "客先常駐の社員向けAI勉強会", en: "AI Study Group for Client-Site Staff" },
        short: { ja: "客先がAIを認めていなくても、社員どうしで作って教え合える", en: "Staff build and teach each other with AI, even if their client bans it" },
        body: {
          ja: "講師が教える研修ではなく、社員どうしがAIで作って見せ合い、教え合う場を数か月かけて立ち上げる。未経験者が混ざっても、最初に全員の環境をそろえてから始める。",
          en: "Not a lecture series: a few months of building with AI, showing each other the results and teaching one another. Everyone's environment is set up first, so beginners can join too.",
        },
        points: [
          { ja: "短い講義のあと各自が手を動かし、少人数で見せ合う", en: "A short talk, then hands-on work and small-group show-and-tell" },
          { ja: "自分で選んだ課題をAIで形にして発表する", en: "Each person builds a problem of their choice with AI and presents it" },
          { ja: "教材と環境は会社が用意し、客先の情報を持ち込まない", en: "The company provides materials and environments; no client data comes in" },
        ],
        repos: [],
      },
    ],
    proof: {
      ja: "勤務先の開発会社で運用中。14のSkillで手順をそろえ、16の指標を毎日集計",
      en: "In use at the development company I work for: 14 skills align the process, 16 metrics tallied daily",
    },
  },
];
