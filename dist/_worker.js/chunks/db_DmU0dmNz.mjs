globalThis.process ??= {}; globalThis.process.env ??= {};
async function getPublishedDiaries(db) {
  const diaries = await db.prepare(`
      SELECT d.*, GROUP_CONCAT(t.name) as tag_names
      FROM diaries d
      LEFT JOIN diary_tags dt ON d.id = dt.diary_id
      LEFT JOIN tags t ON dt.tag_id = t.id
      WHERE d.status = 'published'
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `).all();
  return (diaries.results || []).map((d) => ({
    ...d,
    tags: d.tag_names ? d.tag_names.split(",") : []
  }));
}
async function getAllDiaries(db) {
  const diaries = await db.prepare(`
      SELECT d.*, GROUP_CONCAT(t.name) as tag_names
      FROM diaries d
      LEFT JOIN diary_tags dt ON d.id = dt.diary_id
      LEFT JOIN tags t ON dt.tag_id = t.id
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `).all();
  return (diaries.results || []).map((d) => ({
    ...d,
    tags: d.tag_names ? d.tag_names.split(",") : []
  }));
}
async function getDiaryById(db, id) {
  const diary = await db.prepare(`
      SELECT d.*, GROUP_CONCAT(t.name) as tag_names
      FROM diaries d
      LEFT JOIN diary_tags dt ON d.id = dt.diary_id
      LEFT JOIN tags t ON dt.tag_id = t.id
      WHERE d.id = ?
      GROUP BY d.id
    `).bind(id).first();
  if (!diary) return null;
  return {
    ...diary,
    tags: diary.tag_names ? diary.tag_names.split(",") : []
  };
}
async function createDiary(db, data) {
  const result = await db.prepare(`
      INSERT INTO diaries (title, slug, content, status, thumbnail)
      VALUES (?, ?, ?, ?, ?)
    `).bind(data.title, data.slug, data.content, data.status, data.thumbnail || null).run();
  const diaryId = result.meta.last_row_id;
  if (data.tags && data.tags.length > 0) {
    await syncTags(db, diaryId, data.tags);
  }
  return diaryId;
}
async function updateDiary(db, id, data) {
  await db.prepare(`
      UPDATE diaries
      SET title = ?, content = ?, status = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(data.title, data.content, data.status, data.thumbnail || null, id).run();
  await syncTags(db, id, data.tags || []);
}
async function deleteDiary(db, id) {
  await db.prepare("DELETE FROM diaries WHERE id = ?").bind(id).run();
}
async function syncTags(db, diaryId, tagNames) {
  await db.prepare("DELETE FROM diary_tags WHERE diary_id = ?").bind(diaryId).run();
  for (const name of tagNames) {
    const trimmedName = name.trim();
    if (!trimmedName) continue;
    await db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").bind(trimmedName).run();
    const tag = await db.prepare("SELECT id FROM tags WHERE name = ?").bind(trimmedName).first();
    if (tag) {
      await db.prepare("INSERT OR IGNORE INTO diary_tags (diary_id, tag_id) VALUES (?, ?)").bind(diaryId, tag.id).run();
    }
  }
}
async function getAllTags(db) {
  const tags = await db.prepare(`
      SELECT t.*, COUNT(dt.diary_id) as count
      FROM tags t
      LEFT JOIN diary_tags dt ON t.id = dt.tag_id
      LEFT JOIN diaries d ON dt.diary_id = d.id AND d.status = 'published'
      GROUP BY t.id
      HAVING count > 0
      ORDER BY count DESC
    `).all();
  return tags.results || [];
}
async function getDiariesByTag(db, tagName) {
  const diaries = await db.prepare(`
      SELECT d.*, GROUP_CONCAT(DISTINCT t2.name) as tag_names
      FROM diaries d
      INNER JOIN diary_tags dt ON d.id = dt.diary_id
      INNER JOIN tags t ON dt.tag_id = t.id AND t.name = ?
      LEFT JOIN diary_tags dt2 ON d.id = dt2.diary_id
      LEFT JOIN tags t2 ON dt2.tag_id = t2.id
      WHERE d.status = 'published'
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `).bind(tagName).all();
  return (diaries.results || []).map((d) => ({
    ...d,
    tags: d.tag_names ? d.tag_names.split(",") : []
  }));
}

export { getAllDiaries as a, getDiariesByTag as b, createDiary as c, deleteDiary as d, getAllTags as e, getPublishedDiaries as f, getDiaryById as g, updateDiary as u };
