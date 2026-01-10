globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML, h as addAttribute } from '../../chunks/astro/server_D5xLhYud.mjs';
import { $ as $$Layout } from '../../chunks/Layout_ChuwguAO.mjs';
import { g as getDiaryById } from '../../chunks/db_DmU0dmNz.mjs';
import { a as parseMarkdown, f as formatDate } from '../../chunks/markdown_1o_YKxWM.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const runtime = Astro2.locals.runtime;
  const db = runtime?.env?.DB;
  if (!id) {
    return Astro2.redirect("/");
  }
  let diary = null;
  let error = "";
  if (db) {
    try {
      diary = await getDiaryById(db, parseInt(id));
      if (diary && diary.status !== "published") {
        diary = null;
      }
    } catch (e) {
      error = "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306E\u63A5\u7D9A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
      console.error(e);
    }
  }
  if (!diary && !error) {
    return Astro2.redirect("/");
  }
  const htmlContent = diary ? parseMarkdown(diary.content) : "";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": diary?.title || "\u30A8\u30E9\u30FC" }, { "default": async ($$result2) => renderTemplate`${error && renderTemplate`${maybeRenderHead()}<div class="card"> <p class="text-secondary">${error}</p> </div>`}${diary && renderTemplate`<article> <header class="mb-lg"> <h1>${diary.title}</h1> <div class="card-meta"> <span>${formatDate(diary.created_at)}</span> </div> ${diary.tags.length > 0 && renderTemplate`<div class="tags mt-md"> ${diary.tags.map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag}`, "href")} class="tag">${tag}</a>`)} </div>`} </header> ${diary.thumbnail && renderTemplate`<img${addAttribute(diary.thumbnail, "src")}${addAttribute(diary.title, "alt")} style="width: 100%; border-radius: var(--border-radius); margin-bottom: var(--spacing-xl);">`} <div class="markdown-content">${unescapeHTML(htmlContent)}</div> <div class="mt-lg"> <a href="/" class="btn btn-secondary">← 一覧に戻る</a> </div> </article>`}` })}`;
}, "/Users/kondou/Develop/DiaryPage/src/pages/diary/[id].astro", void 0);

const $$file = "/Users/kondou/Develop/DiaryPage/src/pages/diary/[id].astro";
const $$url = "/diary/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
