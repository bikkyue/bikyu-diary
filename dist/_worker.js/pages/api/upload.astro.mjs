globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const runtime = locals.runtime;
  const bucket = runtime?.env?.BUCKET;
  if (!bucket) {
    return new Response(JSON.stringify({ error: "Storage not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "ファイルが選択されていません" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "";
    const key = `images/${timestamp}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type
      }
    });
    const url = `/${key}`;
    return new Response(JSON.stringify({ url, key }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "アップロードに失敗しました" }), {
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
