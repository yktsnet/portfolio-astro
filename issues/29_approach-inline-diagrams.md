## Approach 01・03 にインライン図を追加
id: 29
branch-slug: approach-inline-diagrams
github_issue:
status: open
type: feat
対象: |
  src/components/Approach.astro
内容: |
  現在 Approach 02（放任より制御）だけに「設計→実装→検証」の3カードフロー図がある。
  01（機能より定着）と 03（多機能より安定性）にも同レベルのインライン図を追加して視覚的に揃える。
確認: |
  npm run typecheck が通ること
  3つの原則すべてに図が表示されること（目視は user が実施）

---

## 設計

### 現状（02 のみ図あり）

02 の図は `roles` 配列を `i === 1` で条件描画している。
3カード + arrow-right アイコンの横並びフロー。

### 追加する図

#### 01: 機能より定着（3カード）

既存の運用 → 裏に自動化を差し込む → 現場の手順は変わらない

```ts
type FlowStep = { title: string; sub: string; accent?: boolean };

const flow01: FlowStep[] = [
  { title: '既存の運用', sub: 'Excel・紙・日常業務' },
  { title: '裏に差し込む', sub: '自動化は見えない層' },
  { title: '手順は変わらない', sub: '現場がそのまま定着', accent: true },
];
```

#### 03: 多機能より安定性（2カード対比）

多機能な構成を削り、最小構成に作り直した判断を視覚化する。

```ts
const flow03: FlowStep[] = [
  { title: 'React UI 版', sub: '多機能・状態が複雑' },
  { title: 'JSONL + systemd', sub: '最小構成・止まらない', accent: true },
];
```

### 実装方針

- `roles` を `flow02` にリネームし、`flow01` `flow03` を追加
- `FlowStep` 型を共通で使う（既存の `Role` 型と同じ構造）
- `i === 1` の条件分岐を外し、各 principle にフロー配列を持たせる
  - `Principle` 型に `flow?: FlowStep[]` を追加
  - `principles` 配列の各要素に flow を埋め込む
- 描画ロジックは既存の3カード+矢印をそのまま使い回す（`p.flow` があれば表示）
- 2カードと3カードが混在するが、`flex-1` なのでレイアウトは自然に調整される
