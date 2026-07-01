## Works冒頭の書き換え＋運用基盤の図解追加
id: 34
branch-slug: works-intro-rewrite
github_issue: 58
status: close
type: feat
対象: |
  src/pages/works.astro（冒頭文 L48-59付近を書き換え、タグフィルタ手前に運用基盤図を新規追加）
内容: |
  Works冒頭文が抽象的な一般論になっており、かつ自己矛盾している。「すべて『動くデモ』で終わらせず...壊れずに回り続ける品質で実装している」と言い切っているが、直後の凡例で `Demo` タグを「OSSとしての再利用に適さず、実証や本番運用の参考に留めるもの」と定義しており、7件中4件が`Demo`タグ（矛盾）。

  加えて、複数プロダクト（OSS/Demo計7件、今後も増加予定）を同一の自己ホスト基盤上でCI/CD自動デプロイし同時稼働させているという運用の仕組みが、サイトのどこにも伝わっていない。個別カード（Works）やApproachの「機能より、安定」原則ではTrading Lab単体の文脈でしか触れられておらず、横断的な事実として伝わっていない。

  Worksカード自体（一覧・データソースの `src/data/works.ts`）は変更しない。変更は冒頭のテキストと、その下に新設する運用基盤の図解のみ。
確認: |
  npm run typecheck
  npm run build

---

### 検討の経緯（別チャットでの議論より）

伝えるべき本質は「プロダクト数の多寡」ではなく、**新しいプロダクトを増やしても運用の手間が比例して増えない仕組みを持っていること**。各プロダクトは同じ1本の経路（`git push` → CI/CD自動デプロイ → 共有の自己ホスト基盤で常駐）に乗るだけで、個別にサーバーやデプロイ手順を作り直していない。数字（「7件」等）は今後も増減するため文言・図のどちらにも固定値を書き込まない。

図の要否は次の理由で「要る」と判断した。

- Approach/Impactの矢印フローは「連鎖・分岐」（時系列の変化）を表す形であり、今回伝えたい「複数プロダクトが同一基盤上で同時に動いている」という**並列性**を表現するには不適合（線形フローは一つの物語しか語れない）
- 数字の並置（Impactの`metrics`パターン）も検討したが、個数を明示すると固定値になり増加と矛盾するため不採用
- 「複数の入力が1つの基盤に集約され、常時稼働している」という構造そのものを絵にする必要がある → 代表チップ（数を明示しない）＋矢印＋単一の基盤ボックス、という構成に決定

### 冒頭文（p）の書き換え案

矛盾する言い切り（「壊れずに回り続ける品質で実装している」）を削り、トーンを弱める。

```
IoTデバイスから自動取引まで、異なる制約のなかで実際に動かしてきたプロダクト群。
```

見出し（h2）は今回のスコープでは維持する（矛盾していないため）。

### 運用基盤の図解（新規）

タグフィルタパネルの手前に挿入。既存の `resolvedTags`（カテゴリタグ一覧、L38-45で算出済み）から先頭数件を代表チップとして使い、個数を明示しない「+」チップで開放性を表す。基盤ボックスの「稼働中」表現は `src/components/Impact.astro` の `w.live` ドットパターン（緑ドット＋テキスト）を踏襲し、サイト内の視覚言語を統一する。

固有名（自己ホストサーバーの実機名等）は公開ページに出さない。「単一の自己ホストサーバー」のように抽象化する。

```astro
<!-- 運用基盤の図解: 複数プロダクトが同一の自己ホスト基盤上で常時稼働 -->
<div class="mt-8 flex flex-col items-center gap-3">
  <!-- 上段: 代表チップ（個数は明示しない） -->
  <div class="flex flex-wrap items-center justify-center gap-2">
    {resolvedTags.slice(0, 4).map(({ name, iconPath }) => (
      <span class="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 dark:border-poi-border/80 bg-white/40 dark:bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-zinc-500 dark:text-poi-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
          set:html={iconPath}
        />
        {name}
      </span>
    ))}
    <span class="inline-flex items-center rounded-full border border-dashed border-zinc-300 dark:border-poi-border/60 px-3 py-1.5 font-mono text-xs text-zinc-400 dark:text-poi-muted/70">
      +増え続ける
    </span>
  </div>

  <!-- 中段: 経路のラベル -->
  <div class="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 dark:text-poi-muted/70">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.5"
      stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true"
      set:html={getLucideIcon('arrow-down')}
    />
    push → CI/CD自動デプロイ
  </div>

  <!-- 下段: 単一の基盤ボックス（Impact.astroのliveドットパターンを踏襲） -->
  <div class="inline-flex items-center gap-2.5 rounded-[10px] border border-poi-accent/30 bg-poi-accent/[0.06] dark:bg-poi-accent/[0.04] px-4 py-2.5">
    <span class="text-sm font-semibold text-poi-accent">単一の自己ホストサーバー</span>
    <span class="inline-flex items-center gap-1.5 text-xs text-poi-accent">
      <span class="inline-block h-1.5 w-1.5 rounded-full bg-poi-accent"></span>常時稼働
    </span>
  </div>
</div>
```

`arrow-down` アイコンが `src/lib/lucide.ts` に未登録の場合は追加が必要（Lucide公式SVGパスから転記）。

挿入位置: L57（既存 `</div>` = 冒頭文ブロック閉じタグ）の直後、L61のフィルタパネル用コメントの手前。
