globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_D5xLhYud.mjs';
import { $ as $$Layout } from '../chunks/Layout_ChuwguAO.mjs';
import { e as getAllTags } from '../chunks/db_DmU0dmNz.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Tags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tags;
  const runtime = Astro2.locals.runtime;
  const db = runtime?.env?.DB;
  let tags = [];
  let error = "";
  if (db) {
    try {
      tags = await getAllTags(db);
    } catch (e) {
      error = "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306E\u63A5\u7D9A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
      console.error(e);
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u30BF\u30B0\u4E00\u89A7" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>タグ一覧</h1> ${error && renderTemplate`<div class="card"> <p class="text-secondary">${error}</p> </div>`}${!error && tags.length === 0 && renderTemplate`<div class="card"> <p class="text-secondary">タグがありません。</p> </div>`}${tags.length > 0 && renderTemplate`<div class="card"> <div class="tags" style="gap: var(--spacing-sm);"> ${tags.map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag.name}`, "href")} class="tag" style="font-size: 0.9rem; padding: var(--spacing-sm) var(--spacing-md);"> ${tag.name} (${tag.count})
</a>`)} </div> </div>`}` })}`;
}, "/Users/kondou/Develop/DiaryPage/src/pages/tags.astro", void 0);

const $$file = "/Users/kondou/Develop/DiaryPage/src/pages/tags.astro";
const $$url = "/tags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tags,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
