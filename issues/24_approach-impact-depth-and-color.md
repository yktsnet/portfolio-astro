## APPROACH 拡充・IMPACT ナラティブ化・配色規律と本文 typography
id: 24
branch-slug: approach-impact-depth-and-color
github_issue: 36
status: open
type: feat
対象: |
  src/components/Approach.astro（全面差し替え）
  src/components/Impact.astro（全面差し替え）
  src/components/About.astro（typography のみ局所修正）
内容: |
  APPROACH を dotfiles-public README の3本柱の忠実な投影にし、IMPACT を
  ナラティブ先行へ転換する。あわせて配色を About 基準（無彩色＋グリーン差し色）
  に揃え、本文の行間を締める。下記の「完成コード」をそのまま反映すればよい。
  仕様の根拠は resume.md / dotfiles-public README にあるが、実装に必要な
  確定済みコピー・クラス・カラーは本 Issue 内に全て記載済み。判断を再導出する必要はない。
確認: |
  npm run typecheck が通ること
  npm run build が通ること
  lucide.ts への追加は不要（message-circle / bot / user-check / arrow-right /
  github / external-link / id-card / table / calculator のみ使用、すべて既存）

---

## カラー早見表（poi トークン、tailwind.config.mjs 定義済み）

| トークン | 値 | 用途 |
|---|---|---|
| `poi-accent` | `#5de4c7` | 唯一のキーカラー（緑）。アイコン・OSSリンク等の「点」だけに使う |
| `poi-muted` | `#a6accd` | ラベル・本文・サブテキスト（白っぽいグレー） |
| `poi-focus` | `#e4f0fb` | 見出し・数値の強調（白） |
| `poi-border` | `#303446` | カード枠・区切りの無彩色 |
| `poi-blue` | `#89ddff` | **使用禁止**（IMPACT から撤去する） |
| `#c792ea`（紫） | — | **使用禁止**（チーム適性 border から撤去する） |

配色規律: 「無彩色（zinc / poi-muted / poi-focus / poi-border）＋グリーン差し色」。
About と同じ密度感にする。緑・青・紫の併用をやめ、緑だけを点で使う。

---

## 1. Approach.astro — 全文を以下で差し替え

3本柱（① ロールの分離 / ② 環境の同一化 / ③ 機密の分離）を mono キャプション＋「なぜ」の地の文付きで提示する。カード枠は無彩色、アイコンのみ緑。

```astro
---
import { getLucideIcon } from '../lib/lucide';

type Role = { icon: string; title: string; sub: string };
const roles: Role[] = [
  { icon: 'message-circle', title: '設計', sub: '対話型 AI が仕様策定' },
  { icon: 'bot', title: '実装', sub: '自律型 AI がコード編集' },
  { icon: 'user-check', title: '検証', sub: '人間が確認・マージ' },
];
const flow: string[] = [
  'Nix Flakes で環境統一',
  'CI（nix flake check）で継続検証',
  'Claude Code / Jules 対応',
];
---

<section id="approach" class="relative mb-28 pb-20 border-b border-zinc-200/50 dark:border-poi-border/60">
  <div class="space-y-4 text-zinc-600 dark:text-poi-muted">
    <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">Approach</p>
    <p class="!mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
      AIエージェントを、開発プロセスに組み込む基盤。
    </p>
    <p class="text-sm leading-7">
      AIを補助ツールではなく開発プロセスそのものに組み込んでいる。環境差はエージェントの自律実行を妨げるため Nix Flakes でツールチェーンを同一化し、破壊的操作や機密漏洩は人間の確認を経ず通りかねないため、ロールの分離と機密の隔離で構造的に抑える。
    </p>
  </div>

  <!-- 柱① ロールの分離 -->
  <div class="mt-10">
    <p class="font-mono text-xs text-poi-muted mb-2">01 / ロールの分離</p>
    <p class="text-sm leading-7 text-zinc-600 dark:text-poi-muted mb-4">
      自律実行を本番・メインブランチへ直接及ばせないよう、設計・実装・検証の担当を分ける。
    </p>
    <div class="grid grid-cols-3 gap-3">
      {roles.map((r) => (
        <div class="rounded-xl border border-zinc-200 dark:border-poi-border/60 bg-zinc-50 dark:bg-white/[0.03] p-4 transition-colors hover:border-zinc-300 dark:hover:border-poi-border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"
            class="text-poi-accent mb-2"
            aria-hidden="true"
            set:html={getLucideIcon(r.icon)}
          />
          <p class="text-sm font-semibold text-zinc-900 dark:text-poi-focus">{r.title}</p>
          <p class="mt-1 text-xs text-zinc-500 dark:text-poi-muted leading-relaxed">{r.sub}</p>
        </div>
      ))}
    </div>
  </div>

  <!-- 柱② 環境の同一化 -->
  <div class="mt-10">
    <p class="font-mono text-xs text-poi-muted mb-2">02 / 環境の同一化</p>
    <p class="text-sm leading-7 text-zinc-600 dark:text-poi-muted mb-4">
      環境差による「コマンド未検出」「実行時エラー」を防ぐため、ツールチェーンを Nix Flakes でコード化し、同一性を CI で継続検証する。
    </p>
    <div class="flex items-center gap-2">
      {flow.map((step, i) => (
        <>
          <div class="flex-1 rounded-lg border border-zinc-100 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] p-3 text-center">
            <p class="text-xs text-zinc-500 dark:text-poi-muted leading-relaxed">{step}</p>
          </div>
          {i < flow.length - 1 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"
              class="shrink-0 text-zinc-400 dark:text-zinc-600"
              aria-hidden="true"
              set:html={getLucideIcon('arrow-right')}
            />
          )}
        </>
      ))}
    </div>
  </div>

  <!-- 柱③ 機密の分離 -->
  <div class="mt-10">
    <p class="font-mono text-xs text-poi-muted mb-2">03 / 機密の分離</p>
    <p class="text-sm leading-7 text-zinc-600 dark:text-poi-muted">
      本番の IP・ポート・実ホスト名などは公開リポや Issue に直書きせず、ローカルの <code class="font-mono text-xs text-zinc-600 dark:text-poi-focus">secrets-agents/</code> に隔離してエージェントに参照させる。
    </p>
  </div>

  <!-- OSS リンク（緑は CTA の点として残す） -->
  <div class="mt-8">
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
  </div>

  <!-- チーム適性（紫を撤去し無彩色 border に） -->
  <p class="mt-6 border-l-2 border-zinc-300 dark:border-poi-border pl-3 text-xs leading-7 text-zinc-500 dark:text-poi-muted">
    SES 先のチームにもこの基盤を持ち込み、GitHub 統合・CI/CD 構築・AIエージェント運用ルールの整備を推進中。
  </p>
</section>
```

