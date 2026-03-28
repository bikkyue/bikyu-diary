# トップページ（日記一覧）

## 基本情報

| 項目 | 内容 |
|------|------|
| URL | `/` |
| ファイル | `src/pages/index.astro` |
| レンダリング | 静的生成（`prerender: true`） |
| 認証 | 不要（公開ページ） |

## 概要

日記一覧を新着順で表示するトップページ。Git管理された `src/content/diaries/*.md` ファイルをビルド時に読み込み、静的HTMLとして生成する。

## 画面構成

### ヘッダー

- サイトタイトル「Diary」（トップページ `/` へのリンク）

### メインコンテンツ

- ページタイトル「日記」（`<h1>`）
- 日記カード一覧（`DiaryCard` コンポーネント）
  - タイトル（日記詳細 `/{slug}` へのリンク）
  - 作成日（日本語フォーマット: 例「2026年3月28日」）

### フッター

- コピーライト「© {年} Diary」

## 表示条件

| 状態 | 表示内容 |
|------|---------|
| 日記が0件 | 「まだ日記がありません。」（`text-secondary` スタイル） |
| 日記が1件以上 | 日記カードを作成日の降順（新着順）に表示 |

## データ取得

- `getAllDiaries()` 関数でコンテンツコレクションから全日記を取得
- `src/content/diaries.json` からメタデータ（`created_at`）を結合
- `created_at` の降順でソート

## コンポーネント

### DiaryCard

| 項目 | 内容 |
|------|------|
| ファイル | `src/components/DiaryCard.astro` |
| Props | `slug: string`, `title: string`, `createdAt: string` |

- `<article class="card">` でラップ
- タイトルを `<h2 class="card-title">` 内リンクとして表示
- 作成日を `formatDate()` で日本語表示

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/pages/index.astro` | トップページ |
| `src/components/DiaryCard.astro` | 日記カードコンポーネント |
| `src/components/Layout.astro` | 共通レイアウト |
| `src/lib/diary.ts` | 日記データ取得関数 |
| `src/lib/markdown.ts` | 日付フォーマット関数 |
