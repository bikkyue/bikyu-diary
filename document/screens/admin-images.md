# 画像アップロード

## 基本情報

| 項目 | 内容 |
|------|------|
| URL | `/admin/images` |
| ファイル | `src/pages/admin/images.astro` |
| 認証 | Cloudflare Accessで保護 |

## 概要

画像のアップロード・一覧表示・URLコピー・削除を行う管理画面。

## 画面要素

### ヘッダー
- 共通ヘッダー（管理画面リンク表示）

### メインコンテンツ

#### アップロードエリア

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| ファイル | file | ○ | 画像ファイル（accept: .jpg,.jpeg,.png,.gif,.webp） |

#### ボタン
- 「アップロード」ボタン

#### アップロード結果（成功時に表示）
- アップロードされた画像のプレビュー
- URLコピーボタン（例: `https://r2diary.bikyu.dev/images/2026021000250001.jpg`）
- マークダウンコピーボタン（例: `![](https://r2diary.bikyu.dev/images/2026021000250001.jpg)`）

#### 画像一覧
- アップロード済み画像をサムネイルで一覧表示
- 各画像に以下の操作ボタン
  - URLコピー
  - マークダウンコピー
  - 削除（確認ダイアログ付き）

### フッター
- 共通フッター

## 操作

### アップロード
1. 画像ファイルを選択
2. 「アップロード」ボタンをクリック
3. `POST /api/upload` を呼び出し（multipart/form-data）
4. 成功時、アップロード結果を表示し画像一覧を更新
5. エラー時、エラーメッセージを表示

### URLコピー
1. 「URLコピー」ボタンをクリック
2. `https://r2diary.bikyu.dev/images/{timestamp}.{拡張子}` 形式でクリップボードにコピー

### マークダウンコピー
1. 「マークダウンコピー」ボタンをクリック
2. `![](https://r2diary.bikyu.dev/images/{timestamp}.{拡張子})` 形式でクリップボードにコピー

### 削除
1. 「削除」ボタンをクリック
2. 確認ダイアログ「この画像を削除しますか？」
3. OKで `DELETE /api/images/{key}` を呼び出し
4. 成功時、画像一覧を更新
5. エラー時、エラーメッセージを表示

## バリデーション

| チェック | エラーメッセージ |
|----------|----------------|
| ファイル未選択 | 「ファイルが選択されていません」 |
| 許可されていない形式 | 「jpg, png, gif, webp のみアップロードできます」 |

### 許可するファイル形式

| 形式 | MIMEタイプ |
|------|-----------|
| JPEG | image/jpeg |
| PNG | image/png |
| GIF | image/gif |
| WebP | image/webp |

## API

### 画像一覧取得

| 項目 | 内容 |
|------|------|
| エンドポイント | `GET /api/images` |
| ファイル | `src/pages/api/images.ts` |

**レスポンス（成功時）:**
```json
{
  "images": [
    {
      "key": "images/1234567890.jpg",
      "url": "https://r2diary.bikyu.dev/images/1234567890.jpg",
      "size": 123456,
      "uploaded": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 画像削除

| 項目 | 内容 |
|------|------|
| エンドポイント | `DELETE /api/images/{key}` |
| ファイル | `src/pages/api/images/[...key].ts` |

**レスポンス（成功時）:**
```json
{
  "success": true
}
```

**レスポンス（エラー時）:**
```json
{
  "error": "エラーメッセージ"
}
```

### 画像アップロード（既存・改修）

| 項目 | 内容 |
|------|------|
| エンドポイント | `POST /api/upload` |
| ファイル | `src/pages/api/upload.ts` |
| 改修内容 | ファイル形式のバリデーション追加 |

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/pages/admin/images.astro` | 画像アップロード画面 |
| `src/pages/api/images.ts` | 画像一覧取得API |
| `src/pages/api/images/[...key].ts` | 画像削除API |
| `src/pages/api/upload.ts` | 画像アップロードAPI |
| `src/pages/admin/index.astro` | 管理画面トップ（「画像アップロード」ボタン） |
