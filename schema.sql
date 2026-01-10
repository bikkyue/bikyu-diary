-- DiaryPage Database Schema

-- 日記テーブル
CREATE TABLE IF NOT EXISTS diaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  thumbnail TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- タグテーブル
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- 日記タグ中間テーブル
CREATE TABLE IF NOT EXISTS diary_tags (
  diary_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (diary_id, tag_id),
  FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_diaries_status ON diaries(status);
CREATE INDEX IF NOT EXISTS idx_diaries_slug ON diaries(slug);
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at DESC);
