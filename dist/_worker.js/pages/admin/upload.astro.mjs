globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_D5xLhYud.mjs';
import { $ as $$Layout } from '../../chunks/Layout_ChuwguAO.mjs';
export { renderers } from '../../renderers.mjs';

const $$Upload = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8", "isAdmin": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>ファイルインポート</h1> <div class="card"> <p class="mb-lg">
マークダウンファイル（.md）をインポートして日記を作成します。
      フロントマター（YAML形式）でタイトルやタグを指定できます。
</p> <pre style="background: var(--color-bg); padding: var(--spacing-md); border-radius: var(--border-radius); font-size: 0.85rem; overflow-x: auto;">---
title: 日記のタイトル
tags: タグ1, タグ2
status: draft または published
---

本文をここに書きます...</pre> </div> <form id="upload-form" class="card mt-lg"> <div class="form-group"> <label for="file">マークダウンファイルを選択</label> <input type="file" id="file" name="file" accept=".md" required> </div> <div class="admin-actions"> <button type="submit" class="btn btn-primary">インポート</button> <a href="/admin" class="btn btn-secondary">キャンセル</a> </div> </form> <div id="result" class="mt-lg" style="display: none;"></div> ` })} ${renderScript($$result, "/Users/kondou/Develop/DiaryPage/src/pages/admin/upload.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/kondou/Develop/DiaryPage/src/pages/admin/upload.astro", void 0);

const $$file = "/Users/kondou/Develop/DiaryPage/src/pages/admin/upload.astro";
const $$url = "/admin/upload";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Upload,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
