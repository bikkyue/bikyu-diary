# DiaryPage 仕様書

## 概要

Astro + Cloudflare Pages/Workers を使用した個人日記アプリケーション。
日記コンテンツはGitリポジトリ内のMarkdownファイルで管理し、ビルド時に静的生成する。

## ディレクトリ構成

```
document/
├── README.md                  # このファイル
├── screens/                   # 画面仕様
│   ├── top.md                # トップページ（日記一覧）
│   ├── diary-detail.md       # 日記詳細
│   └── admin-images.md       # 画像管理
└── features/                  # 機能仕様
    └── images.md             # 画像機能
```

## 画面一覧

### 公開ページ

| 画面名 | URL | 説明 |
|--------|-----|------|
| [トップページ](./screens/top.md) | `/` | 日記一覧（新着順） |
| [日記詳細](./screens/diary-detail.md) | `/{slug}` | 日記本文表示（Markdown→HTML） |

### 管理画面（認証必須）

| 画面名 | URL | 説明 |
|--------|-----|------|
| [画像管理](./screens/admin-images.md) | `/admin/images` | 画像アップロード・一覧・削除 |

## 機能一覧

| 機能名 | 説明 | ドキュメント |
|--------|------|-------------|
| 画像管理 | R2を使った画像アップロード・表示 | [画像機能仕様](./features/images.md) |

## API一覧

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/upload` | POST | 画像アップロード（R2） |
| `/api/images` | GET | 画像一覧取得（最新6件） |
| `/api/images/{key}` | DELETE | 画像削除 |

## 技術スタック

- **フレームワーク**: Astro 5.x
- **ホスティング**: Cloudflare Pages
- **ストレージ**: Cloudflare R2（画像保存）
- **認証**: Cloudflare Access（管理画面保護用）
- **コンテンツ管理**: Git管理のMarkdownファイル（`src/content/diaries/*.md`）
- **ビルド方式**: SSG（静的生成） + SSR（API・管理画面）
