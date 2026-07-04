## トップ上段の配分を最適化する（ヒーロー主語の一本化とフィルタ軽量化）
id: 38
branch-slug: top-fold-refine
github_issue: 67
status: close
type: feat
対象: |
  src/components/HostingArchitecture.astro
  src/components/WorkFilter.astro
内容: |
  トップページの主役を Works に寄せるため、上段の配分を直す。
  (1) ヒーロー見出し・リード文の主語をプロダクトに一本化し、インフラの主張は直下の LiveStatusStrip に委ねる。
  (2) WorkFilter のパネルを軽量化し、最初の WorkCard への到達を早める。
  サンドイッチ構造（上段 teaser / 中段 Works / 下段 InfrastructureBlueprint）自体は維持する。
確認: |
  `npm run typecheck` と `npm run build` が通ること。
  WorkFilter の script（タグ絞り込み・OSS/Demo 絞り込み・404 リセット）が DOM 変更後も
  セレクタ・データ属性の対応が壊れていないことをコードを読んで確認すること。

---

## 背景

トップは Works ページだが、1文目の見出しが「プロダクト群と、その同居を支えるインフラ設計。」と主役を2つ並べており、ページの主張が最初から分岐している。インフラが「動いている証拠」であることは直下の LiveStatusStrip（稼働ドット + メトリクス + Details アンカー）が視覚的に一行で示しているため、見出しの文言で重ねて言う必要がない。

また、最初のプロダクトカードに届くまでに COLLECTION 見出しブロック + フィルタパネル（Genre 7 ピル + Status 2 ボタンの2段）を越える必要がある。作品は7件で表示順は works.ts のソート（inUse → priority → publishedAt）で制御済みであり、初見の訪問者は絞り込まずスクロールする。フィルタは残すが、面積を大幅に減らす。

## 仕様

### 1. ヒーロー文言の一本化（HostingArchitecture.astro:6-15）

- 見出し（h2、2行構成）の主語をプロダクトに一本化する。文言案（jp-writing 規範に沿えば調整してよい）:
  - 1行目: 「現場や日常で、」
  - 2行目: 「いま実際に動いているプロダクト群。」
- リード文は「何を作っているか」を先に述べ、同居インフラへの言及は末尾の一句に圧縮する。文言案:
  - 「IoTデバイスからWebシステム、AI統合まで、実際の現場や日常のなかで動く実用プロダクトを開発しています。すべて1台の共有サーバーに同居して常時稼働しています。」
- LiveStatusStrip の呼び出し位置・内容は変更しない（インフラの主張はここが担う）。

### 2. WorkFilter の軽量化（WorkFilter.astro）

折りたたみではなく**一段化**で対応する（クリックを要求せず、面積だけ減らす）。

- セクションヘッダー（16-24行）: `COLLECTION` ラベルは残し、h2「プロダクトの閲覧・絞り込み」と説明文の2行は削除するか、説明文1行のみに圧縮する。直前のヒーロー見出しと役割が重複しているため。
- カードパネル（27行の rounded-xl ボーダー枠）と `Filter by Genre` / `Filter by Status` のラベル、区切り線（73行）を撤去し、ピル群をインラインの flex-wrap 1ブロックに統合する。
- OSS / Demo ボタン（80-118行）は現在の「説明文付き2カラムボタン」をやめ、Genre ピルと同型の小さなピル2個にする。説明文（「クローンして再利用できる公開コード」等）は `title` 属性に退避するか削除する。
- 排他選択（activeType）の挙動・aria 属性（`aria-checked`）・script のセレクタ（`.work-filter-btn` / `.type-filter-btn` / `#work-filter` / `#work-empty`）は維持する。DOM を変える場合は script 側も追随させる。
- 404 空状態ブロック（125-152行）は変更しない。

### 制約

- デスクトップ初回ビューポート（1280x800 目安）で最初の WorkCard の先頭が見えること（Issue 37 と同じ基準）。
- モバイルでフィルタ全体（ピル群）が概ね3行以内に収まること。
- 既存トーン（font-mono ピル・poi-accent のアクセント・ダークモード両対応）を維持する。
- index.astro・InfrastructureBlueprint.astro・LiveStatusStrip.astro は変更しない。

## 実装順序

1. HostingArchitecture.astro の見出し・リード文の書き換え
2. WorkFilter.astro のヘッダー圧縮・パネル撤去・Status ピル化と script の追随
3. typecheck / build、フィルタロジックの静的確認
