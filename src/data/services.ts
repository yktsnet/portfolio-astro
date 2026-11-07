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
};

export type Step = { title: MultilingualText; body: MultilingualText; duration: MultilingualText };

export type Metric = { value: string; unit: MultilingualText; label: MultilingualText };

export type Service = {
  slug: string;
  no: string;
  icon: string;
  kicker: string;
  title: MultilingualText;
  summary: MultilingualText;
  heroTitle: MultilingualText;
  heroBody: MultilingualText;
  problems: { title: MultilingualText; body: MultilingualText }[];
  offerings: Offering[];
  process: Step[];
  results?: { note: MultilingualText; metrics: Metric[] };
};

const gh = (name: string): Repo => ({ name, href: `https://github.com/yktsnet/${name}` });

export const services: Service[] = [
  {
    slug: "operations",
    no: "01",
    icon: "table",
    kicker: "OPERATIONS",
    title: { ja: "業務の自動化", en: "Operations Automation" },
    summary: {
      ja: "Excel の手入力や紙の帳票、口頭での確認を続けたまま、転記・PDF 化・集計を裏側で自動にする。SaaS に置き換えないので、現場は覚え直さなくていい。",
      en: "Keep manual Excel entry, paper forms and verbal checks as they are, and automate the copying, PDF conversion and tallying behind them. Nothing is replaced with SaaS, so nobody has to relearn their job.",
    },
    heroTitle: {
      ja: "いまの Excel と紙のまま、転記と集計をなくす。",
      en: "Keep the Excel and paper. Lose the copying and tallying.",
    },
    heroBody: {
      ja: "現場が慣れた入力のやり方は変えず、その裏側に自動化を後付けする。新しいシステムの操作を覚えてもらう必要はない。",
      en: "The way people already enter data stays the same; automation is added behind it. No one has to learn a new system.",
    },
    problems: [
      {
        title: { ja: "同じ内容を何度も書き写している", en: "The same data is copied over and over" },
        body: {
          ja: "Excel に入れた入居者の情報を、契約書や届出の書式へ手で転記している。",
          en: "Tenant details entered in Excel are retyped by hand into contracts and notices.",
        },
      },
      {
        title: { ja: "月末に勤怠を口頭で確かめている", en: "Attendance is checked verbally at month end" },
        body: {
          ja: "手書きの出勤簿や自己申告を集め、給与計算のたびに食い違いを直している。",
          en: "Handwritten timesheets and self-reports are collected, and every payroll run means fixing mismatches.",
        },
      },
      {
        title: { ja: "SaaS を入れても使われない", en: "SaaS was introduced but nobody uses it" },
        body: {
          ja: "操作を覚える負担が大きく、結局 Excel と紙に戻ってしまった。",
          en: "Learning it was too much of a burden, and everyone drifted back to Excel and paper.",
        },
      },
    ],
    offerings: [
      {
        icon: "id-card",
        title: { ja: "勤怠システム", en: "Attendance System" },
        body: {
          ja: "IC カードをかざすだけで打刻が済み、スプレッドシートへの集計と通知まで自動で回る。スマホの操作も要らないので、PC に不慣れなスタッフでも初日から使える。",
          en: "Tap an IC card and the clock-in is done; tallying into a spreadsheet and notifications run on their own. No smartphone step either, so staff unused to PCs can use it from day one.",
        },
        points: [
          { ja: "Raspberry Pi と市販のカードリーダーで動く", en: "Runs on a Raspberry Pi and an off-the-shelf card reader" },
          { ja: "給与計算用の集計まで自動で作る", en: "Builds the payroll tally automatically" },
          { ja: "打刻の偽装と記入漏れを防ぐ", en: "Prevents faked clock-ins and missed entries" },
        ],
        repos: [gh("nfc-attendance-kit")],
      },
      {
        icon: "file-text",
        title: { ja: "Excel 帳票の書類管理", en: "Excel Document Management" },
        body: {
          ja: "Web フォームの入力か、共有フォルダの Excel の保存を合図に、契約書などの書類を自動で作って PDF にする。作った書類は1つの一覧から全文検索で探せる。",
          en: "A web form entry, or saving an Excel file in a shared folder, triggers generating documents such as contracts as PDFs. Everything produced can be found from one list with full-text search.",
        },
        points: [
          { ja: "テンプレートの Excel をそのまま使う", en: "Uses the existing Excel templates as they are" },
          { ja: "共有フォルダの変更を検知して PDF を更新する", en: "Detects changes in the shared folder and refreshes the PDFs" },
          { ja: "テンプレートと対応表を替えれば別の業種にも使える", en: "Swap the templates and mappings to reuse it in another industry" },
        ],
        repos: [gh("excel-kanri")],
      },
    ],
    process: [
      {
        title: { ja: "作業を見せてもらう", en: "Watch the actual work" },
        body: {
          ja: "実際の Excel と書類、月末の作業を見て、手で書き写している箇所を洗い出す。",
          en: "Look at the real spreadsheets, documents and month-end routine, and list every place where data is copied by hand.",
        },
        duration: { ja: "1〜2週間", en: "1–2 weeks" },
      },
      {
        title: { ja: "1つの書類か打刻から自動にする", en: "Automate one document or clock-in first" },
        body: {
          ja: "一番手間の大きいところから始め、現場で1か月使ってもらう。",
          en: "Start with whatever costs the most effort, and have the team use it for a month.",
        },
        duration: { ja: "2〜6週間", en: "2–6 weeks" },
      },
      {
        title: { ja: "ほかの書類へ広げる", en: "Extend to other documents" },
        body: {
          ja: "定着したのを確かめてから、同じ仕組みを別の書類や業務へ広げる。",
          en: "Once it has taken hold, extend the same mechanism to other documents and tasks.",
        },
        duration: { ja: "継続", en: "Ongoing" },
      },
    ],
    results: {
      note: { ja: "マンション管理会社で導入した結果", en: "Results at a property management company" },
      metrics: [
        { value: "−5", unit: { ja: "時間/月", en: "h/mo" }, label: { ja: "管理者が勤怠の集計にかけていた時間", en: "Admin hours spent tallying attendance" } },
        { value: "−3〜4", unit: { ja: "万円/月", en: "×10k JPY/mo" }, label: { ja: "打刻の偽装と記入漏れで出ていた給与の差異", en: "Payroll discrepancy from faked or missed clock-ins" } },
        { value: "Day 1", unit: { ja: "", en: "" }, label: { ja: "説明なしでスタッフ全員が使い始めた", en: "All staff started using it without instructions" } },
      ],
    },
  },
  {
    slug: "ai-development",
    no: "02",
    icon: "sparkles",
    kicker: "AI DEVELOPMENT",
    title: { ja: "AI と開発する組織づくり", en: "AI-Native Development Teams" },
    summary: {
      ja: "AI エージェントと開発する手順を型にして配り、エンジニアでない経営層も読める物差しで評価し、研修で人を育てる。型と評価と育成を、1本の物差しでつなぐ。",
      en: "Package the way of developing with AI agents and distribute it, evaluate people on a scale that non-engineer executives can read, and grow people through training — all tied to a single scale.",
    },
    heroTitle: {
      ja: "AI と開発する型を、経営と現場の両方に根づかせる。",
      en: "Root the way of building with AI in both management and the floor.",
    },
    heroBody: {
      ja: "AI エージェントを使うと、詰まる場所がコードを書くことから、意図を伝えることと確かめることへ移る。そこを型にして配り、同じ物差しで評価し、使える人を育てる。",
      en: "With AI agents, the bottleneck moves from writing code to conveying intent and verifying results. That is what gets packaged and distributed, measured on one scale, and taught.",
    },
    problems: [
      {
        title: { ja: "AI の使い方が人によってばらばら", en: "Everyone uses AI differently" },
        body: {
          ja: "使う人と使わない人の差が開き、成果物の形もそろわない。",
          en: "The gap between users and non-users widens, and deliverables never share a shape.",
        },
      },
      {
        title: { ja: "誰が成果を出しているか分からない", en: "No one can tell who is delivering" },
        body: {
          ja: "利用量も成果も見えないので、経営はライセンスの配分も評価も決められない。",
          en: "Neither usage nor output is visible, so management cannot decide on license allocation or evaluation.",
        },
      },
      {
        title: { ja: "教える仕組みが無い", en: "There is no way to teach it" },
        body: {
          ja: "業務の中で触れられる人しか伸びず、研修も講義を聞いて終わってしまう。",
          en: "Only people who touch it at work improve, and training ends once the lecture does.",
        },
      },
    ],
    offerings: [
      {
        icon: "package",
        title: { ja: "開発キットの配布", en: "Development Kit" },
        body: {
          ja: "Issue と PR の運用、main への直接 push を止める安全機構、文書の規範を単位に切り分けて配る。既存のリポジトリへ1単位ずつ入れられる。",
          en: "Issue and PR workflows, guards that block direct pushes to main, and writing standards are split into units. Each unit can be dropped into an existing repository one at a time.",
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
        title: { ja: "エンジニアの評価", en: "Engineer Evaluation" },
        body: {
          ja: "5つの軸と5つの段階で、在籍者と採用候補者を同じ尺度で測る。メンバーごとの AI の利用量と成果も毎日集計し、評価と配分の材料にする。",
          en: "Five axes and five levels measure current staff and candidates on the same scale. AI usage and output per member are tallied daily and feed into evaluation and allocation.",
        },
        points: [
          { ja: "判定文が成果物の置き場を名指しするので、書式でなく中身で読める", en: "Criteria point to where deliverables live, so content is judged, not formatting" },
          { ja: "利用時間・トークン量・PR・Issue をメンバー別に並べる", en: "Usage time, tokens, PRs and issues side by side per member" },
          { ja: "採用では証拠にするものだけを替えて同じ軸を当てる", en: "For hiring, only the evidence changes; the axes stay the same" },
        ],
        repos: [gh("ladder-kit")],
        note: { ja: "利用状況の集計は非公開", en: "The usage tally is private" },
      },
      {
        icon: "notebook-pen",
        title: { ja: "AI 開発の研修", en: "AI Development Training" },
        body: {
          ja: "講師が教える研修ではなく、社員どうしが AI で作って見せ合い、教え合う場を数か月かけて立ち上げる。未経験者が混ざっても、最初に全員の環境をそろえてから始める。",
          en: "Not a lecture series: a few months of building with AI, showing each other the results and teaching one another. Everyone's environment is set up first, so beginners can join too.",
        },
        points: [
          { ja: "短い講義のあと各自が手を動かし、少人数で見せ合う", en: "A short talk, then hands-on work and small-group show-and-tell" },
          { ja: "自分で選んだ課題を AI で形にして発表する", en: "Each person builds a problem of their choice with AI and presents it" },
          { ja: "教材と環境は会社が用意し、客先の情報を持ち込まない", en: "The company provides materials and environments; no client data comes in" },
        ],
        repos: [],
      },
    ],
    process: [
      {
        title: { ja: "使い方と成果物を見る", en: "Look at usage and output" },
        body: {
          ja: "誰がどう AI を使い、何を出しているかを、リポジトリと利用状況から読む。",
          en: "Read who uses AI how, and what they ship, from the repositories and usage data.",
        },
        duration: { ja: "1〜2週間", en: "1–2 weeks" },
      },
      {
        title: { ja: "型を1つ入れる", en: "Introduce one unit" },
        body: {
          ja: "安全機構や PR の運用など、事故と手戻りを減らす単位から1つずつ入れる。",
          en: "Start with the units that cut accidents and rework, such as guards or the PR workflow, one at a time.",
        },
        duration: { ja: "2〜4週間", en: "2–4 weeks" },
      },
      {
        title: { ja: "物差しで測って広げる", en: "Measure and expand" },
        body: {
          ja: "評価の軸で現在地を置き、研修で次に上げる軸を育てる。",
          en: "Place everyone on the scale, then use training to raise the next axis.",
        },
        duration: { ja: "継続", en: "Ongoing" },
      },
    ],
  },
  {
    slug: "education",
    no: "03",
    icon: "graduation-cap",
    kicker: "EDUCATION",
    title: { ja: "教育事業の立ち上げ支援", en: "Education Business Support" },
    summary: {
      ja: "学習塾を12年経営してきた。その経験をもとに、プログラミング教室の立ち上げから、塾の事業の広げ方、出席や成績の仕組みまでを一緒に組み立てる。",
      en: "Twelve years of running a tutoring school. Drawing on that, I help set up programming classes, grow the school business, and build attendance and grading systems.",
    },
    heroTitle: {
      ja: "教室を開くところから、事業を広げるところまで。",
      en: "From opening a class to growing the business.",
    },
    heroBody: {
      ja: "学習塾を12年経営した経験をもとに、プログラミング教室の立ち上げと運営、塾の事業の広げ方、出席や成績の管理の仕組みまでを一緒に組み立てる。",
      en: "Based on twelve years of running a tutoring school, I help with launching and running programming classes, growing the school business, and building attendance and grading systems.",
    },
    problems: [
      {
        title: { ja: "プログラミング教室を始めたいが、型が無い", en: "You want a programming class but have no playbook" },
        body: {
          ja: "カリキュラムも運営の手順も無く、教えられる人も手元にいない。",
          en: "There is no curriculum, no operating routine, and no one on hand who can teach.",
        },
      },
      {
        title: { ja: "生徒募集が頭打ちになっている", en: "Enrollment has plateaued" },
        body: {
          ja: "問い合わせの入口が限られ、学年が上がると生徒が抜けていく。",
          en: "Inquiries come through few channels, and students leave as they move up a grade.",
        },
      },
      {
        title: { ja: "出席や成績の管理が手作業のまま", en: "Attendance and grades are still handled by hand" },
        body: {
          ja: "入退室は紙で、模試の結果も返却資料に軽く載るだけになっている。",
          en: "Check-ins are on paper, and mock exam results barely appear in the returned handouts.",
        },
      },
    ],
    offerings: [
      {
        icon: "code",
        title: { ja: "プログラミング教室の運営コンサル", en: "Programming Class Consulting" },
        body: {
          ja: "教室を開く・運営する事業者に、カリキュラムと運営の型を渡す。教えられるエンジニアの手配まで含めて相談に乗る。",
          en: "Hand over a curriculum and an operating playbook to those opening or running a class, including finding engineers who can teach.",
        },
        points: [
          { ja: "カリキュラムと授業の進め方", en: "Curriculum and lesson flow" },
          { ja: "教室を運営する手順", en: "Day-to-day operating routine" },
          { ja: "教える人の手配と育成", en: "Finding and training instructors" },
        ],
        repos: [],
      },
      {
        icon: "trending-up",
        title: { ja: "塾へのプログラミング教室の導入", en: "Adding Programming to a Tutoring School" },
        body: {
          ja: "学習塾の事業にプログラミング教室を加え、生徒を集める入口を増やす。小学生で入った子が中学・高校で塾のコースへ移れば、通う期間が延びる。",
          en: "Add a programming class to a tutoring school to open a new enrollment channel. Kids who join in elementary school and move into the school's courses in junior and senior high stay much longer.",
        },
        points: [
          { ja: "これまで届かなかった保護者からの問い合わせを増やす", en: "Reach parents who never inquired before" },
          { ja: "勉強が苦手な子もゲーム感覚で入れる", en: "Kids who dislike studying can join through play" },
          { ja: "小学生から高校生までの通塾の流れを作る", en: "Build a path from elementary to high school" },
        ],
        repos: [],
      },
      {
        icon: "id-card",
        title: { ja: "NFC カードの出席管理", en: "NFC Attendance for Students" },
        body: {
          ja: "生徒が NFC カードをかざすと入退室が記録され、保護者へ知らせが届く。自習の時間も残るので、通った時間と成績の伸びを並べた資料が作れる。",
          en: "Students tap an NFC card to record arrival and departure, and parents are notified. Self-study time is logged too, so time spent can be shown alongside grade improvement.",
        },
        points: [
          { ja: "子どもが着いたか、帰ったかを保護者が知れる", en: "Parents know when their child arrives and leaves" },
          { ja: "自習を含めた通塾の記録が残る", en: "Every visit, including self-study, is recorded" },
          { ja: "記録を生徒募集の資料に使える", en: "The records double as enrollment material" },
        ],
        repos: [gh("nfc-attendance-kit")],
      },
      {
        icon: "book-search",
        title: { ja: "模試・教材のデータ化", en: "Digitizing Mock Exams and Materials" },
        body: {
          ja: "紙の模試や教材をデータにし、採点と成績の分析に使える形にする。生徒や保護者が分析を見られる Web アプリまで作る。",
          en: "Turn paper mock exams and materials into data usable for grading and analysis, and build a web app where students and parents can see the analysis.",
        },
        points: [
          { ja: "紙の答案と教材をデータにする", en: "Convert paper answers and materials into data" },
          { ja: "成績の分析を自動で出す", en: "Generate grade analysis automatically" },
          { ja: "生徒と保護者に直接届く画面を持つ", en: "Give students and parents a screen of their own" },
        ],
        repos: [],
      },
    ],
    process: [
      {
        title: { ja: "事業と教室の今を聞く", en: "Hear where things stand" },
        body: {
          ja: "生徒の数と流れ、教える人、管理の手間を聞き、どこから手を付けるかを決める。",
          en: "Hear about enrollment, instructors and admin work, and decide where to begin.",
        },
        duration: { ja: "1〜2週間", en: "1–2 weeks" },
      },
      {
        title: { ja: "1つの教室か仕組みから始める", en: "Start with one class or system" },
        body: {
          ja: "体験授業や1つの校舎など、小さく始めて反応を確かめる。",
          en: "Start small, such as a trial lesson or a single campus, and check the response.",
        },
        duration: { ja: "1〜3か月", en: "1–3 months" },
      },
      {
        title: { ja: "事業として広げる", en: "Grow it into a business" },
        body: {
          ja: "手応えのあった形を、ほかの校舎や学年へ広げる。",
          en: "Extend what worked to other campuses and grades.",
        },
        duration: { ja: "継続", en: "Ongoing" },
      },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
