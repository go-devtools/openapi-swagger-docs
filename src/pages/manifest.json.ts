import { siteURL } from '../lib/urls.mjs';
import { createHash } from 'node:crypto';
import { documents, rawDocuments } from '../lib/documents';
// Pin the source references independently of the documentation site's own revision.
export function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, languages: ['en', 'zh-cn'], audiences: ['human', 'ai'], sources: {
    openapi: { repository: 'https://github.com/go-devtools/openapi', commit: 'fb93d0a624f7945a0509243c5ed99fea1fbf34ea', version: 'v0.0.0-20260908050439-fb93d0a624f7' },
    ginSwagger: { repository: 'https://github.com/go-devtools/gin-swagger', commit: '659f752b8890a0293ffeddcf6d02ac41e9646d30', version: 'v0.0.0-20260908050956-659f752b8890' },
  }, documents: documents.map(([key, doc]) => ({ ...doc.frontmatter, url: siteURL(`/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}/`), markdown: siteURL(`/raw/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md`), sourceSha256: createHash('sha256').update(rawDocuments[key]).digest('hex') })) }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
