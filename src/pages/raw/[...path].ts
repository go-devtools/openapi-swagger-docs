import { documents, rawDocuments, markdownBody } from '../../lib/documents';
// Publish the same authored Markdown that supplies each rendered page.
export function getStaticPaths() {
  return documents.map(([key, doc]) => ({ params: { path: `${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md` }, props: { text: `# ${doc.frontmatter.title}\n\n${doc.frontmatter.description}\n\n${markdownBody(rawDocuments[key])}\n\nSource: ${doc.frontmatter.source}\n` } }));
}
export function GET({ props }: { props: { text: string } }) { return new Response(props.text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } }); }
