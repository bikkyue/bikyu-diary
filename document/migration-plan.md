# 移行計画: 作り直し（リビルド）

## 方針

既存コードの改修ではなく、Astroプロジェクトを新規作成し、画像関連コードのみ既存から移植する。

要件は `document/requirements/db-removal.md` を参照。

## 成果物のファイル構成

```
src/
├── content/
│   ├── diaries/          # .mdファイル（ユーザーが手動配置）
│   │   └── (例) 今日の出来事.md
│   └── diaries.json      # メタデータ（created_at）
├── content.config.ts      # Content Collections 定義
├── components/
│   ├── Layout.astro       # 新規作成（タイトルのみ、ナビなし）
│   └── DiaryCard.astro    # 新規作成（slug・日付のみ）
├── pages/
│   ├── index.astro        # トップ（日記一覧、SSG）
│   ├── [slug].astro       # 日記詳細（SSG）
│   ├── admin/
│   │   └── images.astro   # 既存から移植
│   ├── api/
│   │   ├── upload.ts      # 既存から移植
│   │   ├── images.ts      # 既存から移植
│   │   └── images/
│   │       └── [...key].ts # 既存から移植
│   └── images/
│       └── [...path].ts   # 既存から移植
├── lib/
│   ├── diary.ts           # 新規作成（Content Collections + JSONメタデータ読み込み）
│   └── markdown.ts        # 既存から parseMarkdown, formatDate のみ移植
└── styles/
    └── global.css         # 既存から移植（不要なスタイルを整理）

.github/
└── workflows/
    └── update-diary-meta.yml  # 新規作成（JSON自動追記）

astro.config.mjs           # 新規作成
wrangler.toml              # 新規作成（R2のみ）
package.json               # 新規作成
tsconfig.json              # 新規作成
```

## Phase 1: プロジェクト初期化

| # | 作業 | 詳細 |
|---|------|------|
| 1 | Astroプロジェクト作成 | `npm create astro@latest` で空プロジェクトを作成 |
| 2 | Cloudflareアダプター導入 | `@astrojs/cloudflare` を追加 |
| 3 | astro.config.mjs 設定 | `output: 'server'`、Cloudflareアダプター設定 |
| 4 | wrangler.toml 作成 | R2バケット設定のみ（D1なし） |
| 5 | marked 追加 | マークダウンパーサー |

## Phase 2: Content Collections + メタデータ

| # | 作業 | 詳細 |
|---|------|------|
| 1 | `src/content.config.ts` 作成 | globローダーで `src/content/diaries/*.md` を読み込み |
| 2 | `src/content/diaries/` 作成 | 空ディレクトリ（テスト用.mdを1つ配置） |
| 3 | `src/content/diaries.json` 作成 | テスト用エントリ |
| 4 | `src/lib/diary.ts` 作成 | JSONメタデータ読み込み、日記一覧取得、タイトル取得関数 |
| 5 | `src/lib/markdown.ts` 作成 | `parseMarkdown`, `formatDate` を既存から移植 |

## Phase 3: 公開ページ

| # | 作業 | 詳細 |
|---|------|------|
| 1 | `src/components/Layout.astro` 作成 | サイトタイトルのみ、ナビなし、OGP対応（og:imageなし） |
| 2 | `src/components/DiaryCard.astro` 作成 | slug・タイトル・日付のみ表示 |
| 3 | `src/pages/index.astro` 作成 | `prerender = true`、日記一覧（created_at降順） |
| 4 | `src/pages/[slug].astro` 作成 | `prerender = true`、`getStaticPaths`、マークダウン表示、OGP |
| 5 | `src/styles/global.css` 移植 | 既存CSSからタグ・ステータス等の不要スタイルを除いて移植 |

## Phase 4: 画像機能の移植

| # | 作業 | 詳細 |
|---|------|------|
| 1 | `src/pages/api/upload.ts` | 既存からそのままコピー |
| 2 | `src/pages/api/images.ts` | 既存からそのままコピー |
| 3 | `src/pages/api/images/[...key].ts` | 既存からそのままコピー |
| 4 | `src/pages/images/[...path].ts` | 既存からそのままコピー |
| 5 | `src/pages/admin/images.astro` | 既存からコピーし、Layout呼び出しを新Layoutに合わせて調整 |

## Phase 5: GitHub Actions

| # | 作業 | 詳細 |
|---|------|------|
| 1 | `.github/workflows/update-diary-meta.yml` 作成 | mainへのpush時にdiaries.jsonへ自動追記 |

処理フロー:
1. `src/content/diaries/` 内の全.mdファイルを取得
2. `src/content/diaries.json` と比較
3. JSONに存在しない.mdがあれば、push日時（ISO 8601、JST）で追記
4. 変更があれば自動コミット＆push

## Phase 6: 検証

| # | 検証項目 | 確認方法 |
|---|---------|---------|
| 1 | ビルド成功 | `npm run build` |
| 2 | トップページ表示 | `npm run dev` → `/` |
| 3 | 日記詳細ページ表示 | トップからリンククリック |
| 4 | マークダウン変換 | 見出し・リスト・画像・コードブロック等 |
| 5 | OGPメタタグ | 詳細ページのHTMLソース確認 |
| 6 | 画像管理画面 | `/admin/images` |
| 7 | 画像アップロードAPI | ファイルをアップロードして確認 |
| 8 | 存在しないURL | 404が返ること |

## Phase 7: 切り替え

| # | 作業 | 詳細 |
|---|------|------|
| 1 | 既存コード削除 | 旧ページ・API・DB関連を全て削除 |
| 2 | 新コードをルートに配置 | — |
| 3 | .mdファイル移行 | ユーザーが別リポジトリから手動コピー |
| 4 | diaries.json に日付を設定 | ユーザーが手動で元の作成日を入力 |
| 5 | Cloudflare D1を無効化 | Cloudflareダッシュボードで対応 |
| 6 | mainへpush | Cloudflare Pagesが自動ビルド＆デプロイ |
