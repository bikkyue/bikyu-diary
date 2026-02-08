import type { APIRoute } from 'astro';
import type { R2Bucket } from '@cloudflare/workers-types';

export const DELETE: APIRoute = async ({ params, locals }) => {
    const runtime = (locals as any).runtime;
    const bucket = runtime?.env?.BUCKET as R2Bucket | undefined;

    if (!bucket) {
        return new Response(JSON.stringify({ error: 'Storage not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // パラメータから画像キーを取得
        const key = params.key;

        if (!key) {
            return new Response(JSON.stringify({ error: '画像キーが指定されていません' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // R2から画像を削除（keyにはimages/プレフィックスが必要）
        const r2Key = `images/${key}`;
        await bucket.delete(r2Key);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Delete image error:', error);
        return new Response(JSON.stringify({ error: '画像の削除に失敗しました' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