### 旧コードからの差分メモ（レビュー用）
- ラベル `text-poi-accent` → `text-poi-muted`。
- 導入文を1文→因果2段の文へ差し替え。
- ロール3カードを `roles` 配列化。カード枠 `dark:border-poi-accent/20`→`dark:border-poi-border/60`、hover `dark:hover:border-poi-accent/40`→`dark:hover:border-poi-border`。アイコンは `text-poi-accent` のまま（点として残す）。
- 各柱に mono キャプション `01 / … 02 / … 03 / …`（`text-poi-muted`）と「なぜ」の地の文を追加。
- 柱③（機密の分離）を新規追加。アイコンなし＝lucide 追加不要。
- フローを `flow` 配列化し、CI 文言を `CI で同一性を継続検証`→`CI（nix flake check）で継続検証` に。
- チーム適性 border `border-[#c792ea]/50` → `border-zinc-300 dark:border-poi-border`。
- 本文 `leading-8`→`leading-7`、ラッパー `space-y-5`→`space-y-4`。

---

## 2. Impact.astro — 全文を以下で差し替え

ナラティブを地の文で先に通し、数値カード・フロー図はその論拠として後段に置く。poi-blue は全廃し、数値は白（poi-focus）、アイコンは緑（poi-accent）。

```astro
---
import { getLucideIcon } from '../lib/lucide';

type Metric = { value: string; label: string };
const metrics: Metric[] = [
  { value: '~5h', label: '月あたりの集計工数削減' },
  { value: '3〜4万', label: '月あたりの申告差異抑制' },
];
type Step = { icon: string; label: string };
const steps: Step[] = [
  { icon: 'id-card', label: 'NFC 打刻' },
  { icon: 'table', label: 'スプレッドシート同期' },
  { icon: 'calculator', label: '給与計算自動化' },
];
---

<section id="impact" class="relative mb-28 pb-20 border-b border-zinc-200/50 dark:border-poi-border/60">
  <div class="space-y-4 text-zinc-600 dark:text-poi-muted">
    <p class="font-mono text-xs tracking-widest uppercase text-poi-muted">Impact</p>
    <p class="!mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
      マンション管理会社の外部CTOとして、現場のDXを推進。
    </p>
    <p class="text-sm leading-7">
      学習塾や法人の経営を通じて、技術が導入される側の現場を担ってきた。マンション管理の現場を長年支えてきたオーナーが、現場を離れ経営側へ移行したいという課題に対し、勤怠改善を起点に信頼関係を築き、法人化に向けた全面的な DX 支援を担当している。
    </p>
    <p class="text-sm leading-7">
      機能を増やすのではなく、使われ続ける仕組みをつくることを重視する。既存の Excel・スプレッドシート運用を無理に変えず、自動化を後付けする設計方針で、IT 未経験の現場に「カードをタッチするだけ」の UX を定着させた。
    </p>
  </div>

  <!-- 論拠: 数値メトリクス -->
  <div class="mt-8 grid grid-cols-2 gap-3">
    {metrics.map((m) => (
      <div class="rounded-xl border border-zinc-200 dark:border-poi-border/60 bg-zinc-50 dark:bg-white/[0.03] p-5 transition-colors hover:border-zinc-300 dark:hover:border-poi-border">
        <p class="font-mono text-2xl font-semibold text-zinc-900 dark:text-poi-focus tabular-nums">{m.value}</p>
        <p class="mt-1 text-xs text-zinc-500 dark:text-poi-muted leading-relaxed">{m.label}</p>
      </div>
    ))}
  </div>

  <!-- 論拠: 勤怠DX フロー -->
  <div class="mt-6 flex items-center gap-2">
    {steps.map((s, i) => (
      <>
        <div class="flex-1 rounded-xl border border-zinc-200 dark:border-poi-border/60 bg-zinc-50 dark:bg-white/[0.03] p-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"
            class="mx-auto text-poi-accent mb-2"
            aria-hidden="true"
            set:html={getLucideIcon(s.icon)}
          />
          <p class="text-xs text-zinc-500 dark:text-poi-muted">{s.label}</p>
        </div>
        {i < steps.length - 1 && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"
            class="shrink-0 text-zinc-400 dark:text-zinc-600"
            aria-hidden="true"
            set:html={getLucideIcon('arrow-right')}
          />
        )}
      </>
    ))}
  </div>
</section>
```

