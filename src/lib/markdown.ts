import { marked } from 'marked';

export function parseMarkdown(content: string): string {
    return marked(content, {
        gfm: true,
        breaks: true
    }) as string;
}

export function formatDate(dateString: string): string {
    const [datePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    return `${year}年${month}月${day}日`;
}
