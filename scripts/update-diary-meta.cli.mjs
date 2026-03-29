import fs from "fs";
import { buildMeta, walkDir, jstNow } from "./update-diary-meta.mjs";

const jsonPath = "src/content/diaries.json";
const diariesDir = "src/content/diaries";

const oldMeta = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const files = walkDir(diariesDir, diariesDir);
const createdAt = jstNow();

const { newMeta, changed } = buildMeta(oldMeta, files, createdAt);

if (changed) {
  fs.writeFileSync(jsonPath, JSON.stringify(newMeta, null, 2) + "\n");
  console.log("Updated diaries.json");
} else {
  console.log("No changes.");
}
