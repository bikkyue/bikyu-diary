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

**レスポンス（成功時）:**
```json
{
  "url": "/images/1234567890.jpg",
  "key": "images/1234567890.jpg"
}
```

**レスポンス（エラー時）:**
```json
{
  "error": "エラーメッセージ"
}
```

### 実装詳細

**ファイル:** `src/pages/api/upload.ts`

**処理フロー:**
1. リクエストから画像ファイルを取得
2. タイムスタンプを使ってユニークなファイル名を生成（`images/{timestamp}.{拡張子}`）
3. Cloudflare R2バケット（`BUCKET`）にアップロード
4. 公開URLを生成して返却（`/{key}` 形式）

**エラーハンドリング:**
- ファイル未選択: 400エラー
- R2バケット未設定: 500エラー
- アップロード失敗: 500エラー

## R2バケット設定

**設定ファイル:** `wrangler.toml`

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "diary-images"
```

**バインディング名:** `BUCKET`
**バケット名:** `diary-images`

## 画像URL形式

### アップロード後のURL
- 形式: `/images/{timestamp}.{拡張子}`
- 例: `/images/1234567890.jpg`

### 外部画像URL
- 任意のHTTPS URLを指定可能
- 例: `https://example.com/image.jpg`

## 現在の実装状況

### ✅ 実装済み
- [x] R2バケットの設定
- [x] 画像アップロードAPI（`POST /api/upload`）
- [x] サムネイル画像の表示（日記詳細ページ）
- [x] マークダウン内画像の表示
- [x] フロントマターでのサムネイル設定（mdインポート時）
- [x] 新規作成・編集フォームでのサムネイルURL入力

### ❌ 未実装
- [ ] 管理画面での画像アップロードUI
- [ ] 画像一覧・管理機能
- [ ] 画像のリサイズ・最適化
- [ ] 画像削除機能
- [ ] ドラッグ&ドロップでの画像アップロード
- [ ] マークダウンエディタへの画像挿入UI

## 今後の改善案

### 1. 画像アップロードUI
新規作成・編集画面に画像アップロード機能を追加
- ファイル選択ボタン
- アップロード後、自動的にサムネイルURLフィールドに入力
- プレビュー表示

### 2. 画像管理機能
- 専用の画像管理ページ（`/admin/images`）
- アップロード済み画像の一覧表示
- 画像の削除機能
- 画像URLのコピー機能

### 3. マークダウンエディタ統合
- エディタ内での画像アップロード
- アップロード後、自動的にマークダウン記法を挿入
- 画像のドラッグ&ドロップ対応

### 4. 画像最適化
- アップロード時の自動リサイズ
- WebP形式への変換
- サムネイル用の複数サイズ生成

## 関連ファイル

### API
- `src/pages/api/upload.ts` - 画像アップロードAPI

### 画面
- `src/pages/admin/new.astro` - 新規作成（サムネイルURL入力）
- `src/pages/admin/edit/[id].astro` - 編集（サムネイルURL入力）
- `src/pages/admin/upload.astro` - mdファイルインポート
- `src/pages/[id].astro` - 日記詳細（画像表示）

### 設定
- `wrangler.toml` - R2バケット設定

### ドキュメント
- `document/screens/admin-new.md` - 新規作成画面仕様
- `document/screens/admin-edit.md` - 編集画面仕様
- `document/screens/admin-upload.md` - インポート画面仕様
- `document/screens/diary-detail.md` - 詳細画面仕様
