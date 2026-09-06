import { documents } from '../lib/documents';
// Keep the discovery index small and link to explicit localized raw resources.
export function GET() {
  const entries = documents.filter(([, doc]) => doc.frontmatter.audience === 'ai').map(([, doc]) => {
    const m = doc.frontmatter;
    return `- [${m.title} (${m.lang})](/raw/${m.lang}/ai/${m.chapter}.md): ${m.description}`;
  });
  return new Response(`# openapi-golang\n\n> Go source contracts, native OpenAPI 3.2, and the Gin adapter. Pre-1.0 APIs: use pinned source references.\n\n## Agent documentation\n\n${entries.join('\n')}\n\n## Resources\n\n- [Complete AI corpus](/llms-full.txt)\n- [Version and content manifest](/manifest.json)\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
