import fs from "fs";
import path from "path";

/**
 * 日記メタデータの更新ロジック
 * @param {Object} oldMeta - 既存の diaries.json の内容 { id: { path, created_at } }
 * @param {string[]} files - diariesDir からの相対パス一覧（.md ファイル、NFC 正規化済み）
 * @param {string} created_at - 新規ファイルに付与する JST 日時文字列
 * @returns {{ newMeta: Object, changed: boolean }}
 */
export function buildMeta(oldMeta, files, created_at) {
  // 既存エントリの逆引きマップ構築
  const pathToId = {}; // NFC path → id
  const basenameToEntry = {}; // basename → { id, created_at }（先勝ち）
  const datePrefixToEntry = {}; // YYYYMMDD → { id, created_at }（先勝ち）
  let maxId = 0;

  for (const [id, entry] of Object.entries(oldMeta)) {
    const numId = Number(id);
    if (numId > maxId) maxId = numId;

    const normalizedPath = entry.path.normalize("NFC");
    pathToId[normalizedPath] = id;

    const basename = entry.path.split("/").pop();
    if (!basenameToEntry[basename]) {
      basenameToEntry[basename] = { id, created_at: entry.created_at };
    }

    const dateMatch = basename.match(/^(\d{8})/);
    if (dateMatch && !datePrefixToEntry[dateMatch[1]]) {
      datePrefixToEntry[dateMatch[1]] = { id, created_at: entry.created_at };
    }
  }

  const newMeta = {};
  let changed = false;
  const usedIds = new Set();

  for (const file of files.sort()) {
    const normalizedFile = file.normalize("NFC");

    if (pathToId[normalizedFile] !== undefined) {
      // 優先度1: パス完全一致 → 既存IDと日付を保持
      const id = pathToId[normalizedFile];
      newMeta[id] = { path: file, created_at: oldMeta[id].created_at };
      usedIds.add(id);
    } else {
      const basename = file.split("/").pop();
      const existing = basenameToEntry[basename];
      if (existing && !usedIds.has(existing.id)) {
        // 優先度2: basename 一致（移動検出）→ 既存IDと日付を引き継ぎ
        newMeta[existing.id] = { path: file, created_at: existing.created_at };
        usedIds.add(existing.id);
        changed = true;
      } else {
        // 優先度3: 日付プレフィックス一致（改名検出）→ 既存IDと日付を引き継ぎ
        const dateMatch = basename.match(/^(\d{8})/);
        const byDate = dateMatch && datePrefixToEntry[dateMatch[1]];
        if (byDate && !usedIds.has(byDate.id)) {
          newMeta[byDate.id] = { path: file, created_at: byDate.created_at };
          usedIds.add(byDate.id);
          changed = true;
        } else {
          // 優先度4: 新規 → 次のIDを採番
          maxId += 1;
          const newId = String(maxId);
          newMeta[newId] = { path: file, created_at };
          usedIds.add(newId);
          changed = true;
        }
      }
    }
  }

  // 孤立エントリの検出（削除されたファイル）
  for (const id of Object.keys(oldMeta)) {
    if (!usedIds.has(id)) {
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
 * ディレクトリを再帰的に走査し .md ファイルの相対パスを返す（NFC 正規化済み）
 */
export function walkDir(dir, base) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(full, base));
    } else if (entry.name.endsWith(".md")) {
      results.push(path.relative(base, full).normalize("NFC"));
    }
  }
  return results;
}
