import type { APIRoute } from 'astro';
import type { R2Bucket } from '@cloudflare/workers-types';

export const GET: APIRoute = async ({ locals }) => {
    const runtime = (locals as any).runtime;
    const bucket = runtime?.env?.BUCKET as R2Bucket | undefined;

    if (!bucket) {
        return new Response(JSON.stringify({ error: 'Storage not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // R2バケットから画像一覧を取得
        const listed = await bucket.list({ prefix: 'images/' });

        // 最新順にソートして6件に制限
        const images = listed.objects
            .sort((a, b) => b.uploaded.getTime() - a.uploaded.getTime())
            .slice(0, 6)
            .map(obj => ({
                key: obj.key,
                url: `https://diary.r2.bikyu.dev/${obj.key}`,
                size: obj.size,
                uploaded: obj.uploaded.toISOString()
            }));

        return new Response(JSON.stringify({ images }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('List images error:', error);
        return new Response(JSON.stringify({ error: '画像一覧の取得に失敗しました' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
