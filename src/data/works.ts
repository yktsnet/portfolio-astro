import type { MultilingualText } from "../lib/i18n";

/**
 * カテゴリ定義の一元管理。
 * - icon: 表示に使う Lucide アイコン名
 * 未定義のカテゴリは getCategoryIcon が汎用 "tag" を返す。
 */
export const CATEGORIES: Record<string, { icon: string }> = {
  iot: { icon: "wifi" },
  modernization: { icon: "refresh-cw" },
  team: { icon: "users" },
  ai: { icon: "ghost" },
  trading: { icon: "trending-up" },
  finance: { icon: "piggy-bank" },
  devtools: { icon: "hammer" },
};

/** カテゴリのアイコン名を返す（未定義は汎用 "tag"）。 */
export function getCategoryIcon(tag: string): string {
  return CATEGORIES[tag]?.icon ?? "tag";
}

export type Work = {
  /** 「何をする作品か」を表す1軸。CATEGORIES のキーから選ぶ */
  categoryTag: string;
  priority: number;
  title: string;
  icon: string;
  /** 一覧で他のカードと長さを揃える。目安は ja 80〜110字・en 150〜250字 */
  description: MultilingualText;
  /** 現場に導入・稼働中なら true */
  inUse?: boolean;
  /** 公開年月。表記は "2024.08" のようなドット区切り。 */
  publishedAt?: string;
  /** カードの主導線（GitHub） */
  href: string;
};

