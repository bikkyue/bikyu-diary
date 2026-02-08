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

        // ファイル名をユニークにする
        const timestamp = Date.now();
        const ext = file.name.split('.').pop() || '';
        const key = `images/${timestamp}.${ext}`;

        // R2にアップロード
        const arrayBuffer = await file.arrayBuffer();
        await bucket.put(key, arrayBuffer, {
            httpMetadata: {
                contentType: file.type
            }
        });

        // 公開URLを生成（Cloudflare Pagesのパブリックアクセス前提）
        // 実際のURLはデプロイ後に調整が必要な場合があります
        const url = `/${key}`;

        return new Response(JSON.stringify({ url, key }), {
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
