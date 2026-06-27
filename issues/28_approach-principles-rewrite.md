## APPROACH を「3つの判断基準（How）」へ再構成
id: 28
branch-slug: approach-principles-rewrite
github_issue:
status: open
type: feat
対象: |
  src/components/Approach.astro（全面差し替え）
内容: |
  APPROACH の役割を「dotfiles という特定実装の内部構造の説明」から、
  「私がどう考え、何を基準に実装するか＝移植可能な判断基準（How）」へ再定義する。
  読み手は開発者・採用者で、目的は実装スタイル・開発哲学を最短で理解させること。
  証拠・数値は Impact / Works（What）の責務なので Approach では深掘りせず、
  各基準から該当する現物へリンクで送る（語らず、見せる場所へ送る）。

  再構成の核:
  - 判断基準を3つに絞る。各基準は「Xより、Yを選ぶ」というトレードオフ1文で書く
    （哲学の宣言ではなく、分岐でどちらを選ぶ人かが分かる形）。
  - 各基準に証跡リンクを1本だけ付け、Impact / dotfiles-public / Works へ送る。
  - dotfiles の内部構造（Nix Flakes / settings.json deny / secrets-agents）の
    3本柱定義リストは撤去する。これは基準②の実装詳細にすぎず、Approach に置くと
    基準②だけ肥大化して3基準のバランスが崩れる。詳細は dotfiles-public リポ側に委ねる。
  - 「設計→実装→検証」フロー図は残すが、基準②（AIをプロセスに組み込む）の
    インライン図として位置づけ直す（独立した主役にしない）。

  下記「完成コード」をそのまま反映すればよい。
確認: |
  npm run typecheck が通ること
  npm run build が通ること
  lucide.ts への追加は不要（arrow-right / github / external-link のみ使用、すべて既存）

---

## 背景（責務の整理）

サイトの情報設計は About=Who / Approach=How / Impact・Works=What。
現状の Approach は dotfiles という特定実装の内部構造（What 寄り）を主役に据えてしまっており、
肝心の「何を基準に意思決定するか」という How が言語化されていない。

判断基準は resume の自己PR3本がそのまま骨格になる:
1. 使われ続ける仕組みを選ぶ（機能より定着）
2. AIをプロセスに組み込む（補助でなく構造的遮断）
3. 確実性を選ぶ（機能の多さより壊れない構成）

dotfiles は基準②を体現した証跡の1つにすぎない。これを Approach の主役から、
基準②の証跡リンク（dotfiles-public）へ降格させるのが本 Issue の主眼。

---

## デザイン規律（既存ルール踏襲・Issue 24/25 と同一）

- 声になる本文1段落だけ明るく・やや大きく: `text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300`。
- 詳細・補足は小さく muted: `text-sm` / `text-[13.5px] text-poi-muted`。
- mono は見出しラベルと固有データ（コマンド名・リンクラベル）だけ。本文に mono を使わない。
- 色は緑（poi-accent #5de4c7）のアクセントのみ。青・紫は使わない。
- box-shadow / filter / backdrop-filter は使わない。CSS のみ・Astro 静的レンダリング。
- 新規カラートークン追加なし（tailwind.config.mjs の既存トークン＋Tailwind 標準色のみ）。

### トレードオフ1文の表現ルール（重要）
各基準の核は「Xより、Yを選ぶ」。視覚的に「捨てる側 X」と「選ぶ側 Y」を区別する:
- 捨てる側 X: muted（`text-zinc-500 dark:text-poi-muted`）
- 選ぶ側 Y: focus（`text-zinc-800 dark:text-poi-focus`）で前面に出す
- 取り消し線（line-through）は使わない。色のコントラストだけで差をつける。

### 証跡リンク
各基準末尾に mono の小リンク1本。語らずに現物へ送る。
- 基準①（定着）→ `/impact/`（現場DX が証跡）
- 基準②（AI組み込み）→ `https://github.com/yktsnet/dotfiles-public`（external）
- 基準③（確実性）→ `/works/`（Trading Lab の React版→JSONL+systemd 再設計が証跡）

---

## Approach.astro — 全文を以下で差し替え

