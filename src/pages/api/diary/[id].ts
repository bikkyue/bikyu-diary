import type { APIRoute } from 'astro';
import { getDiaryById, updateDiary, deleteDiary } from '../../../lib/db';

export const PUT: APIRoute = async ({ params, request, locals }) => {
    const runtime = (locals as any).runtime;
    const db = runtime?.env?.DB;
    const id = parseInt(params.id || '');

    if (!db) {
        return new Response(JSON.stringify({ error: 'Database not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!id) {
        return new Response(JSON.stringify({ error: 'Invalid ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const existing = await getDiaryById(db, id);
        if (!existing) {
            return new Response(JSON.stringify({ error: '日記が見つかりません' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await request.json();

        if (!data.title || !data.content) {
            return new Response(JSON.stringify({ error: 'タイトルと本文は必須です' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await updateDiary(db, id, {
            title: data.title,
            content: data.content,
            status: data.status || 'draft',
            thumbnail: data.thumbnail,
            tags: data.tags || []
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Update diary error:', error);

        if (error.message?.includes('UNIQUE constraint failed')) {
            return new Response(JSON.stringify({ error: 'スラッグが重複しています' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: '更新に失敗しました' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
    const runtime = (locals as any).runtime;
    const db = runtime?.env?.DB;
    const id = parseInt(params.id || '');

    if (!db) {
        return new Response(JSON.stringify({ error: 'Database not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!id) {
        return new Response(JSON.stringify({ error: 'Invalid ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        await deleteDiary(db, id);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Delete diary error:', error);
        return new Response(JSON.stringify({ error: '削除に失敗しました' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
