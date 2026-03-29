import { marked } from 'marked';

export function parseMarkdown(content: string): string {
    return marked(content, {
        gfm: true,
        breaks: true
    }) as string;
}

export function formatDate(dateString: string): string {
    const [datePart, timePart] = dateString.split(' ');
    const [yyyy, mm, dd] = datePart.split('-');
    const [hh, min] = (timePart ?? '00:00').split(':');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
