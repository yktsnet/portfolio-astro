## APPROACH／IMPACT のコンテンツ刷新・About 余白・モバイル text ラベル
id: 25
branch-slug: approach-impact-content-refine
github_issue: 38
status: open
type: feat
対象: |
  src/components/Approach.astro（全面差し替え）
  src/components/Impact.astro（全面差し替え）
  src/components/About.astro（見出し下の余白を局所修正）
  src/components/HeroMobile.astro（外部リンクに text ラベルを付与）
内容: |
  承認済みデザインに寄せる。APPROACH は図を1つ（設計→実装→検証フロー）に絞り、
  3本柱を罫線区切りの定義リストへ圧縮して可読性を上げる。IMPACT は勤怠単独から
  3戦線（勤怠=稼働中／書類自動化=進行中／空室配信=設計中）へ広げて厚みを出す。
  あわせて About の見出し→本文の窮屈さを解消し、モバイル左ペインの外部リンクに
  テキストラベルを戻す。下記「完成コード」をそのまま反映すればよい。
  ※スライド化（横スライドUI）は別 Issue（26）で扱う。本 Issue は縦積みのまま中身だけ刷新する。
確認: |
  npm run typecheck が通ること
  npm run build が通ること
  lucide.ts への追加は不要（arrow-right / github / external-link / id-card /
  table / calculator / mail のみ使用、すべて既存）

---

## デザイン規律（全体共通）

- **声になる本文は1段落だけ明るく・やや大きく**：`text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300`。
- **詳細・補足は小さく muted**：`text-sm text-poi-muted`。
- **mono は見出しラベルと固有データ（コマンド名・数値）だけ**。本文に mono を使わない。
- **色は緑（poi-accent #5de4c7）の点のみ**。青・紫は使わない（Issue 24 で撤去済み）。
- カラーは tailwind.config.mjs の既存トークンと Tailwind 標準色のみ。新規カラー追加なし。
- box-shadow / filter / backdrop-filter は使わない。CSS のみ・Astro 静的レンダリング。

---

## 1. Approach.astro — 全文を以下で差し替え

図を「設計→実装→検証」フロー1本に絞り、3本柱（環境／ロール／機密）は定義リストへ。

```astro
---
import { getLucideIcon } from '../lib/lucide';

type Role = { title: string; sub: string; accent?: boolean };
const roles: Role[] = [
  { title: '設計', sub: '対話型 AI' },
  { title: '実装', sub: '自律型 AI' },
  { title: '検証', sub: '人間がマージ', accent: true },
];
type Pillar = { term: string; body: string };
const pillars: Pillar[] = [
  { term: '環境の同一化', body: 'ツールチェーンを Nix Flakes でコード化し、環境差を消す。同一性は CI（nix flake check）で継続検証。' },
  { term: 'ロールの分離', body: '担当を分け、破壊的コマンドや機密アクセスは settings.json の deny で構造的に遮断。' },
  { term: '機密の隔離', body: '本番の接続情報は公開リポに出さず secrets-agents/ に分離して参照させる。' },
];
---

<section id="approach" class="relative mb-28 pb-20 border-b border-zinc-200/50 dark:border-poi-border/60">
  <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">Approach</p>
  <p class="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
    AIエージェントを、開発プロセスに組み込む。
  </p>
  <p class="mt-5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
    AIを補助ツールではなく開発プロセスそのものに組み込んでいる。自律実行するエージェントを、人間の確認を経ないまま本番に届かせない——その一点を、環境・ロール・機密の三層で構造的に担保している。
  </p>

  <!-- signature visual: 設計 → 実装 → 検証 -->
  <div class="mt-8 flex items-center gap-2.5">
    {roles.map((r, i) => (
      <>
        <div class:list={[
          "flex-1 rounded-[10px] border p-3.5 text-center",
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
        {i < roles.length - 1 && (
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

  <!-- 3本柱: 定義リスト -->
  <dl class="mt-8">
    {pillars.map((p) => (
      <div class="flex gap-4 border-t border-zinc-200/70 dark:border-poi-border/50 py-4 first:border-t-0 first:pt-0">
        <dt class="w-24 shrink-0 font-mono text-xs text-poi-accent">{p.term}</dt>
        <dd class="text-[13.5px] leading-relaxed text-zinc-600 dark:text-poi-muted">{p.body}</dd>
      </div>
    ))}
  </dl>

  <!-- OSS リンク + 両対応 -->
  <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
    <a
      href="https://github.com/yktsnet/dotfiles-public"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-full border border-poi-accent/40 px-4 py-1.5 font-mono text-xs text-poi-accent transition-colors hover:border-poi-accent hover:bg-poi-accent/5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true"
        set:html={getLucideIcon('github')}
      />
      dotfiles-public
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10" height="10" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true"
        set:html={getLucideIcon('external-link')}
      />
    </a>
    <span class="font-mono text-xs text-zinc-500 dark:text-poi-muted">Claude Code / Jules 両対応</span>
  </div>

  <!-- チーム適性 -->
  <p class="mt-5 border-l-2 border-zinc-300 dark:border-poi-border pl-3 text-xs leading-7 text-zinc-500 dark:text-poi-muted">
    SES 先のチームにも持ち込み、GitHub 統合・CI/CD・運用ルールの整備を推進中。
  </p>
</section>
```

### 差分メモ（レビュー用）
- ロールの3カード Bento（icon 付き）を、icon なしの軽量フロー（設計→実装→検証）に置換。検証カードのみ緑アクセント。message-circle / bot / user-check は不使用に。
- 旧「柱②フロー（Nix Flakes→CI→Claude/Jules）」の図を撤去し、3本柱は `dl` 定義リストへ集約。図は1つだけに。
- 導入文を「三層で構造的に担保」の1段落に再構成。`text-[15px] text-zinc-700 dark:text-zinc-300`。
- 見出し→本文を `mt-5` に（窮屈さ解消）。

