// /services/ai-development/ の各節に並べる文言。組みはページ（src/pages/services/ai-development.astro）に書く
import { services } from './services';
import { gddArticle } from './articles';
import type { Fit, Link, Metric, OfferingDetail, Step } from '../types';

// 提供できることのリポと勉強会の名前は、トップのカードと同じサービスの値を読む
const s = services.find((x) => x.slug === 'ai-development')!;

// リポとは別に、記事やスライドへのリンクを添えられる
export type AiOfferingDetail = OfferingDetail & { links?: Link[] };
// 導入先の数字は出せないので、変わったことを文で並べる
// 01 の数字の位置に、出せる数（配った Skill・集計する指標・評価基準の軸と段階）を置く
export const changes: Metric[] = [
  {
    value: { ja: '14', en: '14' },
    unit: { ja: 'Skill', en: 'skills' },
    label: { ja: '慣れていない人も、同じ手順で開発できる', en: 'Newcomers develop with the same process' },
  },
  {
    value: { ja: '16', en: '16' },
    unit: { ja: '指標', en: 'metrics' },
    label: { ja: '誰がどれだけ活用しているかが毎日分かる', en: 'Who is using it well is visible every day' },
  },
  {
    value: { ja: '5×5', en: '5×5' },
    unit: { ja: '軸×段階', en: 'axes × levels' },
    label: { ja: '在籍者と候補者を同じ評価基準で点数化', en: 'Staff and candidates scored on the same criteria' },
  },
];

// 勤務先で配っているものの公開版。提供できることの各カードに、offerings と同じ順で1つずつ出す
export const offeringRepos = [
  s.offerings[0].repos.find((r) => r.name === 'sdlc-kit')!,
  s.offerings[1].repos.find((r) => r.name === 'mgmt-kit')!,
];

export const steps: Step[] = [
  {
    no: '01',
    title: { ja: '数字から直すものを決める', en: 'Decide what to fix from the numbers' },
    done: {
      ja: '誰がどれだけ使い、何を出しているかの数字が無く、成果物の形も人ごとにばらばらだった。そこで、手順をそろえる開発キットと、利用量・成果の集計を同時に始めた。',
      en: 'There were no numbers on who used AI how much or what they produced, and output varied by person. So I started the development kit and the usage and output tally at the same time.',
    },
  },
  {
    no: '02',
    title: { ja: '現場のやり方を変えずに作る', en: 'Build without changing how people work' },
    done: {
      ja: 'まず自分の開発で回して確かめたものを単位に切り分けて配った。一度に全部を押しつけず、案件や人に合わせて使える単位から1つずつ入れた。',
      en: 'I packaged what I had first tested in my own work into separate units. Rather than forcing the whole thing at once, I introduced it one unit at a time to fit each project and person.',
    },
  },
  {
    no: '03',
    title: { ja: '回り出すまで付き合って渡す', en: 'Stay until it runs, then hand it over' },
    done: {
      ja: '毎日の集計で活用の度合いを見ながら声をかけ、使った人の意見でキットを直し続けている。同じ評価基準で求人も書き、採用と育成まで一続きにした。',
      en: 'Watching daily usage lets us reach out and teach, and I keep refining the kit from feedback. Job listings now use the same criteria, tying hiring and growth together.',
    },
  },
];

