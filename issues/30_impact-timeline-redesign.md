## Impact セクションを「上部テキスト＋縦タイムライン（派生付き）」に再設計
id: 30
branch-slug: impact-timeline-redesign
github_issue: 50
status: open
type: feat
対象: |
  src/components/Impact.astro（全面書き換え。下記「実装コード」で丸ごと置換）
内容: |
  Impact が断片的で読みにくく（タイムライン3＋戦線3の6項目が薄く並ぶ）、
  "Impact" なのに数字が小さく主役になっていない。

  セクション内を上下2部に分ける:
  - 上部＝テキスト（見出し＋厚めの説明文）。経歴の弧を地続きで読ませる。
  - 下部＝1本の縦タイムライン。各ノードから「やったこと/やっていること」が
    派生（branch）してぶら下がる。2つのリストを1本に統合する。

  きっかけノードに NFC 勤怠キットを置き、そこへ「勤怠 DX（稼働中）」を派生させ、
  数字（−5h / −3〜4万）を大きな mono で見せて NFC のインパクトを伝える。
  現在ノード（外部CTOとして法人化を伴走）に「書類自動化（進行中）」「空室配信（設計中）」を派生させる。

  デザインは確定済み。Claude Code 側で再設計は不要。下記コードをそのまま反映する。
確認: |
  npm run typecheck が通ること。
  既存の文言（各 work の body・status・repo リンク・勤怠の metric 値）が保持されていること。
  arrow-right / external-link アイコンは src/lib/lucide.ts に存在（確認済み・追加不要）。

---

## 設計の意図（変更時に壊してはいけない不変条件）

- **セクション2部構成**: 上＝テキスト（見出し＋説明文）、下＝縦タイムライン。順序を入れ替えない。
- **タイムラインは1本**。各フェーズ（ノード）から実績が **branch（左罫線でぶら下げ）** する。戦線を独立した別リストに戻さない。
- **数字は branch 内で大きく**（mono 26px 相当）。Impact の主役は数字。`text-xs` の小さい掲示に戻さない。
- **時系列の意味**: きっかけ → 転機 → 現在。Approach の横フロー（手順）とは別物なので横並びカードにしない。
- **現在ノードだけ** accent 色＋塗りつぶしの丸。
- **重複させない**: 勤怠の数字・repo は「きっかけ」ノードの勤怠 DX branch にのみ置く。

## 確定コピー

- 見出し（現状維持）: 「マンション管理会社の外部CTOとして、現場のDXを推進。」
- 説明文（厚め・1段落）:
  「きっかけは勤怠の困りごとを片付ける小さな道具を1つ納品したこと。そこで生まれた信頼が相談の幅を広げ、いまは制度設計から日々の自動化、法人化までを一手に引き受けている。経営も実装も自分でやってきた立場だからこそ、現場の手触りのまま回る形に落とせる。」
- タイムライン:
  1. **きっかけ — NFC勤怠キットを納品** /「カードをタッチするだけ」で IT 未経験の現場に定着した、最初の1台。
     - branch: **勤怠 DX**（稼働中・GitHub）— NFC打刻→スプレッドシート自動同期→給与計算自動化。
       数字: `−5 h`（月次の勤怠工数）/ `−3〜4 万`（給与計算の月次差異）
  2. **転機 — オーナーが現場を離れたい** / 長年現場を支えたオーナーが高齢で経営側へ。築いた信頼を土台に、相談が勤怠の外へ広がる。
  3. **現在 — 外部CTOとして法人化を伴走** / 経営経験と実装の両輪で、制度設計から日々の自動化までを引き受ける。広げている戦線:
     - branch: **書類作成の自動化**（進行中）— Samba 共有 Excel を行単位 diff で監視し契約書テンプレへ自動転記。生成物は SQLite FTS5 で自然言語検索。
     - branch: **空室情報の配信**（設計中）— 事業者向け Web アプリ。松竹梅のロールで開示粒度を制御し、正午区切りで電話対応とすみ分け。

## 実装コード（`src/components/Impact.astro` を以下で全置換）

