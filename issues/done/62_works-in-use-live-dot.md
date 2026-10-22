## PR記録: feat(works): 稼働中表示をタイトル横のLiveドットに移行しカードの矢印を整理する
issue: 62 (62_works-in-use-live-dot.md)
PR: https://github.com/yktsnet/portfolio-astro/pull/

## 変更内容
- Works カード右側にあった「● 稼働中」を削除し、右側のメタ情報を「タグ + 公開年月」に統一して情報過多と野暮ったさを解消
- Works カードのタイトルから external-link（矢印アイコン）を削除（カード全体がリンクになっているため不要かつホバー時の上下のガタつきを防止）
- タイトル横に Live インジケーター（6px ドット + 2.5秒周期の animate-ping によるレーダー波紋）を配置
- スクリーンリーダー向けアクセシビリティ（`sr-only` による「稼働中 / in use」）を維持

## 保証
- 稼働中（inUse）の作品カードのタイトル横に Live ドットが表示される
- 非稼働中および researches のカードにはドットが表示されない
- カード右側のメタ情報が「タグ + 公開年月」で統一される

## 静的確認結果
`npm run typecheck`・`npm run test`（14 passed）・`npm run build` が通る。

## 画面確認
ユーザーによる実機画面確認およびデザインレビューを行い、ドットの位置・サイズ感・アニメーション速度（2.5s）を調整済み。

---

## Works カードの稼働中表示をタイトル横のLiveドットに移行しカードの矢印を整理する
id: 62
branch-slug: works-in-use-live-dot
status: close
type: feat
対象: src/components/AllWorks.astro
内容: Works カードにタグを表示したことで情報量が多く野暮ったくなっていた「● 稼働中」の表示を整理。右側は「タグ + 公開年月」に統一し、稼働中のステータスはタイトル横にゆったりとした波紋アニメーションを持つ Live ドットとして配置する。また、カードタイトルの external-link 矢印を削除してホバー時のガタつきを解消する。
確認: `npm run typecheck`、`npm run test`、`npm run build` が通る。
