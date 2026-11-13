import type { MultilingualText } from "../lib/i18n";

// 未定義のカテゴリは getCategoryIcon が汎用の "code" に落とす
export const CATEGORIES: Record<string, { icon: string }> = {
  devtools: { icon: "hammer" },
  ai: { icon: "ghost" },
  finance: { icon: "piggy-bank" },
  trading: { icon: "trending-up" },
  modernization: { icon: "refresh-cw" },
  iot: { icon: "wifi" },
};

export function getCategoryIcon(tag: string): string {
  return CATEGORIES[tag]?.icon ?? "code";
}

export type Work = {
  title: string;
  icon: string;
  // 「何をする物か」の1軸。CATEGORIES のキーから選ぶ
  categoryTag: string;
  // 3列のカードで省略せずに収まる長さにする。目安は ja 60〜70字
  description: MultilingualText;
  // "2026.08" のようなドット区切り
  publishedAt: string;
  href: string;
};

type WorkInput = Omit<Work, "href">;
const work = (w: WorkInput): Work => ({ ...w, href: `https://github.com/yktsnet/${w.title}` });

// 並びはこの配列の順。新しい順に置く
// Services の提供物からリンクしているリポは載せない（works.test.ts が弾く）
export const works: Work[] = [
  work({
    title: "ccreel",
    icon: "history",
    categoryTag: "devtools",
    publishedAt: "2026.10",
    description: {
      ja: "全端末の Claude Code の会話を1か所に集め、1つの一覧から探して再開できる CLI。同梱の skill で、Claude Code 自身も過去の会話を引ける。",
      en: "Gathers Claude Code conversations from every machine into one list to find and resume. A bundled skill lets Claude Code look up past sessions too.",
    },
  }),
  work({
    title: "codeview",
    icon: "smartphone",
    categoryTag: "devtools",
    publishedAt: "2026.10",
    description: {
      ja: "手元の git リポジトリと Issue を、自分だけが読めるコードブラウザにする。スマホで読んだ箇所をエージェントへ渡せる。",
      en: "Turns local git repos and issues into a private code browser served on Cloudflare. What you read on your phone can go straight to an agent.",
    },
  }),
  work({
    title: "tg-dev-digest",
    icon: "mailbox",
    categoryTag: "ai",
    publishedAt: "2026.09",
    description: {
      ja: "はてブ・Zenn・GitHub Trending から Claude Haiku が記事を選び、毎日 Telegram へ届ける。サーバーは置かない。",
      en: "Claude Haiku picks articles from Hatena, Zenn, and GitHub Trending and sends them to Telegram daily, with no server to run.",
    },
  }),
  work({
    title: "etax-prep",
    icon: "japanese-yen",
    categoryTag: "finance",
    publishedAt: "2026.08",
    description: {
      ja: "会社員の副業のための帳簿。金額と勘定科目を入れるだけで、複式簿記・家事按分・給与との合算を導き、確定申告に転記できる集計まで出す。",
      en: "Books for a salaried worker's side business. Enter an amount and an account; double-entry, apportionment, and the salary merge are derived, down to tax return totals.",
    },
  }),
  work({
    title: "folio-agent",
    icon: "bot",
    categoryTag: "ai",
    publishedAt: "2026.07",
    description: {
      ja: "ポートフォリオサイトに置く受付チャットの npm パッケージ。ページや記事から知識をビルド時に作るので、手で更新しなくてよい。",
      en: "An npm package for a reception chat on a portfolio site. Knowledge is built from the pages, Zenn articles, and GitHub READMEs at build time, so nothing is updated by hand.",
    },
  }),
  work({
    title: "drip-sim-public",
    icon: "flask-conical",
    categoryTag: "trading",
    publishedAt: "2026.07",
    description: {
      ja: "複数の売買戦略を8段のバックテストで横断して検証し、ドローダウンと Recovery Factor で順位を付けて、落ち込みにくい候補を選び続ける。",
      en: "Backtests many trading strategies across 8 stages and ranks them by drawdown and Recovery Factor, to keep picking candidates that hold up.",
    },
  }),
  work({
    title: "drip-live-public",
    icon: "zap",
    categoryTag: "trading",
    publishedAt: "2026.07",
    description: {
      ja: "バックテストで確かめた戦略を、同じコード・同じ設定のまま実際の発注につなぐ。発注ゲートとキルスイッチを備え、systemd timer で無人で動く。",
      en: "Connects a backtested strategy to live orders with the same code and settings. Order gates and a kill switch included; runs unattended on systemd timers.",
    },
  }),
  work({
    title: "order-system-rag",
    icon: "book-search",
    categoryTag: "ai",
    publishedAt: "2026.06",
    description: {
      ja: "帳票の PDF 検索と DB の集計を合わせた AI 検索。LangGraph が質問に応じて SQL と RAG に振り分ける。",
      en: "AI search over form PDFs and database totals in plain language. LangGraph routes each question to SQL or RAG.",
    },
  }),
  work({
    title: "order-system-migration",
    icon: "shopping-cart",
    categoryTag: "modernization",
    publishedAt: "2026.05",
    description: {
      ja: "WinForms の受発注システムを .NET 10 + React へ段階的に移し、在庫と売上を自然言語で聞ける AI を足した。",
      en: "Moves a WinForms order system to .NET 10 Web API + React step by step, adding an AI agent that answers stock and sales questions in plain language.",
    },
  }),
  work({
    title: "attendance-system-migration",
    icon: "clock",
    categoryTag: "modernization",
    publishedAt: "2026.05",
    description: {
      ja: "WebForms の勤怠システムを .NET 10 + React へ段階的に移し、SignalR で打刻をリアルタイムに見られるようにした。",
      en: "Moves a WebForms attendance system to .NET 10 Web API + React step by step, adding SignalR for real-time clock-in monitoring.",
    },
  }),
  work({
    title: "cat-feed-tracker",
    icon: "cat",
    categoryTag: "iot",
    publishedAt: "2026.03",
    description: {
      ja: "給餌棚の開け閉めを検知し、家族へ LINE で決まった時刻に知らせる家庭向けの IoT。体重の記録や設定の変更も LINE で済む。",
      en: "Home IoT that detects the feeding cabinet opening and notifies the family on LINE at set times. Weight logs and settings are handled in LINE too.",
    },
  }),
];
