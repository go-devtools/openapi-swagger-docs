import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { base } from '../src/lib/urls.mjs';

// 将公开 URL 映射到构建文件，并拒绝超出 Pages 前缀的链接。
function artifactPath(url) {
  assert(url.startsWith(base + '/'), `Route escapes the Pages base: ${url}`);
  return resolve(root, '.' + url.slice(base.length));
}

// Inspect the real static output, including no-script content and every local link.
const root = resolve('dist');
async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    result.push(...(entry.isDirectory() ? await files(path) : [path]));
  }
  return result;
}
const manifest = JSON.parse(await readFile(join(root, 'manifest.json'), 'utf8'));
assert.equal(manifest.documents.length, 20);
const identities = new Set();
for (const item of manifest.documents) {
  const key = `${item.lang}/${item.audience}/${item.chapter}`;
  assert(!identities.has(key)); identities.add(key);
  const source = await readFile(`src/content/${key}.md`, 'utf8');
  assert.equal(createHash('sha256').update(source).digest('hex'), item.sourceSha256);
  const page = await readFile(join(artifactPath(item.url), 'index.html'), 'utf8');
  assert(page.includes(`<html lang="${item.lang}"`));
  assert(page.includes(item.title));
  assert(page.includes('<article>') && page.includes('data-stars="reading"'));
  const raw = await readFile(artifactPath(item.markdown), 'utf8');
  assert(raw.includes(source.replace(/^---\n[\s\S]*?\n---\n/, '').trim()));
  assert(item.source.match(/\/blob\/[0-9a-f]{40}\//));
}
for (const lang of manifest.languages) for (const audience of manifest.audiences) for (const chapter of ['overview', 'schemas', 'validation', 'gin', 'extensions']) assert(identities.has(`${lang}/${audience}/${chapter}`));
let links = 0;
for (const file of await files(root)) {
  if (!file.endsWith('.html')) continue;
  const html = await readFile(file, 'utf8');
  assert(!html.includes('/Users/'), `Private path leaked in ${file}`);
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(link)) continue;
    const [path, hash] = link.split('#');
    let target = path ? (path.startsWith('/') ? artifactPath(path) : resolve(dirname(file), path)) : file;
    if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
    if (hash) {
      const text = await readFile(target, 'utf8');
      assert(text.includes(`id="${decodeURIComponent(hash)}"`), `Missing anchor ${link} in ${file}`);
    }
    links++;
  }
}
console.log(JSON.stringify({ documents: identities.size, localLinks: links, rawParity: 'passed', sourceHashes: 'passed', privatePaths: 'absent' }));
