## モバイル表示調整
id: 08
branch-slug: mobile-layout
github_issue:
status: close
type: feat
対象: |
  src/pages/index.astro
内容: |
  モバイル（sm: 未満）のみに影響する表示調整。PC 側は変えない。
  1. bio テキスト: 1文目「レガシーをバラして作り直すのが好き。」の後にモバイルのみ改行
  2. メタ情報横並び: GitHub の後にモバイルのみ強制改行（3つ / 3つの2行に）
  3. Works 説明文: line-clamp-2 をモバイルで解除し全文表示
確認: |
  - モバイルで bio が「レガシーをバラして作り直すのが好き。」の後で改行されること
  - モバイルで bio の2行目「IoT・インフラ自動化・NixOS。AIエージェントを...」が改行なしで続くこと
  - モバイルでメタ情報が「Osaka / ykts.net / GitHub」「2025〜 / Post / Contact」の2行になること
  - モバイルで Works 説明文が全文表示されること（... で切れない）
  - PC（sm:以上）では上記変更が一切反映されないこと
  - npm run typecheck が通ること

---

## 設計メモ

### 1. bio 改行（モバイルのみ）

モバイル Hero の bio `<p>` 内で `<br class="sm:hidden" />` を使用。

```astro
<p class="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-poi-muted">
  レガシーをバラして作り直すのが好き。<br class="sm:hidden" />IoT・インフラ自動化・NixOS。AIエージェントを実務に組み込む実験を続けている。
</p>
```

### 2. メタ情報の改行（モバイルのみ）

GitHub の `<a>` の直後に `<span class="w-full sm:hidden" />` を挿入して flex の折り返しを強制する。

```astro
<!-- GitHub リンクの直後 -->
<a href="https://github.com/yktsnet" ...>GitHub</a>
<span class="w-full sm:hidden" />  {/* ← ここで強制改行 */}
<span ...>2025〜</span>
```

### 3. Works 説明文の line-clamp 解除（モバイルのみ）

```diff
- class="... line-clamp-2"
+ class="... line-clamp-none sm:line-clamp-2"
```
