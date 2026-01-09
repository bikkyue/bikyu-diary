# 日記サイト要件整理（Cloudflare Pages + Workers + D1 / Astro）

## 現状の決定事項（確定）
- **目的**: 公開ブログとして日記を公開しつつ、投稿・編集は管理者（自分）のみが行えるようにする
- **技術スタック**
  - フロント: **Astro**
  - ホスティング: **Cloudflare Pages**
  - API: **Cloudflare Workers**
  - DB: **Cloudflare D1**
- **公開範囲**
  - 閲覧: **公開（ログイン不要）**
  - 投稿/編集/削除: **管理者のみ（ログイン必須）**
- **取得方式**
  - SEOは不要
  - 公開ページは静的HTMLを配信し、**本文/一覧はブラウザからWorker APIを叩いて取得して描画**
- **記事URL**
  - **id型**: `/entries/:id`
  - idは **連番（INTEGER AUTOINCREMENT）**
- **並び順**
  - 一覧は **作成日（created_at）降順**
- **即時反映**
  - 下書き→公開は **即時反映でOK**
- **本文形式**
  - **Markdown**
  - APIは Markdown を返し、**フロント側でMarkdownレンダリング**（MVP想定）
- **認証**
  - **パスワード1つ + Cookieセッション**（最小構成）

---

## 画面要件（Astro / Pages）

### 公開（ログイン不要）
- `/`：公開記事一覧（ページング）
- `/entries/:id`：公開記事詳細

### 管理（ログイン必須）
- `/admin/login`：ログイン
- `/admin`：管理トップ（導線のみでもOK）
- `/admin/entries`：記事一覧（draft/published フィルタ）
- `/admin/entries/new`：新規作成（Markdown入力）
- `/admin/entries/:id/edit`：編集

UIメモ（MVP）
- Markdown入力は `textarea` ベースでOK（プレビューは任意）
- 公開/管理ともに、初期表示は「ローディング → API取得 → 描画」

---

## 記事（Entry）要件

### データ項目（MVP）
- `id`：連番
- `title`：必須
- `body_markdown`：必須
- `status`：`draft | published`
- `created_at` / `updated_at`：ISO文字列
- `deleted_at`：論理削除（NULLなら有効）

### 表示ルール
- 公開側: `published` かつ `deleted_at IS NULL` のみ表示
- 管理側: 下書きを含めて表示（削除済みはMVPでは出さない運用でも可）

---

## Markdownレンダリング方針（SEO不要前提）
- **APIは Markdown を返す**
- **フロント側で Markdown→HTML**
- セキュリティ最小要件
  - Markdown内のHTML生埋め込みは無効化、またはサニタイズ
  - 外部リンクの安全対策（任意）

---

## API要件（Cloudflare Workers）

### 公開API（認証なし）
- `GET /api/public/entries?limit=20&cursor=...`
  - 条件: `status='published' AND deleted_at IS NULL`
  - 並び順: `created_at DESC`
  - ページング: cursor（推奨）またはoffset（MVP簡略化可）
- `GET /api/public/entries/:id`
  - published & 未削除のみ返す（下書き/削除済みは404）

### 管理API（認証あり）
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `GET /api/admin/entries?status=&limit=&cursor=...`
- `POST /api/admin/entries`
- `PUT /api/admin/entries/:id`
- `DELETE /api/admin/entries/:id`（論理削除）

レスポンス方針
- JSON統一
- エラー例: `{ "error": { "code": "...", "message": "..." } }`

---

## 認証・セキュリティ要件（MVP）

### セッション（Cookie）
- ログイン成功でセッション作成 → Cookie発行
- Cookie属性
  - `HttpOnly; Secure; SameSite=Lax; Path=/`
- セッション期限: 実装で定数化（例: 7日）

### 最低限の防御
- パスワードは **平文保存しない（ハッシュ化）**
- ログイン試行のレート制限（簡易でOK）
- 管理系 `POST/PUT/DELETE` は `Origin` チェック等でCSRFを軽減

---

## キャッシュ/即時反映
- 即時反映OKのため、公開APIは
  - まずは **キャッシュ無効** でも成立
  - 必要なら短TTL（例: `s-maxage`）を検討

---

## D1 マイグレーション（CREATE TABLE）

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS entries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT    NOT NULL,
  body_markdown TEXT    NOT NULL,
  status        TEXT    NOT NULL CHECK (status IN ('draft', 'published')),
  created_at    TEXT    NOT NULL,
  updated_at    TEXT    NOT NULL,
  deleted_at    TEXT    NULL
);

CREATE INDEX IF NOT EXISTS idx_entries_public_list
  ON entries (status, deleted_at, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_entries_admin_list
  ON entries (deleted_at, created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS admin_settings (
  id            INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
  password_hash TEXT    NOT NULL,
  updated_at    TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
  ON sessions (expires_at);
```

---

## 未決事項（次に決めると実装が止まらないもの）
- 公開一覧のページング方式
  - offsetで簡単に始める / cursor（created_at + id）で堅牢にする
- 管理者パスワード初期化の方式
  - (A) 初回だけAPIでセット
  - (B) ローカルでハッシュ生成して `admin_settings` に投入
