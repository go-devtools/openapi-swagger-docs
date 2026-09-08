import { siteURL } from '../lib/urls.mjs';
import { createHash } from 'node:crypto';
import { documents, rawDocuments } from '../lib/documents';
// Pin the source references independently of the documentation site's own revision.
export function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, languages: ['en', 'zh-cn'], audiences: ['human', 'ai'], sources: {
    openapi: { repository: 'https://github.com/openapi-golang/openapi', commit: '8e5783bf170eeb2db98771ebf1e8856c7a635928', version: 'v0.0.0-20260908014618-8e5783bf170e' },
    ginSwagger: { repository: 'https://github.com/openapi-golang/gin-swagger', commit: '4d50b1f71e3097a3129968350c7f41cf476f8fda', version: 'v0.0.0-20260908022857-4d50b1f71e30' },
  }, documents: documents.map(([key, doc]) => ({ ...doc.frontmatter, url: siteURL(`/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}/`), markdown: siteURL(`/raw/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md`), sourceSha256: createHash('sha256').update(rawDocuments[key]).digest('hex') })) }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
