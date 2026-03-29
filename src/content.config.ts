import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import rawMeta from './content/diaries.json';

type DiaryMeta = { path: string; created_at: string };
const meta = rawMeta as Record<string, DiaryMeta>;

// path（NFC 正規化）→ ID の逆引きマップ
const pathToId: Record<string, string> = {};
for (const [id, entry] of Object.entries(meta)) {
    pathToId[entry.path.normalize('NFC')] = id;
}

const diaries = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/content/diaries',
        generateId({ entry }) {
            // entry は base からの相対パス（例: "202601/20260110-日記を書く。.md"）
            const normalized = entry.normalize('NFC');
            const id = pathToId[normalized];
            if (id) return id;
            // diaries.json 未登録のファイル（dev 時など）はパスをそのまま ID とする
            return normalized.replace(/\.md$/, '');
        },
    }),
});

export const collections = { diaries };
