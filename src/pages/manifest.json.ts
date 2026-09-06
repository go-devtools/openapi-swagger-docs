import { createHash } from 'node:crypto';
import { documents, rawDocuments } from '../lib/documents';
// Pin the source references independently of the documentation site's own revision.
export function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, languages: ['en', 'zh-cn'], audiences: ['human', 'ai'], sources: {
    openapi: { repository: 'https://github.com/openapi-golang/openapi', commit: 'cb0cfbb4dfdc293df0eb4bd4cf0df0dcc0ddd156', version: 'v0.0.0-20260906141009-cb0cfbb4dfdc' },
    ginSwagger: { repository: 'https://github.com/openapi-golang/gin-swagger', commit: '960f538e69cab4bed9167e8cafdab9dd365d1554', version: 'v0.0.0-20260906144650-960f538e69ca' },
  }, documents: documents.map(([key, doc]) => ({ ...doc.frontmatter, url: `/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}/`, markdown: `/raw/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md`, sourceSha256: createHash('sha256').update(rawDocuments[key]).digest('hex') })) }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
