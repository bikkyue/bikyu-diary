import type { APIRoute } from 'astro';
import type { R2Bucket } from '@cloudflare/workers-types';

export const GET: APIRoute = async ({ params, locals }) => {
    const runtime = (locals as any).runtime;
    const bucket = runtime?.env?.BUCKET as R2Bucket | undefined;

    if (!bucket) {
        return new Response('Storage not configured', { status: 500 });
    }

    try {
        // パラメータから画像パスを取得
        const path = params.path;

        if (!path) {
            return new Response('Image path not specified', { status: 400 });
        }

        // R2から画像を取得
        const object = await bucket.get(`images/${path}`);

        if (!object) {
            return new Response('Image not found', { status: 404 });
        }

        // 画像を返す
        return new Response(object.body, {
            headers: {
                'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000'
            }
        });
    } catch (error) {
        console.error('Image fetch error:', error);
        return new Response('Failed to fetch image', { status: 500 });
    }
};
