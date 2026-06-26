## APPROACH 拡充・IMPACT ナラティブ化・配色規律と本文 typography
id: 24
branch-slug: approach-impact-depth-and-color
github_issue:
status: open
type: feat
対象: |
  src/components/Approach.astro
  src/components/Impact.astro
  src/components/About.astro
内容: |
  Issue 23 / 23a で新設した APPROACH・IMPACT を、履歴書（resume.md）と
  dotfiles-public README を正として中身を厚くし、配色を About 基準へ揃える。
  1. APPROACH を dotfiles-public README の「3本柱」の忠実な投影に作り直す
  2. IMPACT を数値先行からナラティブ先行へ転換する
  3. APPROACH / IMPACT のラベル色を About と同じ白っぽい色に統一し、
     グリーン（poi-accent）を唯一のキーカラーとして点で使う配色規律にする
  4. About 含む3セクションの本文 typography を締める
確認: |
  npm run typecheck が通ること
  npm run build が通ること

---

## 背景

現状の APPROACH / IMPACT は要素数は多いが各々が一行ラベルで、主張の根拠（なぜそうするか）が地の文から抜けている。また色数が多く（緑・青・紫の併用、Bento 全体の緑枠）、About のシンプルさと不整合。履歴書と dotfiles-public README を正として、中身と配色の両方を整える。

参考（正とする資料）:
- `~/dotfiles/99docs/recruite/resume.md`（開発経歴①・③／自己PR①②③）
- `github.com/yktsnet/dotfiles-public` README の「Philosophy & Core Architecture」3本柱
- `~/dotfiles/99docs/recruite/portfolio-alignment-todo.md`（IA 方針）

---

## 1. APPROACH を dotfiles-public 3本柱の忠実な投影に

APPROACH は dotfiles-public（AI協調開発基盤）の投影と位置づける。README の核は次の3本柱。現状はロール分離（柱①）と Nix（柱②）だけで、**柱③が完全欠落**しており、各柱の「なぜ」も無い。

### 導入の地の文（README の因果に揃える）
現状の1文を、README 冒頭の二段の因果に沿った内容へ書き換える:
- 環境差はエージェントの自律実行を妨げる → Nix Flakes で解消
- 破壊的操作・機密漏洩は人間の確認を経ず通りかねない → ロール分離と隔離で抑える

### 柱①ロールの分離（現 Bento を活用）
設計（対話型AI）／実装（自律型AI）／検証（人間）。現状の3カード Bento を流用。各カードに「なぜ分けるか＝自律実行を本番・メインブランチに直接及ばせないため」が伝わる一文を保つ（サブテキストの粒度を上げる）。

### 柱②環境差を排除する Nix の役割（「なぜ」を付ける）
現状はフロー1コマに圧縮されている。「環境差でエージェントが『コマンド未検出』『実行時エラー』に陥るのを防ぐ」という目的と、`nix flake check` による継続検証を地の文または図解に含める。

### 柱③機密・インフラ設定の分離（**新規追加**）
本番の IP・ポート・実ホスト名などを公開リポ／Issue に直書きせず、ローカルの `secrets-agents/` に隔離してエージェントに参照させる、という柱を追加する。柱①②と並ぶ第3の要素として可視化する（カード or 段落、レイアウトは①②と整合させる）。

### 維持する要素
- Claude Code / Jules 両対応の表現
- `dotfiles-public` への OSS リンク（ピル型）
- チーム適性の補足（SES 先への持ち込み）。※ただし下記「3. 配色規律」で色を見直す

### スコープ外
- 柱B（運用負荷を自動化で削減する設計＝自動取引の確実性優先・JSONL/systemd・宣言的構成管理）は APPROACH に入れない。IMPACT の設計思想（後述）で表現する。

---

## 2. IMPACT をナラティブ先行に

現状は導入1文＋数値カード2枚＋フロー図で、物語が無い。数値（5h・3〜4万）が前提なしに裸で置かれている。

### ナラティブを地の文で通す
履歴書 開発経歴①・自己PR①に沿って、次の流れを地の文で語る:
- 経営者として「技術が導入される側」を知っている
- 現場を長年担ってきたオーナーが経営側へ移行したいという課題
- 勤怠改善を起点に信頼関係を築き、法人化に向けた全面的な DX 支援を担当
- 「機能を増やすのではなく、使われ続ける仕組みをつくる」という核

### 数値・フロー図は論拠として後段へ降格
数値メトリクスカード（~5h / 3〜4万）と勤怠DXフロー図は、ナラティブの裏付けとして本文の後段に置く。

### 柱B を設計思想としてここで明示
「既存の Excel・スプレッドシート運用を無理に変えず、自動化を後付けする設計方針」を、単なる手順ではなく設計思想として刻む（柱B＝運用負荷を仕組みで削減、の現れ）。

---

## 3. 配色規律（About を基準に）

About はグリーン（poi-accent #5de4c7）を点でしか使っておらず、シンプルで締まっている。APPROACH / IMPACT はこの規律に揃える。

### ラベル色を白っぽい色に統一
- `APPROACH` ラベル: `text-poi-accent`（緑）→ `text-poi-muted`（白っぽい #a6accd、About の `ABOUT` と同じ）
- `IMPACT` ラベル: `text-poi-blue`（青）→ `text-poi-muted`

### グリーンを唯一のキーカラーにし、点で使う
- **poi-blue（青）を IMPACT から廃止**。数値・カード枠・アイコンの青をやめる。数値は `poi-focus`（白）でサイズによる強調に寄せ、色はキーカラーのグリーンに一本化する。
- **紫 `#c792ea`（チーム適性の border-left）を廃止**。`poi-border` 等の無彩色か、グリーン系へ寄せる。
- **Bento / カードの緑枠の常用をやめる**。カード枠は無彩色（`poi-border` ベース）を基本にし、グリーンはアイコンや OSS リンクなど「点」に限定する。hover で枠をわずかに動かす程度は可。
- 全体として「無彩色（白・muted・zinc）＋グリーンの差し色」で、About と同じ密度感にする。色数が多い状態（緑・青・紫の併用）を解消するのが目的。

### 適用範囲
- 上記は APPROACH / IMPACT を対象。About は既に基準どおりなので原則変更しない（typography を除く）。

---

## 4. 本文 typography を締める（3セクション横断）

About / Approach / Impact の本文段落が `text-sm leading-8`（行間が開きすぎ）で締まりが無い。

- 本文段落の `leading-8` → `leading-7` 程度に詰める
- 見出し直下の `space-y-5` 等の縦リズムも合わせて点検し、過剰な余白を詰める
- セクション間余白（`mb-28 pb-20`）・区切り線は現状維持

---

## デザイン原則（Issue 23 から継続）

- Poimandres テーマのカラートークン（`poi-*`）を使う。新しいカラーを Tailwind config に追加しない
- CSS のみで実現（JS アニメーションは入れない）。Astro 静的レンダリング
- Lucide アイコンは `src/lib/lucide.ts` のエントリを使う（npm 追加不要）
- box-shadow / filter / backdrop-filter は使わない

## 守秘

- マンション管理会社・SES 先の社名は出さない（「マンション管理会社」「SES 先のチーム」で十分）
- 固有接続情報は `~/dotfiles/secrets-agents/` の辞書に従いマスク