```astro
---
// Impact: 上部テキスト ＋ 下部の縦タイムライン。各フェーズから実績が branch する。
type Metric = { value: string; unit: string; label: string };
type Work = { title: string; status: string; live?: boolean; body: string; repo?: string; metrics?: Metric[] };
type Phase = { kicker: string; title: string; body: string; current?: boolean; works?: Work[] };

const phases: Phase[] = [
  {
    kicker: 'きっかけ', title: 'NFC勤怠キットを納品',
    body: '「カードをタッチするだけ」で IT 未経験の現場に定着した、最初の1台。',
    works: [
      {
        title: '勤怠 DX', status: '稼働中', live: true,
        body: 'NFC 打刻 → スプレッドシート自動同期 → 給与計算自動化。',
        repo: 'https://github.com/yktsnet/nfc-attendance-kit',
        metrics: [
          { value: '−5', unit: 'h', label: '月次の勤怠工数' },
          { value: '−3〜4', unit: '万', label: '給与計算の月次差異' },
        ],
      },
    ],
  },
  {
    kicker: '転機', title: 'オーナーが現場を離れたい',
    body: '長年現場を支えたオーナーが高齢で経営側へ。築いた信頼を土台に、相談が勤怠の外へ広がる。',
  },
  {
    kicker: '現在', title: '外部CTOとして法人化を伴走', current: true,
    body: '経営経験と実装の両輪で、制度設計から日々の自動化までを引き受ける。広げている戦線:',
    works: [
      {
        title: '書類作成の自動化', status: '進行中',
        body: 'Samba 共有 Excel を行単位 diff で監視し契約書テンプレへ自動転記。生成物は SQLite FTS5 で自然言語検索。',
      },
      {
        title: '空室情報の配信', status: '設計中',
        body: '事業者向け Web アプリ。松竹梅のロールで開示粒度を制御し、正午区切りで電話対応とすみ分け。',
      },
    ],
  },
];
---

<section id="impact" class="relative">
  <!-- 上部: テキスト -->
  <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">Impact</p>
  <p class="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
    マンション管理会社の外部CTOとして、<br class="hidden sm:block" />現場のDXを推進。
  </p>
  <p class="mt-5 text-[15px] leading-loose text-zinc-700 dark:text-zinc-300">
    きっかけは勤怠の困りごとを片付ける小さな道具を1つ納品したこと。そこで生まれた信頼が相談の幅を広げ、いまは制度設計から日々の自動化、法人化までを一手に引き受けている。経営も実装も自分でやってきた立場だからこそ、現場の手触りのまま回る形に落とせる。
  </p>

  <!-- 下部: 縦タイムライン -->
  <div class="mt-9 relative">
    <div class="absolute left-[5px] top-1.5 bottom-2 w-px bg-zinc-200 dark:bg-poi-border/70" aria-hidden="true"></div>
    {phases.map((p) => (
      <div class="relative pl-7 pb-6 last:pb-0">
        <span
          class:list={[
            "absolute left-0 top-1 h-3 w-3 rounded-full border-2",
            p.current
              ? "border-poi-accent bg-poi-accent"
              : "border-zinc-300 bg-white dark:border-poi-border dark:bg-poi-back",
          ]}
          aria-hidden="true"
        ></span>

        <p class:list={[
          "text-[15px] font-semibold",
          p.current ? "text-poi-accent" : "text-zinc-900 dark:text-poi-focus",
        ]}>
          <span class="font-mono text-xs tracking-wide text-poi-muted mr-1.5">{p.kicker}</span>— {p.title}
        </p>
        <p class="mt-1.5 text-[13px] leading-relaxed text-zinc-600 dark:text-poi-muted">{p.body}</p>

        {p.works && p.works.map((w) => (
          <div class:list={[
            "mt-3 border-l-2 pl-3.5",
            w.live ? "border-poi-accent" : "border-zinc-200 dark:border-poi-border",
          ]}>
            <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span class="text-[13.5px] font-semibold text-zinc-900 dark:text-poi-focus">{w.title}</span>
              {w.live ? (
                <span class="inline-flex items-center gap-1.5 text-xs text-poi-accent">
                  <span class="inline-block h-1.5 w-1.5 rounded-full bg-poi-accent"></span>{w.status}
                </span>
              ) : (
                <span class="text-xs text-zinc-500 dark:text-poi-muted">{w.status}</span>
              )}
              {w.repo && (
                <a
                  href={w.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ml-auto inline-flex items-center gap-1 font-mono text-xs text-zinc-500 dark:text-poi-muted transition-colors hover:text-poi-accent dark:hover:text-poi-accent"
                >
                  GitHub
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </a>
              )}
            </div>
            <p class="mt-1 text-[12.5px] leading-relaxed text-zinc-600 dark:text-poi-muted">{w.body}</p>
            {w.metrics && (
              <div class="mt-2.5 flex flex-wrap gap-x-8 gap-y-3">
                {w.metrics.map((mt) => (
                  <div>
                    <div class="font-mono text-[26px] font-medium leading-none text-zinc-900 dark:text-poi-focus">
                      {mt.value}<span class="text-[15px] text-zinc-500 dark:text-poi-muted">{mt.unit}</span>
                    </div>
                    <div class="mt-1.5 text-[11px] text-zinc-500 dark:text-poi-muted">{mt.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
</section>
```
