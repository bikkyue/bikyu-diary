import type { APIRoute } from 'astro';
import { createDiary } from '../../../lib/db';
import { generateSlug } from '../../../lib/markdown';

export const POST: APIRoute = async ({ request, locals }) => {
    const runtime = (locals as any).runtime;
    const db = runtime?.env?.DB;

    if (!db) {
        return new Response(JSON.stringify({ error: 'Database not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const data = await request.json();

        if (!data.title || !data.content) {
            return new Response(JSON.stringify({ error: 'タイトルと本文は必須です' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const slug = data.slug || generateSlug(data.title);

        const id = await createDiary(db, {
            title: data.title,
            slug,
            content: data.content,
            status: data.status || 'draft',
            thumbnail: data.thumbnail,
            tags: data.tags || []
        });

        return new Response(JSON.stringify({ id, slug }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Create diary error:', error);

        if (error.message?.includes('UNIQUE constraint failed')) {
            return new Response(JSON.stringify({ error: 'スラッグが重複しています' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: '保存に失敗しました' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
