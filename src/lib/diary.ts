import { getCollection } from 'astro:content';
import meta from '../content/diaries.json';

type MetaMap = Record<string, string>;

export type Diary = {
    slug: string;
    title: string;
    createdAt: string;
    body: string;
};

export type DiaryGroup = {
    directory: string;
    diaries: Diary[];
};

const metaMap = meta as MetaMap;

function getCreatedAt(filename: string): string {
    return metaMap[filename] ?? new Date().toISOString();
}

export async function getAllDiaries(): Promise<Diary[]> {
    const entries = await getCollection('diaries');
    return entries
        .map(entry => ({
            slug: entry.id,
            title: entry.id.includes('/') ? entry.id.split('/').pop()! : entry.id,
            createdAt: getCreatedAt(`${entry.id}.md`),
            body: entry.body ?? '',
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getDiaryGroups(): Promise<DiaryGroup[]> {
    const all = await getAllDiaries();
    const map = new Map<string, Diary[]>();
    for (const d of all) {
        const dir = d.slug.includes('/')
            ? d.slug.substring(0, d.slug.lastIndexOf('/'))
            : '';
        if (!map.has(dir)) map.set(dir, []);
        map.get(dir)!.push(d);
    }
    return Array.from(map.entries())
        .map(([directory, diaries]) => ({ directory, diaries }))
        .sort((a, b) => {
            const aMax = new Date(a.diaries[0].createdAt).getTime();
            const bMax = new Date(b.diaries[0].createdAt).getTime();
            return bMax - aMax;
        });
}

export async function getDiaryBySlug(slug: string): Promise<Diary | null> {
    const entries = await getCollection('diaries');
    const entry = entries.find(e => e.id === slug);
    if (!entry) return null;
    return {
        slug: entry.id,
        title: entry.id.includes('/') ? entry.id.split('/').pop()! : entry.id,
        createdAt: getCreatedAt(`${entry.id}.md`),
        body: entry.body ?? '',
    };
}
