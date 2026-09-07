import { createHash } from 'node:crypto';
import { documents, rawDocuments } from '../lib/documents';
// Pin the source references independently of the documentation site's own revision.
export function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, languages: ['en', 'zh-cn'], audiences: ['human', 'ai'], sources: {
    openapi: { repository: 'https://github.com/openapi-golang/openapi', commit: 'f577090e4f47e3f7c194dc2868fb6ee9e01e6bb4', version: 'v0.0.0-20260907011954-f577090e4f47' },
    ginSwagger: { repository: 'https://github.com/openapi-golang/gin-swagger', commit: 'a7cd7f4007d37f9105ff3c899618964f9b8f9c80', version: 'v0.0.0-20260907012524-a7cd7f4007d3' },
  }, documents: documents.map(([key, doc]) => ({ ...doc.frontmatter, url: `/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}/`, markdown: `/raw/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md`, sourceSha256: createHash('sha256').update(rawDocuments[key]).digest('hex') })) }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
