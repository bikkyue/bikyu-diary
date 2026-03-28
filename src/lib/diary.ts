import { getCollection } from 'astro:content';
import meta from '../content/diaries.json';

type MetaMap = Record<string, { created_at: string }>;

export type Diary = {
    slug: string;
    title: string;
    createdAt: string;
    body: string;
};

const metaMap = meta as MetaMap;

function getCreatedAt(filename: string): string {
    return metaMap[filename]?.created_at ?? new Date().toISOString();
}

export async function getAllDiaries(): Promise<Diary[]> {
    const entries = await getCollection('diaries');
    return entries
        .map(entry => ({
            slug: entry.id,
            title: entry.id,
            createdAt: getCreatedAt(`${entry.id}.md`),
            body: entry.body ?? '',
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getDiaryBySlug(slug: string): Promise<Diary | null> {
    const entries = await getCollection('diaries');
    const entry = entries.find(e => e.id === slug);
    if (!entry) return null;
    return {
        slug: entry.id,
        title: entry.id,
        createdAt: getCreatedAt(`${entry.id}.md`),
        body: entry.body ?? '',
    };
}