```astro
---
import { getLucideIcon } from '../lib/lucide';

// 基準②の証跡として残す「設計→実装→検証」フロー
type Role = { title: string; sub: string; accent?: boolean };
const roles: Role[] = [
  { title: '設計', sub: '対話型 AI' },
  { title: '実装', sub: '自律型 AI' },
  { title: '検証', sub: '人間がマージ', accent: true },
];

// 3つの判断基準（How）。tradeoff の reject/choose で「Xより、Yを選ぶ」を表現。
type Principle = {
  term: string;
  reject: string;   // 捨てる側 X（muted）
  choose: string;   // 選ぶ側 Y（focus）
  body?: string;    // 補足1文（任意）
  proof: { label: string; href: string; external?: boolean };
};
const principles: Principle[] = [
  {
    term: '使われ続ける仕組みを選ぶ',
    reject: '機能を増やすより、',
    choose: '現場の運用を変えず、後付けで自動化を定着させる。',
    body: '技術が導入される側を経営者として12年見てきた。使われなくなる経緯を知っているから、現場の手順を壊さないことを最優先に置く。',
    proof: { label: 'Impact — 現場のDX', href: '/impact/' },
  },
  {
    term: 'AIを開発プロセスに組み込む',
    reject: 'AIを補助ツールとして使うより、',
    choose: '設計・実装・検証を分け、危険な操作を構造で遮断する。',
    body: '自律実行するエージェントを、人間の確認を経ないまま本番に届かせない。環境差・破壊的操作・機密漏洩を、運用ルールではなく設定で止める。',
    proof: { label: 'dotfiles-public', href: 'https://github.com/yktsnet/dotfiles-public', external: true },
  },
  {
    term: '確実性を選ぶ',
    reject: '機能の多さより、',
    choose: '壊れず回り続ける宣言的構成を選ぶ。',
    body: '金銭リスクのある自動売買を個人で本番運用する必要から、Web UI を備えた版を、状態を JSONL と systemd で扱う構成へ意図的に作り直した。',
    proof: { label: 'Works — Trading Lab', href: '/works/' },
  },
];
---

<section id="approach" class="relative">
  <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">Approach</p>
  <p class="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
    実装の前に、何を選び何を捨てるかを決めている。
  </p>
  <p class="mt-5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
    設計が分岐するたびに立ち戻る判断基準が3つある。どれも「機能を足す」側ではなく「壊さず使われ続ける」側を選ぶための基準で、個々の実装はその結果にすぎない。
  </p>

  <!-- 3つの判断基準 -->
  <div class="mt-9 space-y-9">
    {principles.map((p, i) => (
      <div class="border-t border-zinc-200/70 dark:border-poi-border/50 pt-6 first:border-t-0 first:pt-0">
        <div class="flex items-baseline gap-2.5">
          <span class="font-mono text-xs text-poi-accent">0{i + 1}</span>
          <h3 class="text-[15px] font-semibold text-zinc-900 dark:text-poi-focus">{p.term}</h3>
        </div>

        <!-- トレードオフ1文: 捨てる側=muted / 選ぶ側=focus -->
        <p class="mt-2.5 text-[15px] leading-relaxed">
          <span class="text-zinc-500 dark:text-poi-muted">{p.reject}</span>
          <span class="text-zinc-800 dark:text-poi-focus">{p.choose}</span>
        </p>

        {p.body && (
          <p class="mt-2 text-[13.5px] leading-relaxed text-zinc-600 dark:text-poi-muted">{p.body}</p>
        )}

        <!-- 基準②だけ、証跡として設計→実装→検証フローをインライン表示 -->
        {i === 1 && (
          <div class="mt-4 flex items-center gap-2.5">
            {roles.map((r, j) => (
              <>
                <div class:list={[
                  "flex-1 rounded-[10px] border p-3 text-center",
                  r.accent
                    ? "border-poi-accent/30 bg-poi-accent/[0.04]"
                    : "border-zinc-200 dark:border-poi-border",
                ]}>
                  <p class:list={[
                    "text-sm font-semibold",
                    r.accent ? "text-poi-accent" : "text-zinc-900 dark:text-poi-focus",
                  ]}>{r.title}</p>
                  <p class="mt-0.5 text-xs text-zinc-500 dark:text-poi-muted">{r.sub}</p>
                </div>
                {j < roles.length - 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"
                    class="shrink-0 text-poi-accent"
                    aria-hidden="true"
                    set:html={getLucideIcon('arrow-right')}
                  />
                )}
              </>
            ))}
          </div>
        )}

        <!-- 証跡リンク: 語らず現物へ送る -->
        <a
          href={p.proof.href}
          {...(p.proof.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          class="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-poi-muted transition-colors hover:text-poi-accent dark:hover:text-poi-accent"
        >
          {p.proof.external ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
              set:html={getLucideIcon('github')}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
              set:html={getLucideIcon('arrow-right')}
            />
          )}
          {p.proof.label}
          {p.proof.external && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10" height="10" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
              set:html={getLucideIcon('external-link')}
            />
          )}
        </a>
      </div>
    ))}
  </div>

  <!-- チーム適性（基準を個人の趣味で終わらせない一文。維持） -->
  <p class="mt-9 border-l-2 border-zinc-300 dark:border-poi-border pl-3 text-xs leading-7 text-zinc-500 dark:text-poi-muted">
    これらの基準と AI 協調開発の仕組みは SES 先のチームにも持ち込み、GitHub 統合・CI/CD・運用ルールの整備として展開中。
  </p>
</section>
```

---

## 差分メモ（レビュー用）

- **撤去**: 旧3本柱定義リスト（環境の同一化／ロールの分離／機密の隔離）。dotfiles の内部構造説明であり What 寄り。詳細は dotfiles-public リポに委ね、Approach からはリンク1本で送る。
- **撤去**: 旧 hero 見出し「AIエージェントを、開発プロセスに組み込む。」＋導入文。これは3基準のうち②だけを全体タイトルに昇格させていた。umbrella を「実装の前に、何を選び何を捨てるかを決めている。」へ変更し、3基準を対等に並べる。
- **追加**: 3基準（01/02/03）。各々トレードオフ1文（捨てる側 muted ／ 選ぶ側 focus）＋補足1文＋証跡リンク1本。
- **移設**: 「設計→実装→検証」フロー図は基準②のインライン証跡へ降格（独立セクションではなくなる）。
- **維持**: 末尾のチーム適性一文（個人の趣味で終わらせない補強）。文言だけ基準群を受ける形に微調整。
- **リンク先**: ①→/impact/、②→dotfiles-public（external）、③→/works/。いずれも実在。Works は個別アンカー未整備のため一覧 `/works/` へ送る（個別アンカーが必要なら別 Issue）。

## 守秘

- マンション管理会社・SES 先の社名は出さない（上記コピーは社名を含まない）。
- 固有接続情報は記載しない。Nix Flakes / systemd / JSONL / SQLite 等は技術一般名で記載可。
</content>
</invoke>
