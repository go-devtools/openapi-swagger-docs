import { createHash } from 'node:crypto';
import { documents, rawDocuments } from '../lib/documents';
// Pin the source references independently of the documentation site's own revision.
export function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, languages: ['en', 'zh-cn'], audiences: ['human', 'ai'], sources: {
    openapi: { repository: 'https://github.com/openapi-golang/openapi', commit: '094f7f6d9faf6350e48a62a17a619c91757e0dee', version: 'v0.0.0-20260906112229-094f7f6d9faf' },
    ginSwagger: { repository: 'https://github.com/openapi-golang/gin-swagger', commit: '1584d531e05826f3c55af71a0404d5a6d1658689', version: 'v0.0.0-20260906115146-1584d531e058' },
  }, documents: documents.map(([key, doc]) => ({ ...doc.frontmatter, url: `/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}/`, markdown: `/raw/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md`, sourceSha256: createHash('sha256').update(rawDocuments[key]).digest('hex') })) }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
