# トップページ（日記一覧）

## 基本情報

| 項目 | 内容 |
|------|------|
| URL | `/` |
| ファイル | `src/pages/index.astro` |
| レンダリング | 静的生成（`prerender: true`） |
| 認証 | 不要（公開ページ） |

## 概要

日記一覧をディレクトリ別グループ・新着順で表示するトップページ。Git管理された `src/content/diaries/` 配下のMarkdownファイルをビルド時に読み込み、静的HTMLとして生成する。

## 画面構成

### ヘッダー

- サイトタイトル「Bikyu-Diary」（トップページ `/` へのリンク）

### メインコンテンツ

- **ルート直下の日記**（サブディレクトリなし）: `DiaryCard` を新着順に直接表示
- **ディレクトリグループ**（サブディレクトリあり）: `<details>` 要素でグループ化して表示
  - `<summary>`: ディレクトリ名 + 件数（例: `202601 (14)`）
  - 最新グループは `open` 属性で展開済み
  - 各グループ内は `DiaryCard` を新着順に表示

### フッター

- コピーライト「© {年} Bikyu-Diary」

## 表示条件

| 状態 | 表示内容 |
|------|---------|
| 日記が0件 | 「まだ日記がありません。」（`text-secondary` スタイル） |
| 日記が1件以上 | ルート直下の日記 → ディレクトリグループ（新着順）の順に表示 |

## データ取得

- `getDiaryGroups()` 関数でグループ化された日記一覧を取得
  - 内部で `getAllDiaries()` を呼び出し、slug のディレクトリ部分でグループ化
  - ルート直下（ディレクトリなし）は `directory: ''` のグループ
  - 各グループは最新日記の `created_at` 降順でソート
- `src/content/diaries.json` からメタデータ（`created_at`）を結合

## コンポーネント

### DiaryCard

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/DiaryCard.astro` |
| Props | `slug: string`, `title: string`, `created_at: string` |

- `<article class="card">` でラップ
- タイトルを `<h2 class="card-title">` 内リンクとして表示
- 作成日を `formatDate()` で日本語表示

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/pages/index.astro` | トップページ |
| `src/components/DiaryCard.astro` | 日記カードコンポーネント |
| `src/components/Layout.astro` | 共通レイアウト |
| `src/lib/diary.ts` | 日記データ取得・グルーピング関数 |
| `src/lib/markdown.ts` | 日付フォーマット関数 |