// services.ts の offerings の先頭2つ（開発キット、エンジニアの評価）と同じ順に並べる
export const offeringDetails: AiOfferingDetail[] = [
  {
    line: {
      ja: 'うまくいった進め方を、本人だけでなくチームの誰もが使えるようにする。開発の手順と安全機構を、リポジトリに取り込める単位にして配り、誰が担当しても同じ形の成果物が出るようにする。',
      en: 'What worked for one person becomes usable by everyone on the team. The development steps and safeguards are packaged as units that drop into a repository, so whoever takes the work produces the same shape of output.',
    },
    before: [
      { ja: '頼み方が人ごとに違い、成果物の形もそろわない', en: 'Everyone asks differently, and output never looks the same' },
      { ja: 'なぜそう作ったか、何を確かめたかが、作業した人の頭にしか残らない', en: 'Why it was built that way and what was checked stay in one person\'s head' },
    ],
    after: [
      { ja: '担当者が替わっても、同じ形の成果物が出る', en: 'Output keeps its shape when the person changes' },
      { ja: '合意と確認の記録が、IssueとPRとしてリポジトリに残る', en: 'Agreements and checks stay in the repository as issues and PRs' },
    ],
    decisions: [
      {
        title: { ja: 'AIが自力でできないところだけを型にする', en: 'Only package what the AI cannot do alone' },
        body: { ja: '人の判断を省かせない、記録を残す、担当者が替わっても揃える。この3つに当たるものだけを配る。', en: 'Keep human decisions in, keep records, stay consistent across people. Only what serves these is distributed.' },
      },
      {
        title: { ja: '約束の承認を先に行う', en: 'Approve the promises first' },
        body: { ja: '壊れてはいけないことを人が承認し、テストと実装はエージェントに任せる（保証駆動開発）。', en: 'People approve what must not break; the agent writes the tests and code (guarantee-driven development).' },
      },
    ],
    links: [gddArticle],
  },
  {
    line: {
      ja: 'エンジニアの仕事を、エンジニアでない人が読んで決められる形にする。評価者はいつものシートに判定を書くだけで、1人ずつの段階と次に伸ばす軸が画面に出る。育成と採用は、同じ評価基準で決める。',
      en: 'Engineers\' work is put in a form that people who are not engineers can read and decide on. Reviewers just write verdicts in their usual sheet, and each person\'s level and next axis to grow appear on screen. Growth and hiring are decided on the same criteria.',
    },
    before: [
      { ja: '成果物はリポジトリにあり、経営や人事からは読めない', en: 'The work sits in repositories, where executives and HR cannot read it' },
      { ja: '評価と採用の基準が別々で、見る人によって判断がぶれる', en: 'Evaluation and hiring use separate criteria, so judgment varies by person' },
    ],
    after: [
      { ja: '在籍者と採用候補者を、同じ5つの軸で比べられる', en: 'Staff and candidates are compared on the same five axes' },
      { ja: '1人ずつの段階・次に伸ばす軸・利用状況が、1つの画面に毎日並ぶ', en: 'Each person\'s level, next axis and usage are laid out on one screen every day' },
    ],
    decisions: [
      {
        title: { ja: '軸を先に決める', en: 'Axes come first' },
        body: { ja: '何を測るかを先に決め、それが成果物に出るように開発キットを作っている。', en: 'What to measure is decided first, and the kit is built so it shows up in the output.' },
      },
      {
        title: { ja: '採用でも同じ5つの軸を使う', en: 'Use the same five axes for hiring' },
        body: { ja: '在籍者は日々の成果物で、採用候補者は面接と課題で、同じ5つの軸を測る。型の運用だけは入社前に測れないので、入社後に測り直す。', en: 'Current staff are measured through daily deliverables, and candidates through interviews and tasks, on the same five axes. Workflow use cannot be measured before joining, so it is measured again after.' },
      },
      {
        title: { ja: 'マネジメントは慣れたシートに書く', en: 'Managers write in the sheet they know' },
        body: { ja: '評価の判定や面接の記録は Drive のシートに書くだけにし、集計と見える化はアプリが受け持つ。', en: 'Review verdicts and interview notes only go into a sheet on Drive; the app handles the tallying and the display.' },
      },
    ],
    links: [{ label: { ja: 'Slides — エンジニア評価基準', en: 'Slides — Engineer evaluation criteria' }, href: 'https://github.com/yktsnet/mgmt-kit/blob/main/ladder/README.md' }],
  },
];

// 勉強会は単独でも頼める。客先で AI を使えない社員には、評価の材料を作る場にもなる
export const training = {
  offering: s.offerings[2],
  line: {
    ja: '配属先に左右されず、社員が開発の経験を積めるようにする。講師が教える研修ではなく、社員どうしがAIで作って見せ合い、教え合う場を、会社が業務の外に用意する。',
    en: 'Staff gain development experience regardless of where they are assigned. Instead of a lecture course, the company sets up a place outside client work where staff build with AI, show each other and teach each other.',
  },
  problems: [
    { ja: '客先がAIを認めているかどうかで、同じ会社の社員でも経験の差が開く', en: 'Whether a client allows AI splits experience within one company' },
    { ja: '社員が何をできるようになったかが、会社から見えない', en: 'The company cannot see what its staff have learned to do' },
  ],
  plan: [
    { ja: '3か月・全6回。1回90分をオンラインで行う', en: 'Three months, six 90-minute sessions online' },
    { ja: '半分以上は、各自が手を動かして班で見せ合う時間にする', en: 'Over half the time is hands-on work and small-group show-and-tell' },
    { ja: '最終回で、自分で選んだ課題を形にして発表する', en: 'In the last session, each person presents a problem they chose and built' },
  ],
  links: [{ label: { ja: 'Slides — AI勉強会の提案', en: 'Slides — AI study group proposal' }, href: 'https://github.com/yktsnet/mgmt-kit/blob/main/training/README.md' }],
};

export const fits: Fit[] = [
  { text: { ja: '複数人がAIエージェントで開発している受託開発の会社', en: 'Contract development firms where several people build with AI agents' } },
  { text: { ja: '使い方と成果物の形を、担当者が替わってもそろえたい', en: 'Wanting usage and output to stay consistent when people change' } },
  { text: { ja: 'エンジニアの評価・採用・育成の基準がばらばら', en: 'Engineer evaluation, hiring and growth run on different criteria' } },
  { text: { ja: '評価や採用を決めるのが、エンジニアでない人', en: 'Evaluation and hiring are decided by people who are not engineers' } },
  {
    text: { ja: '客先常駐の社員が多く、触れる機会に差がある', en: 'Many staff stationed at clients, with uneven access' },
    reason: { ja: '勉強会', en: 'study group' },
  },
];

export const misfits: Fit[] = [
  {
    text: { ja: 'GitHub以外で開発している', en: 'Development outside GitHub' },
    reason: { ja: '開発キットと利用状況の集計は、GitHubのIssueとPRを前提にしている', en: 'the kit and usage tally assume GitHub issues and PRs' },
  },
  {
    text: { ja: 'Claude Code以外のエージェントが中心', en: 'Mainly agents other than Claude Code' },
    reason: { ja: '利用状況はClaude Codeのデータを読む', en: 'usage reads Claude Code data' },
  },
  {
    text: { ja: '1人で開発している', en: 'A single developer' },
    reason: { ja: 'そろえる相手も、比べる相手もいない', en: 'there is no one to align with or compare against' },
  },
];