export const works: Work[] = [
  {
    categoryTag: "iot",
    priority: 1,
    title: "NFC Attendance Kit",
    icon: "id-card",
    publishedAt: "2026.01",
    description: {
      ja: "NFC カードをかざすだけで打刻が完結し、Google スプレッドシートへ自動集計。Python 標準ライブラリのみで構成し、Raspberry Pi 2 や旧 PC でも依存ゼロで動く。",
      en: "Automated attendance tracking by tapping NFC cards, logging directly to Google Sheets. Built using only the Python standard library with zero dependencies, running seamlessly even on Raspberry Pi 2 or old PCs.",
    },
    inUse: true,
    href: "https://github.com/yktsnet/nfc-attendance-kit",
  },
  {
    categoryTag: "iot",
    priority: 2,
    title: "Cat Feed Tracker",
    icon: "cat",
    publishedAt: "2026.03",
    description: {
      ja: "給餌棚の開閉を自動検知し、LINE で家族へ定時通知する家庭向け IoT。Pico W → FastAPI → PostgreSQL 構成で、体重管理や設定変更まで LINE で完結。",
      en: "Home IoT system detecting feeding cabinet opening/closing and sending scheduled LINE notifications to family members. Powered by Pico W → FastAPI → PostgreSQL, with weight tracking and configuration manageable via LINE.",
    },
    inUse: true,
    href: "https://github.com/yktsnet/cat-feed-tracker",
  },
  {
    categoryTag: "team",
    priority: 2,
    title: "Training Scheduler",
    icon: "graduation-cap",
    publishedAt: "2026.05",
    description: {
      ja: "機械的な進捗管理ではなく、新人の手応えをメンターと共有する研修支援ツール。Vue + Go を go:embed で単一バイナリに固め、SQLite のみでインフラ依存ゼロ。",
      en: "Mentorship-focused training support tool for sharing newcomer feedback instead of mechanical progress tracking. Vue + Go bundled into a single binary via go:embed, requiring zero infrastructure dependencies with SQLite.",
    },
    href: "https://github.com/yktsnet/training-scheduler",
  },
  {
    categoryTag: "modernization",
    priority: 1,
    title: "Order System",
    icon: "shopping-cart",
    publishedAt: "2026.05",
    description: {
      ja: "WinForms の密結合を解体し、.NET 10 Web API + React へ段階的移行。LangGraph を独立追加し、自然言語で在庫・売上を照会できる AI エージェントを統合。",
      en: "Gradual migration from tightly coupled WinForms to .NET 10 Web API + React. Integrates an independent LangGraph AI agent for querying inventory and sales using natural language.",
    },
    href: "https://github.com/yktsnet/order-system-migration",
  },
  {
    categoryTag: "ai",
    priority: 1,
    title: "Order System RAG",
    icon: "book-search",
    publishedAt: "2026.06",
    description: {
      ja: "帳票 PDF の文脈検索と DB 集計を統合し、自然言語で横断照会できる AI 基盤。Azure で帳票を構造化し、LangGraph が質問の性質に応じて SQL と RAG へ自動で振り分ける。",
      en: "Hybrid AI search unifying SQL aggregation and RAG document lookup for business forms. Structures PDFs via Azure and routes queries to SQL or RAG engines using LangGraph.",
    },
    href: "https://github.com/yktsnet/order-system-rag",
  },
  {
    categoryTag: "modernization",
    priority: 1,
    title: "Attendance System",
    icon: "clock",
    publishedAt: "2026.05",
    description: {
      ja: "AutoPostBack・ViewState を解体し、.NET 10 Web API + React へ段階的移行。SignalR を追加し、WebForms では不可能だったリアルタイム打刻監視を実装。",
      en: "Step-by-step modernization of legacy WebForms to .NET 10 Web API + React by eliminating AutoPostBack and ViewState. Adds SignalR for real-time attendance monitoring.",
    },
    href: "https://github.com/yktsnet/attendance-system-migration",
  },
  {
    categoryTag: "ai",
    priority: 1,
    title: "Folio Agent",
    icon: "bot",
    publishedAt: "2026.07",
    description: {
      ja: "開発者ポートフォリオ向けに、ビルド時自動同期で知識更新を不要にした受付チャットボット。Zenn 記事の取り込みや Contact への誘導は、設定のオンオフで切り替えられる。",
      en: "Reception chatbot widget for developer portfolios with zero-maintenance build-time knowledge synchronization. Features easy toggling for Zenn article ingestion and contact routing.",
    },
    href: "https://github.com/yktsnet/folio-agent",
  },
  {
    categoryTag: "modernization",
    priority: 2,
    title: "Excel Kanri",
    icon: "user-pen",
    publishedAt: "2026.07",
    description: {
      ja: "既存の Excel 帳票運用はそのままに、Web フォーム生成・共有フォルダの PDF 自動変換・全文検索を後付け。clone して使う汎用モジュール群 + FastAPI/React リファレンス実装。",
      en: "Retrofit web forms, shared folder PDF conversion, and full-text search without breaking existing Excel workflows. Provides cloneable modules with a FastAPI/React reference implementation.",
    },
    inUse: true,
    href: "https://github.com/yktsnet/excel-kanri",
  },
  {
    categoryTag: "trading",
    priority: 2,
    title: "bt-lab",
    icon: "flask-conical",
    publishedAt: "2026.07",
    description: {
      ja: "複数の戦略を横断検証し、エントリー率・ドローダウン・Recovery Factorでランキングする8段のバックテスト探索パイプライン。単一戦略の過剰最適化を避け、成績が大きく落ち込みにくい戦略候補を継続的に選抜する。",
      en: "An 8-stage backtest exploration pipeline ranking multi-strategy candidates by entry rate, drawdown, and Recovery Factor to avoid single-strategy overfitting.",
    },
    href: "https://github.com/yktsnet/bt-lab",
  },
  {
    categoryTag: "trading",
    priority: 2,
    title: "live-dynamic",
    icon: "zap",
    publishedAt: "2026.07",
    description: {
      ja: "bt-dynamic で検証した戦略を、同一コード・同一設定のまま実弾に接続する実行層。発注ゲートやキルスイッチ等の安全設計を備え、systemd timer による無人運転まで実装。",
      en: "Execution layer connecting strategies validated in bt-dynamic to live trading with identical logic. Features safety gates and kill switches, running unattended via systemd timers.",
    },
    href: "https://github.com/yktsnet/live-dynamic",
  },
  {
    categoryTag: "finance",
    priority: 2,
    title: "etax-prep",
    icon: "japanese-yen",
    publishedAt: "2026.08",
    description: {
      ja: "給与所得がありながら副業で事業所得がある人のための帳簿。入力は金額と勘定科目だけで、複式簿記・家事按分・給与との合算は裏側で導出し、確定申告書へ転記できる集計まで出力する。",
      en: "Bookkeeping for a salaried worker with side-business income. Entry takes only an amount and an account; double-entry, household apportionment, and the salary merge are derived behind the scenes, down to figures ready to transcribe onto a tax return.",
    },
    href: "https://github.com/yktsnet/etax-prep",
  },
  {
    categoryTag: "team",
    priority: 1,
    title: "sdlc-kit",
    icon: "gift",
    publishedAt: "2026.09",
    description: {
      ja: "1人で固めた開発の型を、チームのリポジトリへ1コマンドで取り込める配布キット。裁可の記録場所や手順ごと、作業フロー・駆動文書・保証台帳を選択して組み込める。",
      en: "A distribution kit that imports a solo-hardened dev process into team repos in one command. Packages workflows, driving docs, and assurance ledgers along with audit procedures.",
    },
    href: "https://github.com/yktsnet/sdlc-kit",
  },
  {
    categoryTag: "team",
    priority: 2,
    title: "ladder-kit",
    icon: "person-standing",
    publishedAt: "2026.09",
    description: {
      ja: "エージェントで開発を回すチームのエンジニア評価ラダー。5軸5段階の判定文で sdlc-kit の成果物を名指しし、在籍者の評価から採用選考までを1本の物差しに乗せる。",
      en: "An engineer ladder for teams developing with AI agents. Uses a 5-axis, 5-level criteria tied to sdlc-kit artifacts to unify internal evaluation and hiring on a single scale.",
    },
    href: "https://github.com/yktsnet/ladder-kit",
  },
  {
    categoryTag: "ai",
    priority: 2,
    title: "tg-dev-digest",
    icon: "mailbox",
    publishedAt: "2026.09",
    description: {
      ja: "はてブ・Zenn・GitHub Trending から記事を選び、毎日 Telegram へ届ける配信バッチ。Claude Haiku の選別と GitHub Actions 実行でサーバーを置かず、完全自動で運用。",
      en: "A daily batch that curates tech articles from Hatena, Zenn, and GitHub Trending to Telegram. Runs serverless on GitHub Actions using Claude Haiku for lightweight selection.",
    },
    href: "https://github.com/yktsnet/tg-dev-digest",
  },
  {
    categoryTag: "devtools",
    priority: 2,
    title: "codeview",
    icon: "smartphone",
    publishedAt: "2026.10",
    description: {
      ja: "手元の git リポジトリと Issue を静的 HTML にし、自分だけが読めるコードブラウザとして Cloudflare で配信する。スマホで読んだ箇所をそのままエージェントへ渡せる。",
      en: "Turns local git repos and their GitHub issues into static HTML, a private code browser behind Cloudflare Access. Read it on your phone and hand what you find straight to an agent.",
    },
    href: "https://github.com/yktsnet/codeview",
  },
  {
    categoryTag: "devtools",
    priority: 2,
    title: "ccreel",
    icon: "history",
    publishedAt: "2026.10",
    description: {
      ja: "Claude Code のセッション履歴を ssh/rsync のハブに集め、全端末・全リポの会話を1つの一覧から探して resume する CLI。同梱の skill で、Claude Code も過去の会話を1回の検索で引き当てる。",
      en: "A CLI that gathers Claude Code session history from every machine into an ssh/rsync hub, so you can find and resume any conversation from one fzf list. A bundled skill lets Claude Code pull up the right past session in a single lookup.",
    },
    href: "https://github.com/yktsnet/ccreel",
  },
];


/**
 * Research セクション用の型。
 * Works カードのスタイルを踏襲しつつ、カテゴリタグや技術スタックなどを省いて軽量化したカードを表示する。
 */
export type Research = {
  title: string;
  description: MultilingualText;
  href: string;
  publishedAt?: string;
};

export const researches: Research[] = [
  {
    title: "wiki-guessur",
    description: {
      ja: "冒頭の定義文が除去された Wikipedia 記事の同定ベンチマーク。数式 / GBDT / LLM 再判定の 4 手法 × 5 シードで MRR を実測。",
      en: "Identification benchmark for Wikipedia articles with redacted lead definitions. Evaluates MRR across 4 methods (Math / GBDT / LLM re-ranking) x 5 seeds.",
    },
    href: "https://github.com/yktsnet/wiki-guessur",
    publishedAt: "2026.07",
  },
];
