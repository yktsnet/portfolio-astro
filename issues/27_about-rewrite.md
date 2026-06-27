## About 文面リライト（固有性・現職・役割軸年表）
id: 27
branch-slug: about-rewrite
github_issue: 42
status: open
type: feat
対象: |
  src/components/About.astro
内容: |
  About の文章を「思想の表明」から「事実で語る実務家の紹介」へ作り直す。
  ポートフォリオの目的（採用側に固有の強みと現在地を最短で伝える）に対し、
  現状は (1) 見出しが一般論、(2) リードが物語先行で現職テックリード／外部CTO が埋もれ、
  (3) 年表が地理軸で役割が見えない、の3点がズレている。これを是正する。

  方針メモ: 「一気通貫」は使わない（「一人で通す／単独で担う」と言い換え）。
  固有名・接続情報は出さない。数字は職務経歴書の実績（12年 / 月約5h / 月3〜4万）を使う。
確認: |
  npm run typecheck が通ること。
  TimelineEntry / LocationGroup の型変更は不要（location 文字列の意味づけのみ変更）。
  @{location} 表示が "@Management" / "@Engineering" になること。

---

## 1. 見出し（現 27-29行目）

一般論スローガンを廃し、経歴の事実で固有性を立てる。

```astro
<p class="mt-2 text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-poi-focus">
  学習塾を12年経営し、2025年にエンジニアへ転身した。<br class="hidden sm:block" />技術が「導入される側」を知っているエンジニア。
</p>
```

## 2. リード文（現 30-37行目）

段落順を「経営の景色 → 現在」から **「現在の二枚看板 → 経営という裏付け」** へ反転。
第1段落で現職を事実として格上げ（テックリード／外部CTO）。第2段落は経営経験を強みの根拠として圧縮し、数字を1つ含める。

```astro
<div class="mt-6 space-y-4">
  <p class="text-sm leading-7">
    いまは SES 企業でテックリードとして受託開発とインフラの IaC 化を担い、並行してマンション管理会社の外部 CTO として現場の DX を推進している。要件が曖昧な段階からビジネス課題を技術へ翻訳し、現場で使われ続ける形まで単独で落とし込む。
  </p>
  <p class="text-sm leading-7">
    強みの土台は経営経験にある。学習塾を12年単独で運営し、合同会社の設立から清算までを担った。技術が導入される側の景色——コスト感覚、現場の抵抗、使われなくなるまでの経緯——を経営者として知っている。だから機能を増やすより、使われ続ける仕組みをつくることを優先する。
  </p>
</div>
```

## 3. 年表（現 5-21行目）

地理軸（Kyoto / Osaka）を **役割軸（Management / Engineering）** へ変更。型・描画ロジックは変えず、配列の中身とラベルだけ差し替える。

```ts
const timeline: LocationGroup[] = [
  {
    location: "Management",
    items: [
      { year: "2013", label: "学習塾 開業" },
      { year: "2019", label: "合同会社 設立" },
      { year: "2024", label: "合同会社 清算" },
      { year: "2025", label: "学習塾 閉業" },
    ],
  },
  {
    location: "Engineering",
    items: [
      { year: "2025", label: "エンジニア転身 / 個人開発・外部CTO" },
      { year: "2026〜", label: "SES テックリード" },
    ],
  },
];
```

## 対象外（別 Issue）

- 英語 bio（左ペイン側）のトーン整合は本 Issue では触らない。
- About 以外のページ文面は順次別 Issue で扱う。
