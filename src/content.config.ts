import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const diaries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diaries' }),
});

export const collections = { diaries };
