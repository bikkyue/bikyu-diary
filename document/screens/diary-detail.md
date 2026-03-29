# 日記詳細ページ

## 基本情報

| 項目 | 内容 |
|------|------|
| URL | `/{slug}` |
| ファイル | `src/pages/[slug].astro` |
| レンダリング | 静的生成（`prerender: true` + `getStaticPaths`） |
| 認証 | 不要（公開ページ） |

## 概要

個別の日記を表示するページ。MarkdownをHTMLに変換して描画する。OGPメタタグに対応し、SNSでのシェア時にタイトル等が表示される。

## ルーティング

- `getStaticPaths()` で全日記のslugからルートを生成
- slugは日記ファイル名（拡張子なし）
  - 例: `テスト日記.md` → `/{テスト日記}`
- 存在しないslugは404にリダイレクト

## 画面構成

### ヘッダー

- サイトタイトル「Diary」（トップページへのリンク）

### メインコンテンツ

- 日記ヘッダー（`diary-detail-header` クラス、左ボーダー付き）
  - タイトル（`<h1>`）
  - 作成日（日本語フォーマット: 例「2026年3月28日」）
- 本文（`markdown-content` クラス）
  - Markdownから変換されたHTML
  - GFM（GitHub Flavored Markdown）対応

### フッター

- コピーライト「© {年} Diary」

## OGPメタタグ

日記詳細ページのみ以下のOGPタグを出力する。

| タグ | 値 |
|------|-----|
| `og:title` | 日記タイトル |
| `og:url` | `{サイトURL}/{slug}` |
| `og:type` | `article` |
| `og:site_name` | `Diary` |
| `twitter:card` | `summary` |
| `twitter:title` | 日記タイトル |

## データ取得

- `getDiaryBySlug(slug)` で対象の日記を取得
- `parseMarkdown(diary.body)` でMarkdownをHTMLに変換
- 日記が見つからない場合は `/404` にリダイレクト

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/pages/[slug].astro` | 日記詳細ページ |
| `src/components/Layout.astro` | 共通レイアウト（OGPタグ出力含む） |
| `src/lib/diary.ts` | 日記データ取得関数 |
| `src/lib/markdown.ts` | Markdown変換・日付フォーマット関数 |
