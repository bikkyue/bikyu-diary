# 管理画面トップページ

## 基本情報

| 項目 | 内容 |
|------|------|
| URL | `/admin` |
| ファイル | `src/pages/admin/index.astro` |
| レンダリング | SSR（サーバーサイドレンダリング） |
| 認証 | Cloudflare Accessで保護 |

## 概要

管理者向け機能の一覧を表示するダッシュボードページ。各管理機能へのナビゲーションを提供する。

## アクセス制御

- Cloudflare Accessによる認証が必要
- `runtime.env.BUCKET` が未設定の場合はトップページ（`/`）にリダイレクト

## 画面構成

### ヘッダー

- サイトタイトル「Bikyu-Diary」（トップページへのリンク）

### メインコンテンツ

- ページタイトル「管理画面」（`<h1>`）
- 機能カード一覧（`admin-grid` クラス、グリッドレイアウト）

### 機能カード

| 機能名 | リンク先 | 説明 |
|--------|---------|------|
| 画像管理 | `/admin/images` | 画像のアップロード・一覧・削除 |

#### カードの構成要素

- アイコン（SVG、`admin-card-icon` クラス）
- 機能名（`<h2>`）
- 説明テキスト（`text-secondary` スタイル）
- カード全体（`<a>`）がリンクとしてクリック可能
- ホバー時にボーダーカラーがプライマリカラーに変化

### 戻るボタン

- `← 一覧に戻る`（`/` へ遷移）
- スタイル: `btn btn-secondary`
- ラッパー: `<div class="mt-lg">`

### フッター

- コピーライト「© {年} Bikyu-Diary」

## スタイル

| クラス | 説明 |
|--------|------|
| `.admin-grid` | `repeat(auto-fill, minmax(250px, 1fr))` のグリッドレイアウト |
| `.admin-card` | カード全体のリンク要素。ホバーでボーダーカラー変化 |
| `.admin-card-icon` | SVGアイコンのラッパー。`text-secondary` カラー |

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/pages/admin/index.astro` | 管理画面トップ |
| `src/pages/admin/images.astro` | 画像管理画面 |
| `src/components/Layout.astro` | 共通レイアウト |
