import { getCollection } from 'astro:content';
import rawMeta from '../content/diaries.json';

type DiaryMeta = { path: string; created_at: string };
type MetaMap = Record<string, DiaryMeta>;

export type Diary = {
    slug: string;
    title: string;
    created_at: string;
    body: string;
};

export type DiaryGroup = {
    directory: string;
    diaries: Diary[];
};

const metaMap = rawMeta as MetaMap;

// slug（path から .md を除いた文字列）→ ID の逆引きマップ
const slugToId: Record<string, string> = {};
for (const [id, entry] of Object.entries(metaMap)) {
    const slug = entry.path.replace(/\.md$/, '');
    slugToId[slug] = id;
}

function pathToSlug(p: string): string {
    return p.replace(/\.md$/, '');
}

function getCreatedAt(id: string): string {
    return metaMap[id]?.created_at ?? new Date().toISOString();
}

function buildDiary(entryId: string, body: string): Diary {
    const entryMeta = metaMap[entryId];
    const slug = entryMeta ? pathToSlug(entryMeta.path) : entryId;
    return {
        slug,
        title: slug.includes('/') ? slug.split('/').pop()! : slug,
        created_at: getCreatedAt(entryId),
        body,
    };
}

export async function getAllDiaries(): Promise<Diary[]> {
    const entries = await getCollection('diaries');
    return entries
        .map(entry => buildDiary(entry.id, entry.body ?? ''))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
            const aMax = new Date(a.diaries[0].created_at).getTime();
            const bMax = new Date(b.diaries[0].created_at).getTime();
            return bMax - aMax;
        });
}

export async function getDiaryBySlug(slug: string): Promise<Diary | null> {
    const entries = await getCollection('diaries');
    const id = slugToId[slug];
    let entry;
    if (id) {
        entry = entries.find(e => e.id === id);
    } else {
        // diaries.json 未登録のファイル（dev 時など）はパスベースの ID で直接検索
        entry = entries.find(e => e.id === slug);
    }
    if (!entry) return null;
    return buildDiary(entry.id, entry.body ?? '');
}
