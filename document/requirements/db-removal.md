# D1データベース廃止 & Git駆動への移行

## 背景・動機

現在、日記コンテンツは以下の二重管理になっている：

1. **Git リポジトリ**: .mdファイルをpushして管理（別リポジトリ）
2. **Cloudflare D1**: 管理画面から手動アップロードしてDBに保存

この二重管理を解消し、**git pushだけで日記が公開される**フローにしたい。

## 現状の構成

| 項目 | 現状 |
|------|------|
| フレームワーク | Astro 5.x |
| レンダリング | SSR（`output: 'server'`） |
| アダプター | `@astrojs/cloudflare` |
| データベース | Cloudflare D1（日記・タグ保存） |
| ストレージ | Cloudflare R2（画像保存） |
| 認証 | Cloudflare Access（管理画面保護） |
| デプロイ | Cloudflare Pages（git push → 自動ビルド） |

## 移行後の構成

| 項目 | 移行後 |
|------|--------|
| フレームワーク | Astro 5.x（変更なし） |
| レンダリング | SSGベース（画像API等のみSSR） |
| データベース | **廃止** → .mdファイル + CSVメタデータ |
| ストレージ | Cloudflare R2（変更なし） |
| 認証 | Cloudflare Access（画像管理画面のみ） |
| デプロイ | Cloudflare Pages（変更なし。push → ビルドで日記も自動反映） |

## 決定事項

- [x] D1データベースを完全に廃止する
- [x] 管理画面の日記CRUD機能（作成・編集・削除・インポート）を全て削除する
- [x] 画像アップロード機能（R2）は残す
- [x] ビルド方式はSSG（静的生成）をベースとする
- [x] フロントマター（YAML）を廃止する — .mdファイルは純粋なマークダウンのみ
- [x] タイトルはファイル名から取得する（例: `今日の出来事.md` → 「今日の出来事」）
- [x] タグ機能を廃止する（タグ一覧・タグ別一覧ページも削除）
- [x] 下書き（draft）機能を廃止する（.mdファイルがあれば全て公開）
- [x] サムネイル機能を廃止する（フロントマターに依存していたため）
- [x] URLはファイル名ベースのslug（例: `/今日の出来事`）
- [x] OGPメタタグは維持する（og:imageのみ削除）
- [x] 旧URL（数値ID）は404で良い（リダイレクト不要）
- [x] ヘッダーナビゲーションを削除する（サイトタイトルのみ残す）
- [x] 別リポジトリからの.md移行は手動で行う
- [x] メタデータ（作成日等）はJSONファイルで管理する
- [x] 新規.mdファイルのpush時にJSONへ自動追記する（GitHub Actions）
- [x] JSONを手動編集することで作成日等を後から修正可能にする

## 日記 .md ファイルの仕様

### 配置先

`src/content/diaries/`

### ファイル形式

```markdown
本文をここにそのまま書く。
フロントマターは不要。

## 見出しも自由に使える

![画像](https://r2diary.bikyu.dev/images/xxx.jpg)
```

## メタデータJSONの仕様

### 配置先

`src/content/diaries.json`

### フォーマット

```json
{
  "今日の出来事.md": {
    "created_at": "2026-03-28T15:30:00+09:00"
  },
  "昨日のこと.md": {
    "created_at": "2026-03-27T10:00:00+09:00"
  }
}
```

### プロパティ定義

| プロパティ | 必須 | 説明 |
|-----------|------|------|
| キー | ○ | .mdファイル名（`src/content/diaries/` 内のファイル名と一致） |
| created_at | ○ | 作成日時（ISO 8601形式） |

### メタデータ取得ルール

| メタデータ | 取得元 | 例 |
|-----------|--------|-----|
| タイトル | ファイル名（.md除去） | `今日の出来事.md` → 「今日の出来事」 |
| 作成日 | JSONの `created_at` | `2026-03-28T15:30:00+09:00` |
| URL slug | ファイル名（.md除去） | `/今日の出来事` |

### JSON自動追記の仕組み（GitHub Actions）

1. mainブランチへのpush時に `src/content/diaries/` 内の変更を検知
2. 新規追加された.mdファイルを特定
3. JSONに存在しないファイルがあれば、push日時でエントリを追記
4. 追記したJSONを自動コミット＆push

### JSON手動編集

- `created_at` を後から修正可能（例: 別リポジトリからの移行時に元の作成日を設定）
- 将来メタデータを追加する場合もプロパティを増やすだけで対応可能
- JSONを編集してpushすれば、次回ビルドで反映される

## 削除する機能・ファイル

### 削除対象ページ（6ファイル）
- `src/pages/admin/index.astro` — 管理画面トップ
- `src/pages/admin/new.astro` — 新規作成
- `src/pages/admin/edit/[id].astro` — 編集
- `src/pages/admin/upload.astro` — .mdインポート
- `src/pages/tags.astro` — タグ一覧
- `src/pages/tag/[name].astro` — タグ別一覧

### 削除対象API（3ファイル）
- `src/pages/api/diary/index.ts` — 日記作成
- `src/pages/api/diary/[id].ts` — 日記更新・削除
- `src/pages/api/import.ts` — .mdインポート

### 削除対象ライブラリ・設定
- `src/lib/db.ts` — DB操作関数
- `schema.sql` — DBスキーマ
- `wrangler.toml` の `[[d1_databases]]` セクション
- `package.json` の `db:migrate` スクリプト

## 残す機能・ファイル

### 画像関連（変更なし）
- `src/pages/admin/images.astro` — 画像管理画面
- `src/pages/api/upload.ts` — 画像アップロードAPI
- `src/pages/api/images.ts` — 画像一覧API
- `src/pages/api/images/[...key].ts` — 画像削除API
- `src/pages/images/[...path].ts` — 画像配信
