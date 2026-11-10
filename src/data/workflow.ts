import type { MultilingualText } from '../lib/i18n';

// /services/ai-development/workflow/ の各節に並べる文言。図は DevDiagram.astro に直書きしている

type Point = { no: string; title: MultilingualText; body: MultilingualText };
type StepItem = { no: string; title: MultilingualText; tags: string[]; body: MultilingualText };

export const overviewPoints: Point[] = [
  {
    no: '01',
    title: {
      ja: '「要件定義担当」ではなく「顧客理解担当」を置く理由',
      en: 'Why "Customer Understanding" instead of "Requirements Analyst"',
    },
    body: {
      ja: 'AI で実装が速くなると、ずれたものを速く作ることが最大の失敗になる。仕様書をまとめる仕事は AI に移し、人の時間は何を作るべきかを決めることに使う。',
      en: 'When AI makes building fast, the biggest failure is building the wrong thing fast. Spec writing moves to AI; human time goes into deciding what to build.',
    },
  },
  {
    no: '02',
    title: {
      ja: '設計書を先に固めず、動く試作で暗黙知を引き出す理由',
      en: 'Why surface tacit knowledge with prototypes instead of upfront specs',
    },
    body: {
      ja: '利用者が慣れで回避している手間や書かれていない例外は、質問表では出てこない。答えを待って文書を重ねるより、仮置きで動く画面を先に見せるほうが、顧客自身も自分の要件に気づける。',
      en: 'Workarounds users take for granted and unwritten edge cases never appear in questionnaires. Showing a working screen built on explicit assumptions lets clients recognize their own needs far faster than piling up documents.',
    },
  },
  {
    no: '03',
    title: {
      ja: '人が見る場所を「書いて渡せない判断」だけに絞る理由',
      en: 'Why restrict human review to judgments that cannot be written down',
    },
    body: {
      ja: '値の照合や手順のチェックに人の注意力を使うとレビューが詰まる。人が止まるのは「約束（AC・保証）の承認」「使い心地」「マージ」だけに固定し、それ以外は別文脈の検証器で流す。',
      en: 'Spending human attention on value matching and procedural checks bottlenecks review. Humans stop only at three gates—approving promises (ACs & guarantees), UX feel, and merge—while isolated verifiers handle the rest.',
    },
  },
];

// 上流の2列。図の左右（顧客理解担当、実装担当）と同じ順に並べる
export const upstreamCols: { kicker: string; title: MultilingualText; items: StepItem[] }[] = [
  {
    kicker: 'Customer Understanding',
    title: {
      ja: '顧客理解担当：照会・回収を回し、試作から要件を決める',
      en: 'Customer Understanding: run Q&A skills and decide specs from prototypes',
    },
    items: [
      {
        no: '01',
        title: { ja: '照会と1か所への回収', en: 'Send & centralize answers' },
        tags: ['/qa-send', '/qa-collect'],
        body: {
          ja: '照会文面を下書きして送り、照会表・MTG・チャットのどこで出た回答も問いの Issue 1か所に集約する。',
          en: 'Draft inquiries to send, and funnel answers from spreadsheets, meetings, or chat into a single Question Issue.',
        },
      },
      {
        no: '02',
        title: { ja: '2段階レビューと正本の更新', en: 'Two-stage review & canonical spec updates' },
        tags: [],
        body: {
          ja: '試作を利用者より先に触り（社内レビュー）、直ったものを利用者に見せて反応を引き出す（利用者レビュー）。決まった要件を正本へマージするのはこの担当だけに絞る。',
          en: 'Touch the prototype before users do (internal review), then show the refined version to users to draw out feedback. Only this role merges confirmed specs.',
        },
      },
    ],
  },
  {
    kicker: 'Implementation',
    title: {
      ja: '実装担当：未確定を「仮置き」と「問い」に分けて試作',
      en: 'Implementation: split unknowns into assumptions and question Issues',
    },
    items: [
      {
        no: '03',
        title: { ja: '仮置き一覧に分離して作る', en: 'Isolate in an assumption list' },
        tags: [],
        body: {
          ja: 'AI が黙って選んだ前提がそのまま本番に残らないよう、仮に置いた仕様は一覧に明記して確定分と分ける。',
          en: 'So silent AI guesses never slip into production, provisional choices are recorded in a dedicated assumption list separate from confirmed specs.',
        },
      },
      {
        no: '04',
        title: { ja: '問いを起こし、回答を読む', en: 'Open questions & apply answers' },
        tags: ['/client-next'],
        body: {
          ja: '先方の判断が要る点は同じ変更で「問いの Issue」に起こして渡す。戻った回答は次の起票時に読み、仮置きと違えば直しの Issue にする。',
          en: 'Items needing client decisions are opened as Question Issues in the same change. Returned answers are read on the next draft and turned into fix Issues if they differ.',
        },
      },
    ],
  },
];

