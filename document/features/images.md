# 画像機能仕様

## 概要

DiaryPageでは、Cloudflare R2を使用した画像の保存と表示機能を提供しています。

## 画像の種類

### 1. サムネイル画像
日記のサムネイル画像として表示される画像。

**設定方法:**
- 新規作成・編集フォームの「サムネイルURL」フィールドに画像URLを入力
- mdファイルインポート時のフロントマター `thumbnail` フィールド

**表示場所:**
- 日記詳細ページ（`/diary/[id]`）のヘッダー下部

### 2. 本文内画像
マークダウン形式で本文内に埋め込まれる画像。

**記述方法:**
```markdown
![代替テキスト](画像URL)
```

**表示場所:**
- 日記詳細ページの本文内

## 画像アップロード機能

### API仕様

**エンドポイント:** `POST /api/upload`

**リクエスト:**
- Content-Type: `multipart/form-data`
- Body: `file` フィールドに画像ファイル
- 対応フォーマット: jpg, png, gif, webp

**レスポンス（成功時）:**
```json
{
  "url": "https://diary.r2.bikyu.dev/images/1234567890.jpg",
  "key": "images/1234567890.jpg"
}
```

**レスポンス（エラー時）:**
```json
{
  "error": "エラーメッセージ"
}
```

### 画像一覧API

**エンドポイント:** `GET /api/images`

**レスポンス:**
```json
{
  "images": [
    {
      "key": "images/1234567890.jpg",
      "url": "https://diary.r2.bikyu.dev/images/1234567890.jpg",
      "size": 123456,
      "uploaded": "2026-02-10T00:00:00.000Z"
    }
  ]
}
```
- 最新6件のみを返却

### 画像削除API

**エンドポイント:** `DELETE /api/images/{filename}`

**レスポンス（成功時）:**
```json
{
  "success": true
}
```

## R2バケット設定

**設定ファイル:** `wrangler.toml`

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "diary-images"
```

**バインディング名:** `BUCKET`
**バケット名:** `diary-images`
**パブリックドメイン:** `diary.r2.bikyu.dev`

## 画像URL形式

### ファイル名規則
- 形式: `yyyymmddHHMMSS` + 2桁連番（日本時間）
- 例: `2026021000250001.jpg`（2026年2月10日 0:25、1枚目）

### アップロード後のURL（絶対URL）
- 形式: `https://diary.r2.bikyu.dev/images/yyyymmddHHMMSS01.{拡張子}`
- 例: `https://diary.r2.bikyu.dev/images/2026021000250001.jpg`

### R2ダッシュボード
- URL: https://dash.cloudflare.com/ae23774604a12acf7034ad257713ca76/r2/default/buckets/diary-images

## 現在の実装状況

### ✅ 実装済み
- [x] R2バケットの設定
- [x] 画像アップロードAPI（`POST /api/upload`）
- [x] 画像一覧API（`GET /api/images`）最新6件
- [x] 画像削除API（`DELETE /api/images/{filename}`）
- [x] サムネイル画像の表示（日記詳細ページ）
- [x] マークダウン内画像の表示
- [x] フロントマターでのサムネイル設定（mdインポート時）
- [x] 新規作成・編集フォームでのサムネイルURL入力
- [x] 管理画面での画像アップロードUI（`/admin/images`）
- [x] ドラッグ&ドロップでの画像アップロード
- [x] 複数ファイル一括アップロード
- [x] 画像URLのコピー（URL、マークダウン形式）
- [x] 画像削除機能
- [x] R2パブリックドメインでの絶対URL生成

### ❌ 未実装
- [ ] 画像のリサイズ・最適化
- [ ] マークダウンエディタへの画像挿入UI

## 関連ファイル

### API
- `src/pages/api/upload.ts` - 画像アップロードAPI
- `src/pages/api/images.ts` - 画像一覧API
- `src/pages/api/images/[...key].ts` - 画像削除API
- `src/pages/images/[...path].ts` - 画像配信（開発環境用）

### 画面
- `src/pages/admin/images.astro` - 画像管理画面
- `src/pages/admin/new.astro` - 新規作成（サムネイルURL入力）
- `src/pages/admin/edit/[id].astro` - 編集（サムネイルURL入力）
- `src/pages/admin/upload.astro` - mdファイルインポート
- `src/pages/[id].astro` - 日記詳細（画像表示）

### 設定
- `wrangler.toml` - R2バケット設定

### ドキュメント
- `document/screens/admin-images.md` - 画像管理画面仕様
- `document/screens/admin-new.md` - 新規作成画面仕様
- `document/screens/admin-edit.md` - 編集画面仕様
- `document/screens/admin-upload.md` - インポート画面仕様
- `document/screens/diary-detail.md` - 詳細画面仕様
