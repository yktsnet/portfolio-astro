---
title: "Turning backend work into a live demo"
description: "見えにくいバックエンドの実装と運用を、機密を保ったままポートフォリオとして伝わる形に変換した記録"
publishDate: "08 Mar 2026"
tags: ["astro", "cloudflare", "dashboard"]
pinned: false
image: "/images/posts/202603/live-status.webp"
imageAlt: "ライブ・デモページの構成図"
icon: "chart-candlestick"
aiDrafted: true
---

<div class="zoomable-wrap">
  <img src="/images/posts/202603/live-status.webp" alt="Live Demo" />
</div>

## はじめに

Hetzner VPS 上で動いている自動売買パイプラインの状態を、Cloudflare KV 経由で集約し、Astro SSR で表示する公開ページを作りました。[Live Demo](https://ykts.net/live-demo/) として公開しています。

自分がこれまで主に作ってきたのは、サーバーの中で動くバックエンドや運用の仕組みでした。ただ、それらはそのままだと外から見えにくく、ポートフォリオとしても伝わりにくいところがあります。

そこで、実際に動いている自動売買パイプラインを題材に、機密を保ったまま、運用の気配や設計の考え方が伝わる公開ページを作りました。この記事では、Live Demo の実装手順そのものよりも、なぜこれを作ったのか、何をどう見せることにしたのか、その判断の背景を書きます。

技術的な実装が気になる方は [portfolio-astro (GitHub)](https://github.com/yktsnet/portfolio-astro) から参照してください。

## バックエンドを外に出す必要があった

私は長く経営に関わってきましたが、その後、個人開発者として自分で実装するようになりました。2025年7月頃に、コードを1行も書いたことがない状態から、GPT と対話しながら自動売買システムを作り始めました。

半年ほど集中して取り組み、バックテストからエントリーまで一貫して回る仕組みを少しずつ形にして、今年の初め頃にはひとまず完成と言えるところまで持っていきました。その過程で強く感じたのは、難しいのは売買ロジックだけではなく、環境構築や再現性、状態管理、安定運用のほうでもあるということでした。

その後、個人で完結する開発だけでなく、チーム開発にも進みたいと考えるようになりました。そこで必要になったのが、自分が何を作ってきたのかを外に伝えることでした。ただ、バックエンドや運用の仕事は見えにくく、自動売買は機密性も高いため、中身をそのまま見せることはできません。そこで、内部を直接公開するのではなく、スキルや設計の意図が伝わる形に組み直して見せることにしました。

## 自動売買という特殊性

自動売買は、ポートフォリオの題材として少し特殊です。実際に動いている仕組みではありますが、戦略そのものや損益、銘柄、判断ロジックの詳細はセキュリティ上、素直に全て公開するものではありません。

一方で、その周辺には積み上げてきた感覚やスキルは確かにあります。定期実行、状態の集約、遅延の把握、データの整形、公開可能な形への変換。Live Demo で見せているのは、そうしたバックエンド側のことが少しでも垣間見えるよう、伝わるように工夫してみました。

内部には実行や制御を担う層があり、その周辺に監視、状態集約、可視化用の加工を担う層があります。今回前面に出しているのは後者であり、内部をそのまま見せるのではなく、外から見ても意味が通る形に翻訳してあります。

## 公開する指標の選び方

外から見たときに、まず「何かが動いている」と感じられることを重視して、Live Demo では SESSION、HEATMAP、LATENCY、FRESHNESS の4つの指標を置いています。

ここで出しているのは、損益や売買判断そのものではありません。システムが動いていること、どの時間帯に活動があるか、どのくらいの遅延で反応しているか、元データの鮮度がどうかといった、運用の輪郭です。

Live Demo から今日もちゃんと動いていることが伝わり、遅延や鮮度の変化からアクティブであることやライブ感が直感的にわかることを目指しました。

## 構成は薄く

構成自体はシンプルです。

```text
het (Hetzner VPS · NixOS · systemd timer)
└─ Python → Cloudflare KV → Astro SSR → /live-demo
```

サーバー側で定期的に状態を集約し、公開用に整えたうえで、Astro SSR で読み出して表示しています。

今回ほしかったのは、秒単位のリアルタイム性ではありませんでした。大事だったのは、数分単位で更新される状態を安定して外に見せられることです。そのため5分の遅延を挟み、機密性のある情報を落としたうえで、必要な指標だけを KV に送っています。

## ダッシュボードとしての見せ方について

技術的には、Cloudflare KV、Astro SSR、Hono、SVG と比較的軽い構成です。ライブラリを重ねて派手な画面を作るより、依存を増やさずに必要な情報だけを安定して返すことを優先しました。

たとえば SVG チャートは `document.createElementNS` で描画しています。ここでやりたかったのは、可視化ライブラリを使いこなすことではなく、公開ページとして必要な表現だけを、自分で制御しやすい形で持つことでした。

今回の制作で本当に重要だったのは、技術選定そのものより、どこまでを公開用の面として切り出すかの判断でした。内部運用の情報を、意味が通る最小単位まで削り、見せられる形に整える。その設計のほうが、このページでは本質だったんじゃないかなと思います。

## おわりに

[Live Demo](https://ykts.net/live-demo/) は、内部で動いている自動売買パイプラインの一部を、公開可能な粒度へ整えて、ポートフォリオとして伝わる形にしたページです。

私がやりたかったのは、自動売買そのものを公開することではなく、見えにくいバックエンドの実装や運用を、機密を守りながら、外から見ても意味が通る面に変換することでした。

その意味で今回の制作は、バックエンド、運用、可視化を別々に考えるのではなく、何をどう見せれば自分のスキルが伝わるかまで含めて設計した最初のデモになりました。自動売買のシステムを持続運用しつつ、少しずつ改善しつつ、ポートフォリオとして出せるものや見せられるものを、今後も整えていきます。

<style>
.zoomable-wrap img { cursor: zoom-in; max-width: 100%; max-height: 65vh; display: block; margin: 0 auto; }
#lightbox { display:none; position:fixed; inset:0; background:rgba(0,0,0,.85); z-index:9999; cursor:zoom-out; align-items:center; justify-content:center; }
#lightbox.open { display:flex; }
#lightbox img { max-width:92vw; max-height:92vh; object-fit:contain; }
</style>

<div id="lightbox"><img id="lightbox-img" src="" alt="" /></div>

<script>
document.querySelectorAll('.zoomable-wrap img').forEach(img => {
  img.addEventListener('click', () => {
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox').classList.add('open');
  });
});
document.getElementById('lightbox').addEventListener('click', () => {
  document.getElementById('lightbox').classList.remove('open');
});
</script>
