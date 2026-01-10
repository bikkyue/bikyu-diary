globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_D5xLhYud.mjs';

const $$Astro = createAstro();
const $$DiaryCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DiaryCard;
  const { id, title, createdAt, tags = [], status, showStatus = false } = Astro2.props;
  const formattedDate = new Date(createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return renderTemplate`${maybeRenderHead()}<article class="card"> <h2 class="card-title"> <a${addAttribute(`/diary/${id}`, "href")}>${title}</a> </h2> <div class="card-meta"> <span>${formattedDate}</span> ${showStatus && status && renderTemplate`<span${addAttribute(`status-badge status-${status}`, "class")}> ${status === "published" ? "\u516C\u958B" : "\u4E0B\u66F8\u304D"} </span>`} </div> ${tags.length > 0 && renderTemplate`<div class="tags mt-md"> ${tags.map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag}`, "href")} class="tag">${tag}</a>`)} </div>`} </article>`;
}, "/Users/kondou/Develop/DiaryPage/src/components/DiaryCard.astro", void 0);

export { $$DiaryCard as $ };
