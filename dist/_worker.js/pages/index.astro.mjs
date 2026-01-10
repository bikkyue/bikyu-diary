globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D5xLhYud.mjs';
import { $ as $$Layout } from '../chunks/Layout_ChuwguAO.mjs';
import { $ as $$DiaryCard } from '../chunks/DiaryCard_DhUcklNl.mjs';
import { f as getPublishedDiaries } from '../chunks/db_DmU0dmNz.mjs';
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
      diaries = await getPublishedDiaries(db);
    } catch (e) {
      error = "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306E\u63A5\u7D9A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
      console.error(e);
    }
  } else {
    error = "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002";
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u30DB\u30FC\u30E0" }, { "default": async ($$result2) => renderTemplate`${error && renderTemplate`${maybeRenderHead()}<div class="card"> <p class="text-secondary">${error}</p> </div>`}${!error && diaries.length === 0 && renderTemplate`<div class="card"> <p class="text-secondary">まだ日記がありません。</p> </div>`}${diaries.map((diary) => renderTemplate`${renderComponent($$result2, "DiaryCard", $$DiaryCard, { "id": diary.id, "title": diary.title, "createdAt": diary.created_at, "tags": diary.tags })}`)}` })}`;
}, "/Users/kondou/Develop/DiaryPage/src/pages/index.astro", void 0);

const $$file = "/Users/kondou/Develop/DiaryPage/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
