globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createDiary } from '../../chunks/db_DmU0dmNz.mjs';
import { g as generateSlug } from '../../chunks/markdown_1o_YKxWM.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const runtime = locals.runtime;
  const db = runtime?.env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const data = await request.json();
    if (!data.title || !data.content) {
      return new Response(JSON.stringify({ error: "タイトルと本文は必須です" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const slug = data.slug || generateSlug(data.title);
    const id = await createDiary(db, {
      title: data.title,
      slug,
      content: data.content,
      status: data.status || "draft",
      thumbnail: data.thumbnail,
      tags: data.tags || []
    });
    return new Response(JSON.stringify({ id, slug }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Create diary error:", error);
    if (error.message?.includes("UNIQUE constraint failed")) {
      return new Response(JSON.stringify({ error: "スラッグが重複しています" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: "保存に失敗しました" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
