globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_D5xLhYud.mjs';
import { $ as $$Layout } from '../chunks/Layout_ChuwguAO.mjs';
import { a as getAllDiaries } from '../chunks/db_DmU0dmNz.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const runtime = Astro2.locals.runtime;
  const db = runtime?.env?.DB;
  let diaries = [];
  let error = "";
  if (db) {
    try {
      diaries = await getAllDiaries(db);
    } catch (e) {
      error = "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306E\u63A5\u7D9A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
      console.error(e);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u7BA1\u7406\u753B\u9762", "isAdmin": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-header"> <h1>日記管理</h1> <div class="admin-actions"> <a href="/admin/new" class="btn btn-primary">+ 新規作成</a> <a href="/admin/upload" class="btn btn-secondary">ファイルインポート</a> </div> </div> ${error && renderTemplate`<div class="card"> <p class="text-secondary">${error}</p> </div>`}${!error && diaries.length === 0 && renderTemplate`<div class="card"> <p class="text-secondary">まだ日記がありません。</p> </div>`}${diaries.map((diary) => renderTemplate`<div class="card"> <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--spacing-md);"> <div style="flex: 1;"> <h3 class="card-title" style="margin-bottom: var(--spacing-sm);"> <a${addAttribute(`/diary/${diary.id}`, "href")}>${diary.title}</a> </h3> <div class="card-meta"> <span>${new Date(diary.created_at).toLocaleDateString("ja-JP")}</span> <span${addAttribute(`status-badge status-${diary.status}`, "class")}> ${diary.status === "published" ? "\u516C\u958B" : "\u4E0B\u66F8\u304D"} </span> </div> ${diary.tags.length > 0 && renderTemplate`<div class="tags mt-md"> ${diary.tags.map((tag) => renderTemplate`<span class="tag">${tag}</span>`)} </div>`} </div> <div class="admin-actions"> <a${addAttribute(`/admin/edit/${diary.id}`, "href")} class="btn btn-secondary">編集</a> <button class="btn btn-danger delete-btn"${addAttribute(diary.id, "data-id")}${addAttribute(diary.title, "data-title")}>
削除
</button> </div> </div> </div>`)}` })} ${renderScript($$result, "/Users/kondou/Develop/DiaryPage/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/kondou/Develop/DiaryPage/src/pages/admin/index.astro", void 0);

const $$file = "/Users/kondou/Develop/DiaryPage/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
