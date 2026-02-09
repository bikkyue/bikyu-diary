import type { APIRoute } from 'astro';
import type { R2Bucket } from '@cloudflare/workers-types';

export const POST: APIRoute = async ({ request, locals }) => {
    const runtime = (locals as any).runtime;
    const bucket = runtime?.env?.BUCKET as R2Bucket | undefined;

    if (!bucket) {
        return new Response(JSON.stringify({ error: 'Storage not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response(JSON.stringify({ error: 'ファイルが選択されていません' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // ファイル形式のバリデーション
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({ error: 'jpg, png, gif, webp のみアップロードできます' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // ファイル名を生成（yyyymmddHHMMSS + 2桁の採番）- 日本時間
        const now = new Date();
        // 日本時間に変換（UTC+9）
        const jstOffset = 9 * 60 * 60 * 1000;
        const jst = new Date(now.getTime() + jstOffset);
        const dateStr = jst.getUTCFullYear().toString() +
            String(jst.getUTCMonth() + 1).padStart(2, '0') +
            String(jst.getUTCDate()).padStart(2, '0') +
            String(jst.getUTCHours()).padStart(2, '0') +
            String(jst.getUTCMinutes()).padStart(2, '0') +
            String(jst.getUTCSeconds()).padStart(2, '0');

        // indexパラメータを取得（デフォルトは01）
        const reqUrl = new URL(request.url);
        const indexParam = reqUrl.searchParams.get('index') || '1';
        const index = String(parseInt(indexParam, 10)).padStart(2, '0');

        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const key = `images/${dateStr}${index}.${ext}`;

        // R2にアップロード
        const arrayBuffer = await file.arrayBuffer();
        await bucket.put(key, arrayBuffer, {
            httpMetadata: {
                contentType: file.type
            }
        });

        // R2パブリックドメインで絶対URLを生成
        const imageUrl = `https://diary.bikyu.dev/${key}`;

        return new Response(JSON.stringify({ url: imageUrl, key }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({ error: 'アップロードに失敗しました' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
