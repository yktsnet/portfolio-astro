## Works トップにライブメトリクス帯を新設し、ブループリント詳説をカード群の下へ移す
id: 37
branch-slug: works-live-strip
github_issue: 65
status: close
type: feat
対象: src/pages/index.astro, src/components/HostingArchitecture.astro, src/components/InfrastructureBlueprint.astro (新規), src/components/status/LiveStatusStrip.astro (新規)
内容: `/`（Works）の1画面目にプロダクトカードが入るよう、SHARED INFRASTRUCTURE BLUEPRINT の詳説カードをカード群の下へ移動する。代わりに先頭へ1行のライブメトリクス帯（稼働日数・CPU・メモリ + 詳細へのアンカー）を置き、「動いている証拠」は先頭に残す。
確認: `npm run typecheck` と `npm run build` が通ること。SV6StatusChart のトグル・fetch がリファクタ後も壊れていないことをコードを読んで確認すること。

---

## 背景

トップを Works にした目的は「何を作れる人か」に最初に答えること。しかし現状は 1 画面目がインフラ詳説（[HostingArchitecture.astro](../src/components/HostingArchitecture.astro) の仕様表）で占められ、カードが 1 スクロール先にある。逆にカードを先頭にするだけだと、サイト最強の証拠であるライブメトリクスが 7 枚のカードの下に沈む。「証拠は先頭に薄く、詳説は下に厚く」で両立させる。

## 仕様

### ページ構成（src/pages/index.astro）

上から:

1. 見出し + リード文（現 HostingArchitecture.astro:5-15 の部分。位置は変えない）
2. **ライブメトリクス帯（新規 LiveStatusStrip）**
3. WorkFilter + WorkCard 群（既存のまま）
4. **ブループリント詳説（新規 InfrastructureBlueprint。`id="infrastructure"` を付与）**

### コンポーネント分割

- `HostingArchitecture.astro` を分割する:
  - 見出し + リード文 → そのまま残す（帯をこの直後に含めてよい）
  - 仕様表カード（現18-110行、SV6 トグルと `<script>` 含む）→ `InfrastructureBlueprint.astro` として切り出し、内容は無変更で移設
- `LiveStatusStrip.astro`（新規、`src/components/status/`）:
  - 1行のコンパクトな帯。表示: 稼働ドット + 「全デモ同居ホスト 稼働中」+ 稼働日数 / CPU / メモリの3値 + 「設計の詳細 ↓」（`#infrastructure` へのアンカー）
  - 数値は SV6StatusChart と同じ `GET /api/status` をクライアント側 fetch で取得する（取得ロジックは SV6StatusChart.astro を参照し、必要なら共通化してよい）
  - 取得失敗時・開発サーバー時は数値部分を非表示にし、帯自体は「設計の詳細 ↓」リンクとして機能させる（ビルドを壊さない）

### 制約

- 仕様表カードの文言・レイアウトは変更しない（移設のみ）
- デスクトップ初回ビューポート（1280x800 目安）で最初のカードの先頭が見えること
- スタイルは既存のトーン（font-mono の帯・poi-accent のドット）に合わせる

## 実装順序

1. InfrastructureBlueprint.astro の切り出しと index.astro での配置換え
2. LiveStatusStrip.astro の新設と fetch 実装
3. typecheck / build
