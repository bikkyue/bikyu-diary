import type { D1Database } from '@cloudflare/workers-types';

export interface Diary {
    id: number;
    title: string;
    slug: string;
    content: string;
    status: 'draft' | 'published';
    thumbnail: string | null;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface DiaryWithTags extends Diary {
    tags: string[];
}

// 公開済み日記一覧を取得
export async function getPublishedDiaries(db: D1Database): Promise<DiaryWithTags[]> {
    const diaries = await db
        .prepare(`
      SELECT d.*, GROUP_CONCAT(t.name) as tag_names
      FROM diaries d
      LEFT JOIN diary_tags dt ON d.id = dt.diary_id
      LEFT JOIN tags t ON dt.tag_id = t.id
      WHERE d.status = 'published'
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `)
        .all<Diary & { tag_names: string | null }>();

    return (diaries.results || []).map(d => ({
        ...d,
        tags: d.tag_names ? d.tag_names.split(',') : []
    }));
}

// 全日記一覧を取得（管理用）
export async function getAllDiaries(db: D1Database): Promise<DiaryWithTags[]> {
    const diaries = await db
        .prepare(`
      SELECT d.*, GROUP_CONCAT(t.name) as tag_names
      FROM diaries d
      LEFT JOIN diary_tags dt ON d.id = dt.diary_id
      LEFT JOIN tags t ON dt.tag_id = t.id
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `)
        .all<Diary & { tag_names: string | null }>();

    return (diaries.results || []).map(d => ({
        ...d,
        tags: d.tag_names ? d.tag_names.split(',') : []
    }));
}

// スラッグで日記を取得
export async function getDiaryBySlug(db: D1Database, slug: string): Promise<DiaryWithTags | null> {
    const diary = await db
        .prepare(`
      SELECT d.*, GROUP_CONCAT(t.name) as tag_names
      FROM diaries d
      LEFT JOIN diary_tags dt ON d.id = dt.diary_id
      LEFT JOIN tags t ON dt.tag_id = t.id
      WHERE d.slug = ?
      GROUP BY d.id
    `)
        .bind(slug)
        .first<Diary & { tag_names: string | null }>();

    if (!diary) return null;

    return {
        ...diary,
        tags: diary.tag_names ? diary.tag_names.split(',') : []
    };
}

// IDで日記を取得
export async function getDiaryById(db: D1Database, id: number): Promise<DiaryWithTags | null> {
    const diary = await db
        .prepare(`
      SELECT d.*, GROUP_CONCAT(t.name) as tag_names
      FROM diaries d
      LEFT JOIN diary_tags dt ON d.id = dt.diary_id
      LEFT JOIN tags t ON dt.tag_id = t.id
      WHERE d.id = ?
      GROUP BY d.id
    `)
        .bind(id)
        .first<Diary & { tag_names: string | null }>();

    if (!diary) return null;

    return {
        ...diary,
        tags: diary.tag_names ? diary.tag_names.split(',') : []
    };
}

// 日記を作成
export async function createDiary(
    db: D1Database,
    data: {
        title: string;
        slug: string;
        content: string;
        status: 'draft' | 'published';
        thumbnail?: string;
        tags?: string[];
    }
): Promise<number> {
    const result = await db
        .prepare(`
      INSERT INTO diaries (title, slug, content, status, thumbnail)
      VALUES (?, ?, ?, ?, ?)
    `)
        .bind(data.title, data.slug, data.content, data.status, data.thumbnail || null)
        .run();

    const diaryId = result.meta.last_row_id as number;

    if (data.tags && data.tags.length > 0) {
        await syncTags(db, diaryId, data.tags);
    }

    return diaryId;
}

// 日記を更新
export async function updateDiary(
    db: D1Database,
    id: number,
    data: {
        title: string;
        content: string;
        status: 'draft' | 'published';
        thumbnail?: string;
        tags?: string[];
    }
): Promise<void> {
    await db
        .prepare(`
      UPDATE diaries
      SET title = ?, content = ?, status = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
        .bind(data.title, data.content, data.status, data.thumbnail || null, id)
        .run();

    await syncTags(db, id, data.tags || []);
}

// 日記を削除
export async function deleteDiary(db: D1Database, id: number): Promise<void> {
    await db.prepare('DELETE FROM diaries WHERE id = ?').bind(id).run();
}

// タグを同期
async function syncTags(db: D1Database, diaryId: number, tagNames: string[]): Promise<void> {
    // 既存の関連を削除
    await db.prepare('DELETE FROM diary_tags WHERE diary_id = ?').bind(diaryId).run();

    for (const name of tagNames) {
        const trimmedName = name.trim();
        if (!trimmedName) continue;

        // タグが存在しなければ作成
        await db
            .prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)')
            .bind(trimmedName)
            .run();

        // タグIDを取得
        const tag = await db
            .prepare('SELECT id FROM tags WHERE name = ?')
            .bind(trimmedName)
            .first<Tag>();

        if (tag) {
            // 関連を作成
            await db
                .prepare('INSERT OR IGNORE INTO diary_tags (diary_id, tag_id) VALUES (?, ?)')
                .bind(diaryId, tag.id)
                .run();
        }
    }
}

// 全タグを取得
export async function getAllTags(db: D1Database): Promise<Array<Tag & { count: number }>> {
    const tags = await db
        .prepare(`
      SELECT t.*, COUNT(dt.diary_id) as count
      FROM tags t
      LEFT JOIN diary_tags dt ON t.id = dt.tag_id
      LEFT JOIN diaries d ON dt.diary_id = d.id AND d.status = 'published'
      GROUP BY t.id
      HAVING count > 0
      ORDER BY count DESC
    `)
        .all<Tag & { count: number }>();

    return tags.results || [];
}

// タグ名で日記を取得
export async function getDiariesByTag(db: D1Database, tagName: string): Promise<DiaryWithTags[]> {
    const diaries = await db
        .prepare(`
      SELECT d.*, GROUP_CONCAT(DISTINCT t2.name) as tag_names
      FROM diaries d
      INNER JOIN diary_tags dt ON d.id = dt.diary_id
      INNER JOIN tags t ON dt.tag_id = t.id AND t.name = ?
      LEFT JOIN diary_tags dt2 ON d.id = dt2.diary_id
      LEFT JOIN tags t2 ON dt2.tag_id = t2.id
      WHERE d.status = 'published'
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `)
        .bind(tagName)
        .all<Diary & { tag_names: string | null }>();

    return (diaries.results || []).map(d => ({
        ...d,
        tags: d.tag_names ? d.tag_names.split(',') : []
    }));
}
