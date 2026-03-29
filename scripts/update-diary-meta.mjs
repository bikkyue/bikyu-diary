import fs from "fs";
import path from "path";

/**
 * 日記メタデータの更新ロジック
 * @param {Object} oldMeta - 既存の diaries.json の内容
 * @param {string[]} files - diariesDir からの相対パス一覧（.md ファイル）
 * @param {string} createdAt - 新規ファイルに付与する JST 日時文字列
 * @returns {{ newMeta: Object, changed: boolean }}
 */
export function buildMeta(oldMeta, files, createdAt) {
  // ファイル名 → 日付のルックアップ（移動対応）
  const filenameToDate = {};
  for (const [key, value] of Object.entries(oldMeta)) {
    const basename = key.split("/").pop();
    if (!filenameToDate[basename]) {
      filenameToDate[basename] = value;
    }
  }

  const newMeta = {};
  let changed = false;

  for (const file of files.sort()) {
    if (oldMeta[file] !== undefined) {
      // 優先度1: 相対パスが一致 → そのまま保持
      newMeta[file] = oldMeta[file];
    } else {
      const basename = file.split("/").pop();
      if (filenameToDate[basename]) {
        // 優先度2: ファイル名一致 → 日付引き継ぎ
        newMeta[file] = filenameToDate[basename];
        changed = true;
      } else {
        // 優先度3: 新規ファイル → 現在時刻
        newMeta[file] = createdAt;
        changed = true;
      }
    }
  }

  // 孤立エントリの検出
  for (const key of Object.keys(oldMeta)) {
    if (newMeta[key] === undefined) {
      changed = true;
    }
  }

  return { newMeta, changed };
}

/**
 * JST の現在時刻を YYYY-MM-DD HH:mm:ss 形式で返す
 */
export function jstNow(date = new Date()) {
  const jstOffset = 9 * 60 * 60 * 1000;
  const jst = new Date(date.getTime() + jstOffset);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    jst.getUTCFullYear() +
    "-" +
    pad(jst.getUTCMonth() + 1) +
    "-" +
    pad(jst.getUTCDate()) +
    " " +
    pad(jst.getUTCHours()) +
    ":" +
    pad(jst.getUTCMinutes()) +
    ":" +
    pad(jst.getUTCSeconds())
  );
}

/**
 * ディレクトリを再帰的に走査し .md ファイルの相対パスを返す
 */
export function walkDir(dir, base) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(full, base));
    } else if (entry.name.endsWith(".md")) {
      results.push(path.relative(base, full));
    }
  }
  return results;
}
