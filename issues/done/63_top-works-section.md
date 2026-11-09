## Add a Works section below Workflow on the top page
id: 63
branch-slug: top-works-section
status: close
type: feat
対象: src/data/works.ts (新規), src/data/works.test.ts (新規), src/components/WorkList.astro (新規), src/pages/index.astro, src/lib/lucide.ts, github-snapshot.json, CLAUDE.md, context/structure.md
目的: #185 でトップを Services 中心に組み替えて以降、Services に出していない公開リポがサイトから見えなくなった。Workflow 節の直下に Works 節を置き、それらを小さいカードで並べる。Services より目立たせず、何を頼めるかの見通しを崩さない。
内容: `src/data/works.ts` に Services に出していない公開リポ13本を置き、Workflow 節の直下に3列の小さいカードで並べる。最初は6枚を出し、残りは「すべて見る」で開く。Services の提供物からリンクしているリポは Works に出さないことをテストで固定する。
対象外: カテゴリでの絞り込み・並べ替え。稼働中の印。詳細ページや `/works/` の一覧ページの新設。ヘッダーへのメニュー追加。Services・Workflow 節の変更。
仮定: なし（UI を見ながら user と相談して詰めたため、このセッションで実装した）
確認:
- `npm run typecheck` と `npm run test` が通る
- `src/data/works.test.ts` が、title の重複が無いこと・href が `https://github.com/yktsnet/<title>` であること・日英の説明がどちらも空でないこと・`services` の offerings の repos と重ならないことを確かめる
- トップ（`/`）で、`#workflow` の直後に `id="works"` の節がある
- 幅 1280px で3列、最初に6枚が出て「すべて見る（13）」がある。押すと13枚、もう一度押すと6枚に戻る
- 各カードは GitHub を `target="_blank"` `rel="noopener noreferrer"` で開く
- 幅 375px で横スクロールが出ない
- `github-snapshot.json` に Works の13本の README が入っている
人が見るもの: Works の節が Services・Workflow より控えめに見えるか。カードの説明の言い回し。

---

### 保証
- 新たに宣言する保証:
  - Works のどのリポも、Services の提供物のリンク先と重ならない
  - Works のリンクは `github.com/yktsnet` 配下のリポだけを指す
  - Works の説明は日英のどちらも空のまま出ない
- 維持する保証:
  - `src/data/services.test.ts` の3つ（slug の重複なし・リンク先が yktsnet 配下・日英の文言が空でない）
  - `src/styles/type-scale.test.ts`（文字の大きさを `type-*` でしか指定しない）
  - `docs/guarantees.md` の API の保証（本 Issue は触れない）

### 決まった形

- カード：番号・アイコン・リポ名（等幅、`type-small`）、説明（`type-small`、省略しない）、下段にカテゴリと公開年月（`type-label`）
- 説明は3列のカードで3〜4行に収まる長さ（ja 60〜75字）にそろえる
- 並びは新しい順。`works.ts` の配列の順がそのまま表示の順になる
- 節の見出しは「作ったものの一覧」で、他の節と同じ `type-display`
