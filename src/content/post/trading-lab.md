---
title: "Beyond the Terminal"
description: "ターミナルで見ていた運用導線を、判断しやすい Web console に置き直してみた"
publishDate: "2026-04-04"
tags: ["react", "fastapi", "nixos", "trading"]
image: "/images/posts/202603/trading-lab.webp"
imageAlt: "トレードラボの構図"
pinned: false
icon: "layout-dashboard"
aiDrafted: true
---

<div class="zoomable-wrap">
  <img src="/images/posts/202603/trading-lab.webp" alt="Trading Lab" />
</div>

## はじめに

普段、自分の自動売買やバックテストまわりはターミナル中心です。軽くて速く、その場で見て、その場で動かして、そのまま直せるので、開発や運用にはかなり合っています。

今回作った Trading Lab は、そのターミナルで扱っていた流れを、Web console として置き直してみたものです。

最初はバックテスト側の整理から始めましたが、いまは戦略選出だけでなく、現在価格やポジション、実行状態などの Live 側も含めて見られる形に広がっています。ターミナルを捨てたというより、ターミナルでやっていた確認や判断の入口を、より触りやすい画面に移した、という感覚に近いです。

実際に使っているものそのものではありませんが、見た目や流れはかなり近い形で公開しています。<a href="https://trading-lab.pages.dev/" target="_blank" rel="noopener noreferrer">Demoページ</a> をよかったら見てみてください。なお、別ウィンドウで開きます。

## なぜ Web console にしたのか

ターミナルは強い道具です。反応も速く、処理を動かす場所と確認する場所が近いので、開発中や調整中にはとても扱いやすいです。

ただ、運用や研究を少し俯瞰して見たいときには、別の見やすさがほしくなることがありました。どこで止まったのか、次にどこを見るべきか、いま全体がどういう状態なのかを、頭の中でつなぎ直しながら追う場面があったからです。

そこで今回は、もともとターミナルで扱っていた流れを、そのまま Web console に置き直してみることにしました。目的は見た目を整えることではなく、判断しやすい入口を作ることです。

実際に作ってみると、単に見やすくなるだけではなく、エラーの確認や停止箇所の把握もかなり自然にできるようになりました。細かい調査や修正そのものは引き続きターミナルが強いのですが、異常に気づき、状態を追い、次にどこを見るべきかを判断するところまでは、むしろ Web console の方がやりやすい場面もありました。

自分の中では、ターミナルの代替というより、ターミナルの良さを残しながら、状態確認や判断の部分を前に出した、少し上位の入口を作った感覚です。

## 構成

今回の console は、フロントだけで完結しているわけではありません。実際の処理は VPS 側で動いていて、そこに FastAPI を挟み、必要な状態や実行結果を取れるようにしています。フロント側は React + Vite で組みました。

構成としては、VPS 側に本体の処理があり、手元の Raspberry Pi 3 側でローカル Web として入口を受けています。Pi 3 では静的ファイルを配信しつつ、必要な API リクエストをトンネル経由で VPS 側へ流す形です。外からは Tailscale 経由で入れるようにしているので、ノート PC でもスマートフォンでも、同じ画面にそのままアクセスできます。

この形にしたことで、VPS 上で動いている処理を、毎回その場の端末に閉じずに見られるようになりました。ブラウザを開けば同じ入口に入れるので、確認の場所がぶれにくくなっています。

公開している Demo はポートフォリオ向けに完全なモックとして作ってあり、バックエンド接続はしていません。ただ、構成の考え方自体は実運用側とつながっています。

## 画面をどう分けたか

画面は、用途ごとに大きく4つに分けています。

**Live** は、現在価格、ポジション、決済履歴、バーを見て、いま何が起きているかを把握するための画面です。

**State** は、注文送信キュー、エントリー、送信済み、エラーなどを見て、何が流れ、どこで止まり、どこに異常があるかを追うための画面です。

**Pipeline** は、バックテストの各段階がどこまで進んでいるかを確認し、必要に応じて手動で走らせるための画面です。

**Ranking** は、セッションごとの戦略ランキングを見て、どの戦略を候補として扱うかを判断するための画面です。

意識したのは、機能を並べることではなく、確認の流れを分けることでした。いま何が起きているかを見る場所、どこで止まったかを見る場所、研究を進める場所、候補を選ぶ場所を分けることで、見るべきところに迷いにくくしています。

## 作って見えたこと

今回いちばん大きかったのは、フロントの役割の見え方が変わったことでした。

以前は、フロントの価値を見せることや整えることに寄せて考えがちでしたが、今回はそうではありませんでした。実際には、バックエンドで動いている処理を、人が判断しやすい形に置き直すことの方がずっと本質でした。

画面にしたことで、状態の把握、異常の入口、次に見る場所の整理がかなりやりやすくなりました。特に、バックテスト側と Live 側を同じ console の中で見られるようにしたことで、研究と運用が頭の中で分断されにくくなった感覚があります。

ターミナルは、処理を動かしたり、その場で深く直したりするのに向いています。一方で Web console は、全体の状態を見て、異常に気づき、次の行動を決めるのに向いていました。どちらかに置き換えるというより、役割を分けて使う方が自然でした。

## おわりに

Trading Lab は、ターミナルで扱っていた運用導線を、判断しやすい Web console に置き直してみた試みです。

実際に作ってみると、単にブラウザで見られるようになったというより、状態確認やエラー把握の入口としてかなり機能することがわかりました。細かい修正や深い調査は引き続きターミナルで行いますが、その手前で全体を把握し、次にどこを見るかを決める場所としては、Web console の方がむしろ扱いやすい場面があります。

また、VPS 上で動いているものを Pi 3 側のローカル Web として受け、Tailscale 経由でどのデバイスからも同じ場所に入れるようにしたことで、確認の導線自体もかなり整理されました。

技術的な詳細やコードは [GitHub](https://github.com/yktsnet/trading-lab) にまとめていますので、興味がある方はぜひどうぞ。

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
