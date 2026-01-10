import type { APIRoute } from 'astro';
import { createDiary } from '../../lib/db';
import { parseMarkdownFile, generateSlug } from '../../lib/markdown';

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
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response(JSON.stringify({ error: 'ファイルが選択されていません' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!file.name.endsWith('.md')) {
            return new Response(JSON.stringify({ error: 'マークダウンファイル(.md)のみ対応しています' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const content = await file.text();
        const { frontmatter, body } = parseMarkdownFile(content);

        const title = frontmatter.title || file.name.replace('.md', '');
        const slug = frontmatter.slug || generateSlug(title);
        const tags = frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()) : [];
        const status = frontmatter.status === 'published' ? 'published' : 'draft';

        const id = await createDiary(db, {
            title,
            slug,
            content: body.trim(),
            status,
            thumbnail: frontmatter.thumbnail,
            tags
        });

        return new Response(JSON.stringify({ id, slug, title }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('Import error:', error);

        if (error.message?.includes('UNIQUE constraint failed')) {
            return new Response(JSON.stringify({ error: 'スラッグが重複しています' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: 'インポートに失敗しました' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
