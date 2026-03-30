---
title: "Backtest console with a web UI"
description: "ターミナルで扱っていたバックテストを、あえて Web UI に置き直してみた記録。"
publishDate: "2026-03-29"
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

普段、自分の自動売買やバックテストまわりはターミナル中心です。その場で見て、その場で動かして、そのまま直せるので、自分にはいちばん自然なやり方です。

今回作った Trading Lab は、そのバックテスト側をあえて Web UI に置き直してみたものです。

バックテスト自体は以前から普通に動いていました。ただ、ライブの運用側とは違って毎日見るものではありません。少し間が空くと、どこから見て、どの順で走らせて、何を確認するのかを思い出す必要があり、それが再開の負荷になっていました。

そこで今回は、普段ターミナルで扱っている流れを、そのまま画面として前に出したらどうなるのかを試してみました。しばらく触っていなかったバックテストを、もう一度自分の手でつなぎ直しながら、普段使う道具として整理し直すのにも、ちょうどいい題材でした。

実際に使っているものそのものではありませんが、見た目はほぼ同じです。<a href="https://trading-lab.pages.dev/" target="_blank" rel="noopener noreferrer">Demoページ</a> をよかったら見てみてください。なお、別ウィンドウで開きます。

## なぜ Web UI にしたのか

TUI は軽く、処理の実行と確認が一直線につながるので、開発や運用にはかなり強い道具です。実際開発もVscodeなどの統合IDEではなくRangerとHelixを組み合わせたTUIの独自IDEを使っています。

ただ、その強さがそのまま研究用の道具としての使いやすさにつながるかと言ったらそうでもないかなと思いました。バックテストは、ライブ運用のように毎日同じ熱量で触るものではないからです。もちろん本番が安定して動けば、その後は研究を深めるためにバックテスト中心になりますが、久しぶりに開くと、どこまで進んでいて、次に何を見ればいいのかを頭の中で補いながら追うことになり、わからなくなることがあるんですよね。

そこで今回は、手順を頭の中だけで持ち続けるのではなく、Web UI に置き直してみることにしました。React も触って見たかったし、フロントに画面として組み直すことで手順を思い出すいい機会になるしし、自分の中でも構成を整理し直せるなと思ったからです。

## 構成

今回の目的は、バックテストを実際に回すための画面を Web UI として作ることでした。Demoページはポートフォリオ向けに公開していますが、もともとはまず自分が使う道具として整理して作りたかったのです。

裏側ではもともと Python のスクリプト群とローカルファイルを中心に処理が回っています。そこに FastAPI を挟み、必要な状態や実行結果を取れるようにし、フロント側を React + Vite で組みました。

本番の自動売買と違って、こちらは研究用です。即時性を最優先する必要はありません。その代わり、途中で立ち止まっても状態を追いやすいこと、また開いて研究を深めようと思えることを優先しました。

## 作って見えたこと

実際に作ってみていちばん発見だったのは、Web UI でもターミナルに近い感覚でエラーや停止箇所を追えることでした。

画面化すると見やすさは出ても、異常の追い方はどうしてもターミナル寄りのままだろうと思っていましたが、どの段階で止まったのか、次にどの処理を見るべきか、どこで様子がおかしくなったのかを画面側からかなり自然に辿れるようになりました。デバッグのエラーも普通に出せます。もっと細かい調査そのものはターミナルでやるとしても、異常に気づいてロジックを見直すところまでは Web UI 側でも十分に機能する。その感覚は、作る前に想像していたよりずっと大きかったです。

以前は、フロントの価値を「見せること」や「整えること」に寄せて考えがちでしたが、今回はそこがいい意味で裏切られました。見た目を整えることより、判断しやすい入口を作るというイメージでフロントを組めるのだなと。バックエンドで動いている処理を、人が触って考えやすい形に置き直す。その役割がフロントだなと捉える方が、私にはずっと自然でした。

## Trading Lab という名前にした理由

名前を Trading Lab にしたのは、完成した運用画面ではなく、試したり見直したりする場として扱いたかったからです。

バックテストには、変えたくない部分と、試しながら見ていきたい部分があります。本番とつながる土台はそのまま残しつつ、試すための入口だけを扱いやすくする。その形が自分にはちょうどよさそうでした。

## おわりに

Trading Lab は、ターミナルで扱っていたバックテストを、そのまま Web UI に置き直してみた試みです。

今回あらためてはっきりしたのは、ターミナルと Web UI（フロント） にはそれぞれ向いている役割があるということでした。即時性が重要な実働のトレードでは、軽くて速く、すぐ触れるターミナルの方が合っています。一方でバックテストは、手順や状態、今何をしようとしているのかを把握しながら進めることが重要なので、流れを置いておける Web UI の方が適していました。どちらかに置き換えるというより、役割に応じて使い分けるのが大事だなと理解しました。

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
