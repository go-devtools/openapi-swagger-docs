import { siteURL } from '../lib/urls.mjs';
import { createHash } from 'node:crypto';
import { documents, rawDocuments } from '../lib/documents';
// Pin the source references independently of the documentation site's own revision.
export function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, languages: ['en', 'zh-cn'], audiences: ['human', 'ai'], sources: {
    openapi: { repository: 'https://github.com/openapi-golang/openapi', commit: '2a27bf547b5e4397bde6289df65caba482b6cd7f', version: 'v0.0.0-20260907083400-2a27bf547b5e' },
    ginSwagger: { repository: 'https://github.com/openapi-golang/gin-swagger', commit: 'f5e72c1b82678ec8d995638f80e634444a1d0d31', version: 'v0.0.0-20260907083657-f5e72c1b8267' },
  }, documents: documents.map(([key, doc]) => ({ ...doc.frontmatter, url: siteURL(`/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}/`), markdown: siteURL(`/raw/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md`), sourceSha256: createHash('sha256').update(rawDocuments[key]).digest('hex') })) }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
