globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, o as renderHead, p as renderSlot, r as renderTemplate } from './astro/server_D5xLhYud.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, isAdmin = false } = Astro2.props;
  return renderTemplate`<html lang="ja"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} | Diary</title><link rel="stylesheet" href="/styles/global.css">${renderHead()}</head> <body> <header> <div class="container"> <a href="/" class="site-title">Diary</a> <nav> <a href="/">日記一覧</a> <a href="/tags">タグ</a> ${isAdmin && renderTemplate`<a href="/admin">管理画面</a>`} </nav> </div> </header> <main> <div class="container"> ${renderSlot($$result, $$slots["default"])} </div> </main> <footer> <div class="container"> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Diary</p> </div> </footer> </body></html>`;
}, "/Users/kondou/Develop/DiaryPage/src/components/Layout.astro", void 0);

export { $$Layout as $ };
