globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D5xLhYud.mjs';
import { $ as $$Layout } from '../../chunks/Layout_ChuwguAO.mjs';
export { renderers } from '../../renderers.mjs';

const $$New = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u65B0\u898F\u65E5\u8A18\u4F5C\u6210", "isAdmin": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>新規日記作成</h1> <form id="diary-form" class="card"> <div class="form-group"> <label for="title">タイトル</label> <input type="text" id="title" name="title" required> </div> <div class="form-group"> <label for="content">
本文（マークダウン）
<span id="char-count" class="text-secondary" style="font-weight: normal; font-size: 0.85rem; margin-left: var(--spacing-sm);">(0文字)</span> </label> <textarea id="content" name="content" required></textarea> </div> <div class="form-group"> <label for="tags">タグ（カンマ区切り）</label> <input type="text" id="tags" name="tags" placeholder="例: 日常, プログラミング"> </div> <div class="form-group"> <label for="thumbnail">サムネイルURL</label> <input type="text" id="thumbnail" name="thumbnail" placeholder="https://..."> <p class="text-secondary" style="font-size: 0.85rem; margin-top: var(--spacing-xs);">
画像をアップロードする場合は、先に<a href="/admin/upload">アップロードページ</a>でアップロードしてください。
</p> </div> <div class="form-group"> <label for="status">公開状態</label> <select id="status" name="status"> <option value="draft">下書き</option> <option value="published">公開</option> </select> </div> <div class="admin-actions"> <button type="submit" class="btn btn-primary">保存</button> <a href="/admin" class="btn btn-secondary">キャンセル</a> </div> </form> ` })} ${renderScript($$result, "/Users/kondou/Develop/DiaryPage/src/pages/admin/new.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/kondou/Develop/DiaryPage/src/pages/admin/new.astro", void 0);

const $$file = "/Users/kondou/Develop/DiaryPage/src/pages/admin/new.astro";
const $$url = "/admin/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
