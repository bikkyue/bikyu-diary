# Bikyu-Diary

日記を書く為に作成をしたwebページ

## 実際のサイト

[https://diary.bikyu.dev/](https://diary.bikyu.dev/)

## 使い方(備忘メモ)

### 日記を投稿

 - git cloneする
 - diary/ に.mdファイルの日記を書く
    ※src/content/diariesのシンボリックリンク
 - 下記コマンドでスクリプトを実行

    ```
    npm run publish-diary
    ```

     - Nodejsが必要

### 画像アップロード

 - /admin/imagesを開く→画面に従ってアップロード
 - 画像はR2に保存される

## メモ

### 超簡単な仕組み

 - publish-diaryの簡単な仕組み
     - src/content/diaries.json を更新
     - gitの差分を確認
     - git push

 - ビルド時にjsonからアップロード日時を紐付けする