export const downstreamSteps: StepItem[] = [
  {
    no: '01',
    title: {
      ja: '実装前に Issue で約束を切る',
      en: 'Approve promises in the Issue before building',
    },
    tags: ['/issue-draft'],
    body: {
      ja: '後から条件を決めると、できたコードに合わせた甘い条件になる。',
      en: 'Defining criteria after the code is written leads to lenient tests tailored to the implementation.',
    },
  },
  {
    no: '02',
    title: {
      ja: '文脈を切って新セッションで1本通しで作る',
      en: 'Build end-to-end in a fresh session',
    },
    tags: ['/issue-work'],
    body: {
      ja: '起票時の相談の文脈を持ち込むと、書かれていない暗黙の了解で実装が進む。',
      en: 'Carrying over the drafting conversation lets unwritten assumptions slip into code.',
    },
  },
  {
    no: '03',
    title: {
      ja: '作った者は判定しない',
      en: 'The builder never judges its own work',
    },
    tags: ['screen-operator', 'issue-verifier'],
    body: {
      ja: '自分で書いたテストで自分の実装を確かめると、自分の解釈で合格にする。',
      en: 'An agent testing its own code grades on its own interpretation.',
    },
  },
  {
    no: '04',
    title: {
      ja: '手戻りの原因を仕組みへ還流する',
      en: 'Feed rework causes back into Skills and Hooks',
    },
    tags: ['/rework-review'],
    body: {
      ja: '判定がすべて通れば止まらずに証拠付き PR を出す。実装中にやり直した箇所（手戻り）は PR に記録し、繰り返す原因を集計して Skill の手順と Hook の更新へ戻す。',
      en: 'When all checks pass, an evidence-backed PR is opened without stopping. Rework during implementation is logged in the PR and aggregated to update Skill steps and mechanical Hooks.',
    },
  },
];

// 架空の受注管理案件での見本
export const acSampleJa = `## AC（完了条件）
- [ ] 確認書を送り直す画面を開くと、送り先に前回の送り先が入っている
- [ ] 前回の送り先が無い注文では、送り先を空のままにする

## 保証（壊してはいけない振る舞い）
- 送り先を書き換えて送っても、注文マスタの記録は書き換えない`;

export const acSampleEn = `## AC (Acceptance Criteria)
- [ ] Opening the resend screen pre-fills the last recipient address
- [ ] Orders without a previous recipient leave the address blank

## Guarantees (Invariants)
- Editing the recipient on resend never mutates the master order record`;

export const verdicts: { no: MultilingualText; ac: MultilingualText; evidence: string }[] = [
  {
    no: { ja: 'AC 1', en: 'AC 1' },
    ac: { ja: '前回の送り先が入る', en: 'Pre-fills last recipient address' },
    evidence: 'TestResendPrefillsLastAddress',
  },
  {
    no: { ja: 'AC 2', en: 'AC 2' },
    ac: { ja: '前回が無ければ空のまま', en: 'Leaves blank when no history' },
    evidence: 'TestResendWithoutHistoryLeavesBlank',
  },
  {
    no: { ja: '保証', en: 'Guarantee' },
    ac: { ja: '注文マスタの記録は書き換えない', en: 'Master order record is unchanged' },
    evidence: 'TestResendKeepsAddressHistory',
  },
];
// 04 の補足。左が役割の分け方、右が機械で止める規則
export const decisions: { kicker: string; title: MultilingualText; items: { lead: MultilingualText; body: MultilingualText }[] }[] = [
  {
    kicker: 'Agent Architecture',
    title: { ja: '役割ごとにエージェントを分けない', en: 'Do not split agents by role' },
    items: [
      {
        lead: { ja: '実装は1セッション通し：', en: 'Single session for implementation: ' },
        body: { ja: '役割ごとに分けると、受け渡しのたびに「なぜそうしたか」が落ちる。', en: 'Splitting by role drops the "why" at every handoff.' },
      },
      {
        lead: { ja: '文脈を切る理由がある所だけ subagent：', en: 'Subagents only when isolation matters: ' },
        body: { ja: '確認者の判定・画面操作の重い出力・並行の読み合わせだけに限定する。', en: 'Used only for verifier judgment, heavy UI operator output, and parallel spec checks.' },
      },
    ],
  },
  {
    kicker: 'Mechanical Guards',
    title: { ja: '守らせる規則はプロンプトではなく Hook で止める', en: 'Enforce rules with Hooks, not prompts' },
    items: [
      {
        lead: { ja: '破壊的・越権操作の遮断（guards）：', en: 'Block destructive actions (guards): ' },
        body: { ja: 'main への直接 push、権限のない自動マージ、メイン作業ツリーでの checkout を機械的に止める。', en: 'Mechanically block direct pushes to main, unauthorized auto-merges, and branch checkouts in the main worktree.' },
      },
      {
        lead: { ja: '秘密情報の混入防止（secret-guard）：', en: 'Prevent secret leaks (secret-guard): ' },
        body: { ja: '.env や鍵の読み書き・git add を settings.json の deny とフックで遮断する。', en: 'Block reading, writing, or staging .env and key files via settings.json deny rules and pre-tool hooks.' },
      },
    ],
  },
];
