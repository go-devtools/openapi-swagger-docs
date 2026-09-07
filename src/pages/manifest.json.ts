import { createHash } from 'node:crypto';
import { documents, rawDocuments } from '../lib/documents';
// Pin the source references independently of the documentation site's own revision.
export function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, languages: ['en', 'zh-cn'], audiences: ['human', 'ai'], sources: {
    openapi: { repository: 'https://github.com/openapi-golang/openapi', commit: 'dbb920fec4ca18faf8f56f789bbf1a1ef209e674', version: 'v0.0.0-20260906155521-dbb920fec4ca' },
    ginSwagger: { repository: 'https://github.com/openapi-golang/gin-swagger', commit: '8ce27a0af62abb6c66ed688afc5cf073736821d2', version: 'v0.0.0-20260907004606-8ce27a0af62a' },
  }, documents: documents.map(([key, doc]) => ({ ...doc.frontmatter, url: `/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}/`, markdown: `/raw/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md`, sourceSha256: createHash('sha256').update(rawDocuments[key]).digest('hex') })) }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
