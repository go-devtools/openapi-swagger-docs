import { documents, rawDocuments, markdownBody } from '../lib/documents';
// Include both explicit languages, with section boundaries and original source links.
export function GET() {
  const sections = documents.filter(([, doc]) => doc.frontmatter.audience === 'ai').map(([key, doc]) => `# ${doc.frontmatter.title} [${doc.frontmatter.lang}]\n\n${markdownBody(rawDocuments[key])}\n\nSource: ${doc.frontmatter.source}`);
  return new Response(sections.join('\n\n---\n\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
