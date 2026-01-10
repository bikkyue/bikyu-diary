# DiaryPage 画面仕様書

## 概要

Astro + Cloudflare Pages/Workers/D1 を使用した個人日記アプリケーション。

## 画面一覧

| 画面名 | URL | 説明 |
|--------|-----|------|
| [トップページ](./screens/top.md) | `/` | 公開済み日記一覧 |
| [日記詳細](./screens/diary-detail.md) | `/diary/[id]` | 日記本文表示 |
| [タグ一覧](./screens/tags.md) | `/tags` | 全タグ一覧 |
| [タグ別一覧](./screens/tag-filter.md) | `/tag/[name]` | タグで絞り込んだ日記一覧 |
| [管理画面トップ](./screens/admin-index.md) | `/admin/` | 日記管理一覧 |
| [新規作成](./screens/admin-new.md) | `/admin/new` | 日記作成フォーム |
| [編集](./screens/admin-edit.md) | `/admin/edit/[id]` | 日記編集フォーム |
| [ファイルインポート](./screens/admin-upload.md) | `/admin/upload` | .mdファイルインポート |

## API一覧

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/diary` | POST | 日記作成 |
| `/api/diary/[id]` | PUT | 日記更新 |
| `/api/diary/[id]` | DELETE | 日記削除 |
| `/api/import` | POST | .mdファイルインポート |
| `/api/upload` | POST | 画像アップロード（R2） |

## 技術スタック

- **フレームワーク**: Astro 5.x
- **ホスティング**: Cloudflare Pages
- **データベース**: Cloudflare D1 (SQLite)
- **ストレージ**: Cloudflare R2
- **認証**: Cloudflare Access（管理画面保護用）
