import type { MarkdownInstance } from 'astro';
import type { Audience, Language } from './site';

// Frontmatter provides the same navigation identity for HTML and raw Markdown.
export interface Metadata { title: string; description: string; lang: Language; audience: Audience; chapter: string; source: string }
export const documents = Object.entries(import.meta.glob<MarkdownInstance<Metadata>>('../content/**/*.md', { eager: true }));
export const rawDocuments = import.meta.glob<string>('../content/**/*.md', { eager: true, query: '?raw', import: 'default' });

// Strip build metadata while preserving the author's portable Markdown body.
export function markdownBody(raw: string) { return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim(); }
