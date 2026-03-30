# 日記メタデータ管理

## 概要

`src/content/diaries/` 配下の `.md` ファイルに対応するメタデータ（作成日時）を `src/content/diaries.json` で管理する。

## diaries.json の形式

```json
{
  "1": {
    "path": "202601/20260110-日記を書く。.md",
    "created_at": "2026-01-10 18:40:30"
  },
  "2": {
    "path": "202601/20260111.md",
    "created_at": "2026-01-11 00:00:00"
  }
}
```

- キー: 数値ID（文字列形式、連番）
- 値: オブジェクト
  - `path`: `src/content/diaries/` からの相対パス（`.md` 拡張子込み）
  - `created_at`: 日本時間の日時（`YYYY-MM-DD HH:mm:ss` 形式）

## Content Collections との連携

`src/content.config.ts` で `generateId` をカスタマイズし、`path` を使ってMarkdownファイルとIDを紐付ける。

```
src/content/diaries/202601/20260110-日記を書く。.md
  → diaries.json の path "202601/20260110-日記を書く。.md" と突合
  → ID "1" として登録
```

- NFC正規化により日本語ファイル名の表記揺れに対応
- `diaries.json` 未登録のファイルは `path` そのものをIDとして使用（開発環境等）

## slug の決定

`src/lib/diary.ts` でslugを次のように決定する。

- `path` から `.md` を除いた文字列をslugとする
- 例: `path = "202601/20260110-日記を書く。.md"` → `slug = "202601/20260110-日記を書く。"`
- タイトルはslugのうちディレクトリ部分を除いたファイル名部分を使用

## diaries.json の更新方法

### 手動更新

`diaries.json` を直接編集する。新規ファイルを追加する場合は、次の連番IDでエントリを追加する。

```json
{
  "42": {
    "path": "202603/20260329-新しい日記.md",
    "created_at": "2026-03-29 20:00:00"
  }
}
```

### 注意事項

- **IDの一意性**: 同じIDが複数エントリに存在すると後勝ちで上書きされる
- **作成日の保持**: 既存エントリの `created_at` は手動で変更しない限り保持される
- **ファイル移動時**: `path` を新しいパスに更新する（IDとcreated_atは維持）
- **ファイル削除時**: 対応するエントリを削除することを推奨（残留しても動作上の問題はない）

## 関連ファイル

| ファイル | 説明 |
|---------|------|
| `src/content/diaries.json` | 日記メタデータ本体 |
| `src/content.config.ts` | Content Collections設定（generateId定義） |
| `src/lib/diary.ts` | diaries.jsonを読み込みDiaryオブジェクトを生成 |
