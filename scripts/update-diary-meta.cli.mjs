import fs from "fs";
import { buildMeta, walkDir, jstNow } from "./update-diary-meta.mjs";

const jsonPath = "src/content/diaries.json";
const diariesDir = "src/content/diaries";

const rawMeta = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const { meta: oldMeta, migrated } = migrateIfNeeded(rawMeta);
const files = walkDir(diariesDir, diariesDir);
const created_at = jstNow();

const { newMeta, changed } = buildMeta(oldMeta, files, created_at);

if (changed || migrated) {
  fs.writeFileSync(jsonPath, JSON.stringify(newMeta, null, 2) + "\n");
  console.log("Updated diaries.json");
} else {
  console.log("No changes.");
}

/**
 * 旧フォーマット { path: dateString } を新フォーマット { id: { path, created_at } } に変換する
 */
function migrateIfNeeded(meta) {
  const entries = Object.entries(meta);
  if (entries.length === 0) return { meta, migrated: false };
  if (typeof entries[0][1] === "string") {
    // 旧フォーマット: { "path/to/file.md": "date" }
    const converted = {};
    entries.forEach(([filePath, dateStr], i) => {
      converted[String(i + 1)] = { path: filePath, created_at: dateStr };
    });
    return { meta: converted, migrated: true };
  }
  if (entries[0][1].createdAt !== undefined) {
    // createdAt → created_at リネーム
    const converted = {};
    for (const [id, entry] of entries) {
      converted[id] = { path: entry.path, created_at: entry.createdAt };
    }
    return { meta: converted, migrated: true };
  }
  return { meta, migrated: false };
}
