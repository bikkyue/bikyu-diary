globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D5xLhYud.mjs';
import { $ as $$Layout } from '../../chunks/Layout_ChuwguAO.mjs';
import { $ as $$DiaryCard } from '../../chunks/DiaryCard_DhUcklNl.mjs';
import { b as getDiariesByTag } from '../../chunks/db_DmU0dmNz.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$name = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$name;
  const { name } = Astro2.params;
  const runtime = Astro2.locals.runtime;
  const db = runtime?.env?.DB;
  if (!name) {
    return Astro2.redirect("/tags");
  }
  const tagName = decodeURIComponent(name);
  let diaries = [];
  let error = "";
  if (db) {
    try {
      diaries = await getDiariesByTag(db, tagName);
    } catch (e) {
      error = "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306E\u63A5\u7D9A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
      console.error(e);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `\u30BF\u30B0: ${tagName}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>タグ: ${tagName}</h1> ${error && renderTemplate`<div class="card"> <p class="text-secondary">${error}</p> </div>`}${!error && diaries.length === 0 && renderTemplate`<div class="card"> <p class="text-secondary">このタグの日記はありません。</p> </div>`}${diaries.map((diary) => renderTemplate`${renderComponent($$result2, "DiaryCard", $$DiaryCard, { "id": diary.id, "title": diary.title, "createdAt": diary.created_at, "tags": diary.tags })}`)}<div class="mt-lg"> <a href="/tags" class="btn btn-secondary">← タグ一覧に戻る</a> </div> ` })}`;
}, "/Users/kondou/Develop/DiaryPage/src/pages/tag/[name].astro", void 0);

const $$file = "/Users/kondou/Develop/DiaryPage/src/pages/tag/[name].astro";
const $$url = "/tag/[name]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$name,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
