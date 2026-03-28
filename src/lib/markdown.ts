import { marked } from 'marked';

export function parseMarkdown(content: string): string {
    return marked(content, {
        gfm: true,
        breaks: true
    }) as string;
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