---

## 2. Impact.astro — 全文を以下で差し替え

勤怠単独から3戦線へ。数値は勤怠行のインライン証拠に。

```astro
---
type Stream = { title: string; status: string; live?: boolean; metric?: string; body: string };
const streams: Stream[] = [
  {
    title: '勤怠 DX', status: '稼働中', live: true,
    metric: '月 −5h ／ 差異 −3〜4万',
    body: 'NFC 打刻 → スプレッドシート自動同期 → 給与計算自動化。「カードをタッチするだけ」の UX で IT 未経験の現場に定着。',
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

<section id="impact" class="relative mb-28 pb-20 border-b border-zinc-200/50 dark:border-poi-border/60">
  <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">Impact</p>
  <p class="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
    マンション管理会社の外部CTOとして、<br class="hidden sm:block" />現場のDXを推進。
  </p>
  <p class="mt-5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
    学習塾や法人の経営を通じて、技術が導入される側の現場を担ってきた。現場を長年支えたオーナーが経営側へ移りたいという課題に、勤怠改善を起点に信頼を築き、法人化までを伴走している。
  </p>
  <p class="mt-3 text-sm leading-7 text-zinc-600 dark:text-poi-muted">
    機能を増やすより、使われ続ける仕組みをつくる。既存の Excel 運用を変えず、自動化を後付けする設計方針。
  </p>

  <!-- 3戦線 -->
  <div class="mt-8">
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
      </div>
    ))}
  </div>
</section>
```

### 差分メモ（レビュー用）
- 数値メトリクスカード2枚＋勤怠フロー図（id-card/table/calculator）を撤去し、3戦線リストへ。数値は勤怠行の右側にインライン（mono）。
- 緑ドット＝稼働中。進行中・設計中はグレーのステータス語のみ（色は点だけ）。
- 導入をナラティブ2段落に。`text-[15px] text-zinc-700 dark:text-zinc-300` ＋ muted 補足。
- 守秘: 社名は出さない。Samba / openpyxl / FTS5 等は技術一般名なので記載可（固有接続情報ではない）。

---

## 3. About.astro — 見出し下の余白を広げる

本文の塊は維持。見出し→本文が窮屈なので、テキスト塊の構造だけ次のように変える。

現状:
```astro
  <div class="space-y-4 text-zinc-600 dark:text-poi-muted">
    <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">About</p>
    <p class="!mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
      曖昧なビジネス課題を、<br class="hidden sm:block" />設計・実装・本番運用まで一人で形にする。
    </p>
    <p class="text-sm leading-7">
      学習塾を12年経営し、合同会社でイベントスペース運営やプログラミング教育支援も手がけた。…
    </p>
    <p class="text-sm leading-7">
      2025年にエンジニアへ転身。…
    </p>
  </div>
```

変更後（`space-y-4` をやめ、見出しと本文塊を分け、本文塊は `mt-6` ＋ `space-y-4`）:
```astro
  <div class="text-zinc-600 dark:text-poi-muted">
    <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">About</p>
    <p class="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
      曖昧なビジネス課題を、<br class="hidden sm:block" />設計・実装・本番運用まで一人で形にする。
    </p>
    <div class="mt-6 space-y-4">
      <p class="text-sm leading-7">
        学習塾を12年経営し、合同会社でイベントスペース運営やプログラミング教育支援も手がけた。技術が導入される側の景色——コスト感覚、現場の抵抗、使われなくなるまでの経緯——を経営者として知っている。
      </p>
      <p class="text-sm leading-7">
        2025年にエンジニアへ転身。いまは SES で開発に携わりながら、個人開発と小さな組織への技術支援を並行している。ハードウェアから業務システム、自動売買まで、設計から運用まで一人で通すことが多い。
      </p>
    </div>
  </div>
```

タイムライン（`mt-12` のブロック）以下は変更しない。

---

## 4. HeroMobile.astro — 外部リンクに text ラベルを戻す

モバイル（HeroMobile は `sm:hidden` ラッパー内でのみ描画）の GitHub / Zenn / Contact を、アイコンのみ → アイコン＋テキストに戻す。横並びを縦並びの控えめなリンク列にする。

現状の `<div class="mt-4 flex items-center justify-center gap-4 …">` 配下の3リンク（アイコンのみ）を、各リンクにラベルを追加した形へ:

```astro
    <div class="mt-5 flex items-center justify-center gap-5 text-sm text-zinc-500 dark:text-poi-muted">
      <a
        href="https://github.com/yktsnet"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 hover:text-poi-accent dark:hover:text-poi-accent transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" set:html={`<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />`} />
        GitHub
      </a>
      {zennIcon && (
        <a
          href="https://zenn.dev/yktsnet"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 hover:text-poi-accent dark:hover:text-poi-accent transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={zennIcon.path} />
          </svg>
          Zenn
        </a>
      )}
      <a
        href="/contact/"
        class="inline-flex items-center gap-1.5 hover:text-poi-accent dark:hover:text-poi-accent transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" set:html={getLucideIcon("mail")} />
        Contact
      </a>
    </div>
```

`aria-label` はテキストが入るので不要（重複読み上げ回避のため外す）。デスクトップ（HeroDesktop）はアイコンのみのまま変更しない。

---

## 守秘

- マンション管理会社・SES 先の社名は出さない（上記コピーは遵守済み）。
- 固有接続情報は `~/dotfiles/secrets-agents/` の辞書に従いマスク。
