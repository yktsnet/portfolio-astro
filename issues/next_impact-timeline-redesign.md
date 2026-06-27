## Impact セクションを縦タイムライン構成に再設計
id: next
branch-slug: impact-timeline-redesign
github_issue: 48
status: close
type: feat
対象: |
  src/components/Impact.astro（全面書き換え。下記「実装コード」で丸ごと置換）
内容: |
  Impact が Approach に比べて情報量が薄く弱い。経歴のナラティブ
  （NFC勤怠キット納品 → オーナーの現場離脱 → 外部CTO・法人化伴走）を
  新設の「縦タイムライン」で主役に据え、既存の3ストリームは「いま動いている戦線」
  として下に残す。リード文は Approach と重複する概念句を捨て、
  「経営も実装もできる」ポジションを1文に圧縮する。

  視覚イディオムは Approach（横カード＋矢印）と意図的に変える。
  タイムラインは絶対配置の縦レール＋ノードの丸で構成し、Tailwind の
  ユーティリティのみで実装する（新規ライブラリ・新規ファイルは不要）。

  デザインは確定済み。Claude Code 側で再設計は不要。下記コードをそのまま反映する。
確認: |
  npm run typecheck が通ること。
  arrow-right アイコンが src/lib/lucide.ts に存在することを確認（Approach.astro が既に使用）。
  既存の Stream 型・streams 配列・metric 値・repo リンクが保持されていること。

---

## 設計の意図（変更時に壊してはいけない不変条件）

- **上＝タイムライン（経歴の弧）/ 下＝戦線（現在の仕事）** の2層構成。役割が違うので統合しない。
- **重複回避**: 勤怠の metric（`月 −5h ／ 差異 −3〜4万`）と repo リンクは下の「勤怠 DX」ストリーム行にのみ置く。タイムライン起点ノードには置かない（起点ノードは Works への導線リンクだけ）。
- **タイムラインは時系列**。Approach の横フロー（＝手順）とは意味が異なるので、横並びカードに戻さない。
- 現在地ノード（3つ目）だけ accent 色＋塗りつぶしの丸にする。

## 確定コピー

- リード（1段落のみ。旧2段落目の概念句「機能を増やすより〜」は削除）:
  「経営の現場を自分で回してきた人間が、実装もする。だから現場の困りごとから法人化までを一気通貫で引き受けられる。」
- タイムライン3ノード:
  1. **NFC勤怠キットを納品** —「カードをタッチするだけ」で IT 未経験の現場に定着。実装力と現場感覚を示した入口。→ リンク `Works — NFC勤怠`（`/works/`）
  2. **オーナーが現場を離れたい** — 長年現場を支えたオーナーが高齢で経営側へ。築いた信頼を土台に、相談が勤怠の外へ広がる。
  3. **外部CTOとして法人化を伴走**（現在） — 経営経験と実装の両輪で、制度設計から日々の自動化までを一手に引き受ける。
- 戦線見出し: `いま動いている戦線`
- 3ストリームの body・status・metric・repo は現状維持。

## 実装コード（`src/components/Impact.astro` を以下で全置換）

