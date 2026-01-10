globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, n as Fragment, h as addAttribute } from '../../../chunks/astro/server_D5xLhYud.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_ChuwguAO.mjs';
import { g as getDiaryById } from '../../../chunks/db_DmU0dmNz.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const runtime = Astro2.locals.runtime;
  const db = runtime?.env?.DB;
  if (!id) {
    return Astro2.redirect("/admin");
  }
  let diary = null;
  let error = "";
  if (db) {
    try {
      diary = await getDiaryById(db, parseInt(id));
    } catch (e) {
      error = "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306E\u63A5\u7D9A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
      console.error(e);
    }
  }
  if (!diary && !error) {
    return Astro2.redirect("/admin");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": diary ? `\u7DE8\u96C6: ${diary.title}` : "\u30A8\u30E9\u30FC", "isAdmin": true }, { "default": async ($$result2) => renderTemplate`${error && renderTemplate`${maybeRenderHead()}<div class="card"> <p class="text-secondary">${error}</p> </div>`}${diary && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <h1>日記を編集</h1> <form id="diary-form" class="card"${addAttribute(diary.id, "data-id")}> <div class="form-group"> <label for="title">タイトル</label> <input type="text" id="title" name="title"${addAttribute(diary.title, "value")} required> </div> <div class="form-group"> <label for="content">
本文（マークダウン）
<span id="char-count" class="text-secondary" style="font-weight: normal; font-size: 0.85rem; margin-left: var(--spacing-sm);"></span> </label> <textarea id="content" name="content" required>${diary.content}</textarea> </div> <div class="form-group"> <label for="tags">タグ（カンマ区切り）</label> <input type="text" id="tags" name="tags"${addAttribute(diary.tags.join(", "), "value")}> </div> <div class="form-group"> <label for="thumbnail">サムネイルURL</label> <input type="text" id="thumbnail" name="thumbnail"${addAttribute(diary.thumbnail || "", "value")}> </div> <div class="form-group"> <label for="status">公開状態</label> <select id="status" name="status"> <option value="draft"${addAttribute(diary.status === "draft", "selected")}>下書き</option> <option value="published"${addAttribute(diary.status === "published", "selected")}>公開</option> </select> </div> <div class="admin-actions"> <button type="submit" class="btn btn-primary">更新</button> <a href="/admin" class="btn btn-secondary">キャンセル</a> </div> </form> ` })}`}` })} ${renderScript($$result, "/Users/kondou/Develop/DiaryPage/src/pages/admin/edit/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/kondou/Develop/DiaryPage/src/pages/admin/edit/[id].astro", void 0);

const $$file = "/Users/kondou/Develop/DiaryPage/src/pages/admin/edit/[id].astro";
const $$url = "/admin/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
