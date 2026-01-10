globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getDiaryById, u as updateDiary, d as deleteDiary } from '../../../chunks/db_DmU0dmNz.mjs';
export { renderers } from '../../../renderers.mjs';

const PUT = async ({ params, request, locals }) => {
  const runtime = locals.runtime;
  const db = runtime?.env?.DB;
  const id = parseInt(params.id || "");
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const existing = await getDiaryById(db, id);
    if (!existing) {
      return new Response(JSON.stringify({ error: "日記が見つかりません" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = await request.json();
    if (!data.title || !data.content) {
      return new Response(JSON.stringify({ error: "タイトルと本文は必須です" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await updateDiary(db, id, {
      title: data.title,
      content: data.content,
      status: data.status || "draft",
      thumbnail: data.thumbnail,
      tags: data.tags || []
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Update diary error:", error);
    if (error.message?.includes("UNIQUE constraint failed")) {
      return new Response(JSON.stringify({ error: "スラッグが重複しています" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: "更新に失敗しました" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params, locals }) => {
  const runtime = locals.runtime;
  const db = runtime?.env?.DB;
  const id = parseInt(params.id || "");
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    await deleteDiary(db, id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Delete diary error:", error);
    return new Response(JSON.stringify({ error: "削除に失敗しました" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    DELETE,
    PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