```astro
---
import { getLucideIcon } from '../lib/lucide';

// 経歴の弧（時系列）。現在地ノードだけ current で強調する
type Milestone = { title: string; body: string; current?: boolean; link?: { label: string; href: string } };
const milestones: Milestone[] = [
  {
    title: 'NFC勤怠キットを納品',
    body: '「カードをタッチするだけ」で IT 未経験の現場に定着。実装力と現場感覚を示した入口。',
    link: { label: 'Works — NFC勤怠', href: '/works/' },
  },
  {
    title: 'オーナーが現場を離れたい',
    body: '長年現場を支えたオーナーが高齢で経営側へ。築いた信頼を土台に、相談が勤怠の外へ広がる。',
  },
  {
    title: '外部CTOとして法人化を伴走',
    body: '経営経験と実装の両輪で、制度設計から日々の自動化までを一手に引き受ける。',
    current: true,
  },
];

// いま動いている戦線（現在の仕事）。metric / repo は勤怠 DX のみ
type Stream = { title: string; status: string; live?: boolean; metric?: string; body: string; repo?: string };
const streams: Stream[] = [
  {
    title: '勤怠 DX', status: '稼働中', live: true,
    metric: '月 −5h ／ 差異 −3〜4万',
    body: 'NFC 打刻 → スプレッドシート自動同期 → 給与計算自動化。「カードをタッチするだけ」の UX で IT 未経験の現場に定着。',
    repo: 'https://github.com/yktsnet/nfc-attendance-kit',
  },
  {
    title: '書類作成の自動化', status: '進行中',
    body: 'Samba 共有 Excel の保存を行単位 diff で監視し、契約書テンプレへ自動転記。生成物は SQLite FTS5 で自然言語検索。',
  },
  {
    title: '空室情報の配信', status: '設計中',
    body: '事業者向け Web アプリ。松竹梅のロールで開示粒度を制御し、正午区切りの鮮度明示で電話対応とすみ分け。',
  },
];
---

<section id="impact" class="relative">
  <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">Impact</p>
  <p class="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
    マンション管理会社の外部CTOとして、<br class="hidden sm:block" />現場のDXを推進。
  </p>
  <p class="mt-5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
    経営の現場を自分で回してきた人間が、実装もする。だから現場の困りごとから法人化までを一気通貫で引き受けられる。
  </p>

  <!-- 経歴の弧: 縦タイムライン -->
  <div class="mt-8 relative">
    <div class="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-zinc-200 dark:bg-poi-border/60" aria-hidden="true"></div>
    {milestones.map((m) => (
      <div class="relative pl-7 pb-5 last:pb-0">
        <span
          class:list={[
            "absolute left-0 top-1 h-3 w-3 rounded-full border-2",
            m.current
              ? "border-poi-accent bg-poi-accent"
              : "border-zinc-300 bg-white dark:border-poi-border dark:bg-poi-back",
          ]}
          aria-hidden="true"
        ></span>
        <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span class:list={[
            "text-[15px] font-semibold",
            m.current ? "text-poi-accent" : "text-zinc-900 dark:text-poi-focus",
          ]}>{m.title}</span>
          {m.current && (
            <span class="inline-flex items-center gap-1.5 text-xs text-poi-accent">
              <span class="inline-block h-1.5 w-1.5 rounded-full bg-poi-accent"></span>現在
            </span>
          )}
        </div>
        <p class="mt-1 text-[13.5px] leading-relaxed text-zinc-600 dark:text-poi-muted">{m.body}</p>
        {m.link && (
          <a
            href={m.link.href}
            class="mt-1.5 inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-poi-muted transition-colors hover:text-poi-accent dark:hover:text-poi-accent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
              set:html={getLucideIcon('arrow-right')}
            />
            {m.link.label}
          </a>
        )}
      </div>
    ))}
  </div>

  <!-- いま動いている戦線 -->
  <p class="mt-9 font-mono text-[11px] tracking-widest uppercase text-poi-muted">いま動いている戦線</p>
  <div class="mt-3">
    {streams.map((s) => (
      <div class="border-t border-zinc-200/70 dark:border-poi-border/50 py-4 last:border-b last:border-zinc-200/70 dark:last:border-poi-border/50">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span class="text-[15px] font-semibold text-zinc-900 dark:text-poi-focus">{s.title}</span>
          {s.live ? (
            <span class="inline-flex items-center gap-1.5 text-xs text-poi-accent">
              <span class="inline-block h-1.5 w-1.5 rounded-full bg-poi-accent"></span>{s.status}
            </span>
          ) : (
            <span class="text-xs text-zinc-500 dark:text-poi-muted">{s.status}</span>
          )}
          {s.metric && (
            <span class="ml-auto font-mono text-xs text-zinc-600 dark:text-zinc-300">{s.metric}</span>
          )}
        </div>
        <p class="mt-1.5 text-[13.5px] leading-relaxed text-zinc-600 dark:text-poi-muted">{s.body}</p>
        {s.repo && (
          <a
            href={s.repo}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex items-center gap-1 font-mono text-xs text-zinc-500 dark:text-poi-muted transition-colors hover:text-poi-accent dark:hover:text-poi-accent"
          >
            GitHub
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </a>
        )}
      </div>
    ))}
  </div>
</section>
```
