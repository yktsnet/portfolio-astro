# PAGES.md — Layer 0: ページ構成

サイト内の全ページを一覧し、タイプと担当ファイルを管理する。
新規ページを追加する際はここに追記し、適切なページタイプを割り当てること。

---

## ページタイプ定義

| タイプ | 用途 |
|---|---|
| `landing` | トップページ。情報密度は低め、スキャン優先 |
| `list` | 一覧ページ。カード・リスト形式でアイテムを並べる |
| `article` | 記事本文。長文読了を目的とする |
| `demo` | 作品紹介・インタラクティブデモ。SSRの場合あり |
| `contact` | お問い合わせ・各種リンク |
| `utility` | タグ一覧など補助的なページ |

---

## ページ一覧

| パス | タイプ | 担当ファイル | 備考 |
|---|---|---|---|
| `/` | `landing` | `src/pages/index.astro` | |
| `/works/` | `list` | `src/pages/works/index.astro` | |
| `/posts/` | `list` | `src/pages/posts/[...page].astro` | ページネーションあり |
| `/posts/[slug]/` | `article` | `src/pages/posts/[slug].astro` | Masthead コンポーネント使用 |
| `/photos/` | `list` | `src/pages/photos/index.astro` | 画像グリッド。2024年追加 |
| `/contact/` | `contact` | `src/pages/contact.astro` | フォーム + SNSリンク |
| `/tags/` | `utility` | `src/pages/tags/index.astro` | |
| `/tags/[tag]/` | `utility` | `src/pages/tags/[tag]/[...page].astro` | |
| `/nfc-attendance/` | `demo` | `src/pages/nfc-attendance/index.astro` | static prerender |
| `/cat-feed-tracker/` | `demo` | `src/pages/cat-feed-tracker/index.astro` | static prerender |
| `/live-demo/` | `demo` | `src/components/status/StatusPage.astro` | SSR・Cloudflare KV連携。複雑な構成 |

---

## ページタイプ別 文字サイズルール

SYSTEM.md の `scale` を参照しつつ、タイプごとの使い方を規定する。

| タイプ | h1 | h2 | body | meta |
|---|---|---|---|---|
| `landing` | `display` | `subhead` | `body` | `small` |
| `list` | `heading` | `subhead` | `body` | `small` |
| `article` | `display` | `heading` | `body-lg` | `small` |
| `demo` | `display` | `heading` | `body` | `small` |
| `contact` | `heading` | `subhead` | `body` | `small` |
| `utility` | `heading` | `subhead` | `body` | `small` |

---

## 今後追加予定のページ

| パス | タイプ | 備考 |
|---|---|---|
| `/works/habitsignal/` | `demo` | HabitSignal 公開時 |
| `/works/lora-irrigation/` | `demo` | 農家向け水やりシステム公開時 |
| (Strava連携) | `list` | Bike ページ。Stravaログ可視化 |
| (Travel) | `list` | 写真と連動した旅行記録 |
