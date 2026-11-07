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

export type Step = { title: MultilingualText; body: MultilingualText; duration?: MultilingualText };

export type Link = { label: string; href: string };

// サービスを頼む理由になる考え方や経験。詳細ページに1つ置く
export type Stance = { kicker: string; title: MultilingualText; body: MultilingualText[]; links?: Link[] };

export type Metric = { value: MultilingualText; unit: MultilingualText; label: MultilingualText };

// 実際に入れた案件。決める・作る・渡すの順に時系列で置く
export type CaseStudy = {
  label: string;
  title: MultilingualText;
  body: MultilingualText;
  timeline: { tag: string; title: MultilingualText; body: MultilingualText; on?: boolean }[];
};

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
  stance: Stance;
  process: Step[];
  caseStudy?: CaseStudy;
  results?: { note: MultilingualText; metrics: Metric[] };
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
    heroTitle: {
      ja: "いまのExcelと紙のまま、転記と集計をなくす。",
      en: "Keep the Excel and paper. Lose the copying and tallying.",
    },
    heroBody: {
      ja: "現場が慣れた入力のやり方は変えず、その裏側に自動化を後付けする。新しいシステムの操作を覚えてもらう必要はない。",
      en: "The way people already enter data stays the same; automation is added behind it. No one has to learn a new system.",
    },
    problems: [
      {
        title: { ja: "勤務時間の申告を突き合わせる手段が無い", en: "Nothing to check reported hours against" },
        body: {
          ja: "自己申告と手書きの給与計算では、水増しが起きていても気づけない。実際に、人件費の中身を追って初めて見つかった。",
          en: "With self-reported hours and handwritten payroll, padding goes unnoticed. In practice it only surfaced once the labor cost was traced line by line.",
        },
      },
      {
        title: { ja: "繁忙期に同じ転記が集中する", en: "The same copying piles up in peak season" },
        body: {
          ja: "入居契約書を毎回コピーして書き換えていて、春の入退去シーズンに負荷が集まる。",
          en: "Tenancy contracts are copied and rewritten every time, and the load peaks in the spring move-in season.",
        },
      },
      {
        title: { ja: "SaaSを入れても使われない", en: "SaaS was introduced but nobody uses it" },
        body: {
          ja: "操作を覚える負担が大きく、結局Excelと紙に戻ってしまった。",
          en: "Learning it was too much of a burden, and everyone drifted back to Excel and paper.",
        },
      },
    ],
    stance: {
      kicker: "Adoption over Overhaul",
      title: { ja: "刷新より、定着", en: "Adoption over overhaul" },
      body: [
        {
          ja: "導入時に歓迎された機能が、半年後には誰にも使われなくなる。経営の現場でその経緯を当事者として見てきた。",
          en: "A feature welcomed at launch is used by no one six months later. I watched that happen from inside the business.",
        },
        {
          ja: "だから新しい画面や操作を覚えさせる設計を避ける。既存のExcel・スプレッドシート・紙の運用はそのまま残し、自動化はその裏側に差し込む。共有フォルダのExcelを開いて保存する従来の経路も残してあり、保存した時点でPDFになる。",
          en: "So I avoid designs that make people learn new screens. Existing Excel, spreadsheets and paper stay as they are, and automation goes in behind them. The old route of opening and saving the Excel file in the shared folder still works, and saving produces the PDF.",
        },
      ],
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
    process: [
      {
        title: { ja: "作業を見せてもらう", en: "Watch the actual work" },
        body: {
          ja: "実際のExcelと書類、月末の作業を見て、手で書き写している箇所を洗い出す。",
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
    caseStudy: {
      label: "Property Management",
      title: {
        ja: "マンション管理会社の外部CTOとして、勤怠から書類作成まで自動化",
        en: "As external CTO of a property management company, automating everything from attendance to documents",
      },
      body: {
        ja: "高齢のオーナーは引退を見据えて現場を離れたがっていたが、経営実務が属人化したままでは動けなかった。きっかけは勤怠の困りごとを片付ける小さな道具を1つ納品したこと。そこで信頼を得て相談の幅が広がり、いまは制度設計から日々の自動化、法人化までを引き受けている。",
        en: "The aging owner wanted to step back ahead of retirement, but could not while management work stayed tied to individuals. It started with delivering one small tool for an attendance problem. The trust it built widened the requests, and today I cover everything from policy design and daily automation to incorporation.",
      },
      timeline: [
        {
          tag: "DECIDE",
          title: { ja: "数字から直すものを決めた", en: "Decided what to fix from the numbers" },
          body: {
            ja: "依頼を待たず、まず会計を見た。人件費が費用の6割で、申告の中身を追うと勤務時間の水増しが見つかった。声の大きさではなく原価の構造から順番を決め、正確な記録を最初の一手にした。",
            en: "Rather than waiting for a brief, I looked at the books. Labor was 60% of costs, and tracing the reports turned up padded hours. I set the order by the cost structure, not by who complained loudest, and made accurate records the first move.",
          },
        },
        {
          tag: "BUILD",
          title: { ja: "現場のやり方を変えずに作った", en: "Built without changing how people work" },
          body: {
            ja: "ICカードをかざすだけの打刻は、説明なしで初日から定着した。契約書も共有フォルダのExcelに保存すればPDFになる形で自動化した。",
            en: "Clock-ins by just tapping an IC card stuck from day one without instructions. Contracts were automated so that saving the Excel file in the shared folder produces the PDF.",
          },
          on: true,
        },
        {
          tag: "HAND OVER",
          title: { ja: "回り出すまで付き合い、広げた", en: "Stayed until it ran, then expanded" },
          body: {
            ja: "使われ方を見て直し続け、相談は情報配信や制度設計、法人化まで広がった。いまは空室情報の配信を設計している。",
            en: "I kept fixing it as I watched it being used, and requests grew to information distribution, policy design and incorporation. A vacancy distribution app is now in design.",
          },
        },
      ],
    },
    results: {
      note: { ja: "マンション管理会社で導入した結果", en: "Results at a property management company" },
      metrics: [
        { value: { ja: "−5", en: "−5" }, unit: { ja: "時間/月", en: "h/mo" }, label: { ja: "管理者が勤怠の集計にかけていた時間", en: "Admin hours spent tallying attendance" } },
        { value: { ja: "−3〜4", en: "−3〜4" }, unit: { ja: "万円/月", en: "×10k JPY/mo" }, label: { ja: "打刻の偽装と記入漏れで出ていた給与の差異", en: "Payroll discrepancy from faked or missed clock-ins" } },
        { value: { ja: "初日", en: "Day 1" }, unit: { ja: "から", en: "" }, label: { ja: "説明なしでスタッフ全員が使い始めた", en: "All staff started using it without instructions" } },
      ],
    },
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
    heroTitle: {
      ja: "AIの活用を、個人任せからチームの開発手順へ。",
      en: "AI use, from up-to-each-person to a team development process.",
    },
    heroBody: {
      ja: "AIの使い方が個人任せで、人によって差が開き、うまくいくやり方もチームに広がらない。開発の手順をそろえて配り（標準化）、使い方と現在地が分かるようにする（可視化）。",
      en: "AI use is left to each person, so the gap widens and what works never spreads across the team. I align and distribute the development process (standardization) and make usage and where each person stands visible (visibility).",
    },
    problems: [
      {
        title: { ja: "AIの使い方が人によってばらばら", en: "Everyone uses AI differently" },
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
    stance: {
      kicker: "Verification over Generation",
      title: { ja: "生成より、検証", en: "Verification over generation" },
      body: [
        {
          ja: "AIがコードを書く時代、時間がかかるのは書くことではなく、書かれたものを信じられるか確かめることに変わった。AIは警告も出さずに自信を持って間違え、放っておけば破壊的な操作や機密の漏洩をそのまま本番へ通す。",
          en: "Now that AI writes the code, the time goes not into writing but into confirming that what was written can be trusted. AI is confidently wrong without warning, and left alone it will carry destructive operations or leaked secrets straight into production.",
        },
        {
          ja: "人が注意する約束は形骸化するので、破壊的なコマンドの遮断や機密の隔離はコードと設定で固定する。そのうえで「何が壊れてはいけないか」だけを人が決めて文書で承認し、テストと実装はAIに任せる。約束が破られれば機械が検知して止まる。この分業を保証駆動開発（GDD）と呼び、開発キットに入れている。",
          en: "Promises that rely on human attention erode, so blocking destructive commands and isolating secrets are fixed in code and config. On top of that, a human decides only what must not break and approves it in writing, while tests and implementation go to AI. When a promise is broken, the machine detects it and stops. I call this split Guarantee-Driven Development (GDD), and it is built into the kit.",
        },
      ],
      links: [
        { label: "Zenn — 保証駆動開発 (GDD)", href: "https://zenn.dev/yktsnet/articles/202608-guarantee-driven-development" },
        { label: "Zenn — Issue駆動ワークフロー", href: "https://zenn.dev/yktsnet/articles/202604-issue-driven-workflow" },
      ],
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
    process: [
      {
        title: { ja: "使い方と成果物を見る", en: "Look at usage and output" },
        body: {
          ja: "誰がどうAIを使い、何を出しているかを、リポジトリと利用状況から読む。",
          en: "Read who uses AI how, and what they ship, from the repositories and usage data.",
        },
        duration: { ja: "1〜2週間", en: "1–2 weeks" },
      },
      {
        title: { ja: "型を1つ入れる", en: "Introduce one unit" },
        body: {
          ja: "安全機構やPRの運用など、事故と手戻りを減らす単位から1つずつ入れる。",
          en: "Start with the units that cut accidents and rework, such as guards or the PR workflow, one at a time.",
        },
        duration: { ja: "2〜4週間", en: "2–4 weeks" },
      },
      {
        title: { ja: "評価基準で測って広げる", en: "Measure and expand" },
        body: {
          ja: "評価の軸で全員の現在地を位置づけ、研修で次に伸ばす軸を鍛える。",
          en: "Place everyone on the scale, then use training to raise the next axis.",
        },
        duration: { ja: "継続", en: "Ongoing" },
      },
    ],
    proof: {
      ja: "勤務先の開発会社で運用中。14のSkillで手順をそろえ、16の指標を毎日集計",
      en: "In use at the development company I work for: 14 skills align the process, 16 metrics tallied daily",
    },
  },
  {
    slug: "education",
    no: "03",
    icon: "graduation-cap",
    kicker: "EDUCATION",
    title: { ja: "教育事業の支援", en: "Education Business Support" },
    summary: {
      ja: "学習塾を12年経営してきた。その経験をもとに、塾へのプログラミング教室の導入から、出席や成績の仕組みまでを一緒に組み立て、募集の経路と通塾期間を広げる。",
      en: "Twelve years of running a tutoring school. Drawing on that, I help add programming classes to existing schools and build attendance and grading systems to widen enrollment channels and extend how long students stay.",
    },
    heroTitle: {
      ja: "生徒募集の経路を増やし、出席と成績の仕組みを整える。",
      en: "Open new enrollment channels and streamline attendance and grading.",
    },
    heroBody: {
      ja: "学習塾を12年経営した経験をもとに、塾へのプログラミング教室の導入と、出席・自習・成績の管理の仕組みを一緒に組み立てる。",
      en: "Based on twelve years of running a tutoring school, I help add programming classes to your school and build systems for managing attendance, self-study, and grades.",
    },
    problems: [
      {
        title: { ja: "生徒募集が頭打ちになっている", en: "Enrollment has plateaued" },
        body: {
          ja: "問い合わせの経路が限られ、小学生からの入口も無く、学年が上がると生徒が抜けていく。",
          en: "Inquiries come through few channels, there is no early-grade entry point, and students leave as they move up a grade.",
        },
      },
      {
        title: { ja: "入退室と自習の記録が手作業のまま", en: "Attendance and self-study logs are still by hand" },
        body: {
          ja: "紙の記録では保護者に知らせが届かず、自習に通った時間も残らない。",
          en: "Paper logs neither notify parents nor keep a record of self-study hours.",
        },
      },
      {
        title: { ja: "模試や教材の採点・分析に手が回らない", en: "No bandwidth to grade and analyze mock exams" },
        body: {
          ja: "紙の答案のままで、成績の推移や弱点を生徒・保護者に返しきれていない。",
          en: "Answers stay on paper, and grade trends or weak spots barely reach students and parents.",
        },
      },
    ],
    stance: {
      kicker: "Background",
      title: { ja: "教室を経営し、教えてきた", en: "I ran a school and taught in it" },
      body: [
        {
          ja: "学習塾を2013年に開き、12年経営した。経営の数字を見るのも、教室で教えるのも自分だった。",
          en: "I opened a tutoring school in 2013 and ran it for twelve years. Reading the numbers and teaching in the classroom were both my job.",
        },
        {
          ja: "教えるときは、言って聞かせるより、生徒が自分で進められるよう場と段取りを整えるほうが続いた。教室の運営の型も、その考え方で組み立てる。",
          en: "Setting up the room and the sequence so students could move on their own lasted longer than telling them what to do. I build class playbooks the same way.",
        },
      ],
    },
    offerings: [
      {
        icon: "laptop",
        title: { ja: "塾へのプログラミング教室の導入", en: "Adding Programming to a Tutoring School" },
        body: {
          ja: "学習塾の事業にプログラミング教室を加え、生徒を集める経路を増やす。小学生で入った子が中学・高校で塾のコースへ移れば、通う期間が延びる。",
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
        title: { ja: "NFCカードの出席管理", en: "NFC Attendance for Students" },
        body: {
          ja: "生徒がNFCカードをかざすと入退室が記録され、保護者へ知らせが届く。自習の時間も残るので、通った時間と成績の伸びを並べた資料が作れる。",
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
          ja: "紙の模試や教材をデータにし、採点と成績の分析に使える形にする。生徒や保護者が分析を見られるWebアプリまで作る。",
          en: "Turn paper mock exams and materials into data usable for grading and analysis, and build a web app where students and parents can see the analysis.",
        },
        points: [
          { ja: "紙の答案と教材をデータにする", en: "Convert paper answers and materials into data" },
          { ja: "成績の分析を自動で出す", en: "Generate grade analysis automatically" },
          { ja: "生徒と保護者が直接見られる画面を用意する", en: "Give students and parents a screen of their own" },
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
