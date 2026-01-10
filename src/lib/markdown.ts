import { marked } from 'marked';

// マークダウンをHTMLに変換
export function parseMarkdown(content: string): string {
    return marked(content, {
        gfm: true,
        breaks: true
    }) as string;
}

// スラッグを生成（日本語対応）
export function generateSlug(title: string): string {
    const timestamp = Date.now().toString(36);
    const sanitized = title
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);

    return sanitized ? `${sanitized}-${timestamp}` : timestamp;
}

// 日付フォーマット
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// マークダウンファイルからフロントマターを抽出
export function parseMarkdownFile(content: string): {
    frontmatter: Record<string, string>;
    body: string;
} {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { frontmatter: {}, body: content };
    }

    const frontmatterStr = match[1];
    const body = match[2];

    const frontmatter: Record<string, string> = {};
    for (const line of frontmatterStr.split('\n')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
            frontmatter[key] = value;
        }
    }

    return { frontmatter, body };
}