### 旧コードからの差分メモ（レビュー用）
- ラベル `text-poi-blue` → `text-poi-muted`。
- 導入1文を、ナラティブ2段落（経営者視点→課題→信頼→法人化伴走／使われ続ける仕組み→後付け自動化→UX定着）へ差し替え。旧「補足テキスト」段落はこのナラティブに吸収して削除。
- 数値・フローを `metrics` / `steps` 配列化。
- 数値色 `dark:text-poi-blue` → `dark:text-poi-focus`（白）。
- 全カード枠 `dark:border-poi-blue/20`→`dark:border-poi-border/60`、hover `dark:hover:border-poi-blue/40`→`dark:hover:border-poi-border`。
- フローアイコン `text-poi-blue` → `text-poi-accent`（緑）。
- 本文 `leading-8`→`leading-7`、`space-y-5`→`space-y-4`。
- poi-blue はこのファイルから完全に消えること（grep で 0 件を確認）。

---

## 3. About.astro — typography のみ局所修正

色・構造は変えない。次の3点だけ置換する。

```diff
-  <div class="space-y-5 text-zinc-600 dark:text-poi-muted">
+  <div class="space-y-4 text-zinc-600 dark:text-poi-muted">
```

本文段落2つの行間を詰める（`leading-8` → `leading-7`、2箇所）:

```diff
-    <p class="text-sm leading-8">
+    <p class="text-sm leading-7">
       学習塾を12年経営し、合同会社でイベントスペース運営やプログラミング教育支援も手がけた。
```

```diff
-    <p class="text-sm leading-8">
+    <p class="text-sm leading-7">
       2025年にエンジニアへ転身。いまは SES で開発に携わりながら、個人開発と小さな組織への技術支援を並行している。
```

ABOUT ラベル（`text-poi-muted`）・タイムライン（`@Kyoto` 等の `text-poi-accent`）・ドット（`bg-poi-accent`）は基準どおりなので変更しない。

---

## 守秘

- マンション管理会社・SES 先の社名は出さない（「マンション管理会社」「SES 先のチーム」で十分）。上記コピーは遵守済み。
- 固有接続情報は `~/dotfiles/secrets-agents/` の辞書に従いマスク。`secrets-agents/` という語自体は dotfiles-public README で公開済みの一般名なので記載可。

## 検証手順（user 実施・PR の検証手順に Code が転記）

- `npm run dev` で `/` を開き、APPROACH に3本柱（01/02/03）と機密の分離カードが出ること
- IMPACT が文章先行になり、青がどこにも残っていないこと（緑の差し色のみ）
- ラベル APPROACH / IMPACT が About と同じ白っぽい色であること
- 本文の行間が About 含め詰まっていること
