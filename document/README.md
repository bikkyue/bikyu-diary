# DiaryPage 仕様書

## 概要

Astro + Cloudflare Pages/Workers/D1 を使用した個人日記アプリケーション。

## ディレクトリ構成

```
document/
├── README.md                  # このファイル
├── screens/                   # 画面仕様
│   ├── top.md                # トップページ
│   ├── diary-detail.md       # 日記詳細
│   ├── tags.md               # タグ一覧
│   ├── tag-filter.md         # タグ別一覧
│   ├── admin-index.md        # 管理画面トップ
│   ├── admin-new.md          # 新規作成
│   ├── admin-edit.md         # 編集
│   ├── admin-upload.md       # ファイルインポート
│   └── admin-images.md       # 画像アップロード
└── features/                  # 機能仕様
    └── images.md             # 画像機能
```

## 画面一覧

### 公開ページ

| 画面名 | URL | 説明 |
|--------|-----|------|
| [トップページ](./screens/top.md) | `/` | 公開済み日記一覧 |
| [日記詳細](./screens/diary-detail.md) | `/[id]` | 日記本文表示 |
| [タグ一覧](./screens/tags.md) | `/tags` | 全タグ一覧 |
| [タグ別一覧](./screens/tag-filter.md) | `/tag/[name]` | タグで絞り込んだ日記一覧 |

### 管理画面（認証必須）

| 画面名 | URL | 説明 |
|--------|-----|------|
| [管理画面トップ](./screens/admin-index.md) | `/admin/` | 日記管理一覧 |
| [新規作成](./screens/admin-new.md) | `/admin/new` | 日記作成フォーム |
| [編集](./screens/admin-edit.md) | `/admin/edit/[id]` | 日記編集フォーム |
| [ファイルインポート](./screens/admin-upload.md) | `/admin/upload` | .mdファイルインポート |
| [画像アップロード](./screens/admin-images.md) | `/admin/images` | 画像アップロード・管理 |

## 機能一覧

| 機能名 | 説明 | ドキュメント |
|--------|------|-------------|
| 画像管理 | R2を使った画像アップロード・表示 | [画像機能仕様](./features/images.md) |

## API一覧

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/diary` | POST | 日記作成 |
| `/api/diary/[id]` | PUT | 日記更新 |
| `/api/diary/[id]` | DELETE | 日記削除 |
| `/api/import` | POST | .mdファイルインポート |
| `/api/upload` | POST | 画像アップロード（R2） |
| `/api/images` | GET | 画像一覧取得 |
| `/api/images/{key}` | DELETE | 画像削除 |

## 技術スタック

- **フレームワーク**: Astro 5.x
- **ホスティング**: Cloudflare Pages
- **データベース**: Cloudflare D1 (SQLite)
- **ストレージ**: Cloudflare R2（画像保存）
- **認証**: Cloudflare Access（管理画面保護用）
