import { siteURL } from '../lib/urls.mjs';
import { createHash } from 'node:crypto';
import { documents, rawDocuments } from '../lib/documents';
// Pin the source references independently of the documentation site's own revision.
export function GET() {
  return new Response(JSON.stringify({ schemaVersion: 1, languages: ['en', 'zh-cn'], audiences: ['human', 'ai'], sources: {
    openapi: { repository: 'https://github.com/openapi-golang/openapi', commit: '5a53f75a62b8a39c46f1f53d79d456eb510c6734', version: 'v0.0.0-20260907015838-5a53f75a62b8' },
    ginSwagger: { repository: 'https://github.com/openapi-golang/gin-swagger', commit: '641f647f97a3c125e93ada879e75aea3cb308a95', version: 'v0.0.0-20260907020224-641f647f97a3' },
  }, documents: documents.map(([key, doc]) => ({ ...doc.frontmatter, url: siteURL(`/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}/`), markdown: siteURL(`/raw/${doc.frontmatter.lang}/${doc.frontmatter.audience}/${doc.frontmatter.chapter}.md`), sourceSha256: createHash('sha256').update(rawDocuments[key]).digest('hex') })) }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
