import { test, expect } from '@playwright/test';
import { siteURL } from '../../src/lib/urls.mjs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// Agent pages retain actionable content without loading the decorative renderer or honoring old light preferences.
test('agent pages stay dark, compact and free of decorative requests', async ({ page }) => {
  const decoration = [];
  page.on('request', request => {
    if (/\/(?:_astro\/stars\.|src\/scripts\/stars\.ts)/.test(request.url())) decoration.push(request.url());
  });
  await page.addInitScript(() => localStorage.setItem('openapi-theme', 'light'));
  for (const route of ['/en/ai/schemas/', '/zh-cn/ai/gin/']) {
    await page.goto(siteURL(route));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('canvas, [data-theme-toggle], .page-toc')).toHaveCount(0);
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('.ai-raw')).toBeVisible();
    await expect(page.locator('.sidebar .nav-group')).toHaveCount(2);
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(3, 5, 7)');
  }
  expect(decoration).toEqual([]);
});

// Retain reference-sized renders outside the source tree when requested by local QA.
async function capture(page, name, testInfo) {
  const directory = process.env.SCREENSHOT_DIR || testInfo.outputPath('screenshots');
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: join(directory, name + '.png'), fullPage: false, animations: 'disabled' });
}

// Read actual rendered canvas pixels rather than an implementation-specific state flag.
async function pixels(page) { return page.locator('canvas[data-stars]').evaluate(canvas => canvas.toDataURL()); }

test('chapter, audience, language, dark appearance and code copying stay synchronized', async ({ page, context }, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => localStorage.setItem('openapi-theme', 'light'));
  await page.goto(siteURL('/en/human/schemas/'));
  await page.getByRole('link', { name: 'Language', exact: true }).click();
  await page.waitForURL('**/zh-cn/human/schemas/', { waitUntil: 'load' });
  await page.getByRole('link', { name: 'AI', exact: true }).click();
  await page.waitForURL('**/zh-cn/ai/schemas/', { waitUntil: 'load' });
  await expect(page.locator('[data-theme-toggle]')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: '复制代码', exact: true }).click();
  await expect(page.getByRole('button', { name: '复制代码', exact: true })).toHaveText('已复制');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('spec.Set(false)');
  await page.goto(siteURL('/en/ai/overview/'));
  await capture(page, 'ai-dark', info);
});

test('stars animate, react to movement, pause and respect reduced motion', async ({ page }, info) => {
  await page.goto(siteURL('/en/'));
  await expect(page.locator('canvas')).toHaveAttribute('data-rendered', 'true');
  const before = await pixels(page);
  await page.mouse.move(1110, 385);
  await expect.poll(() => pixels(page)).not.toBe(before);
  await page.getByRole('button', { name: 'Pause stars', exact: true }).click();
  const paused = await pixels(page);
  await page.mouse.move(970, 300);
  await page.waitForTimeout(180);
  expect(await pixels(page)).toBe(paused);
  await capture(page, 'home-dark', info);
  await page.getByRole('button', { name: 'Animate stars', exact: true }).click();
  await page.getByRole('button', { name: /Interactive go-devtools star cluster/ }).press('ArrowRight');
  await expect.poll(() => pixels(page)).not.toBe(paused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Animate stars', exact: true })).toBeDisabled();
  const reduced = await pixels(page);
  await page.mouse.move(1080, 470);
  await page.waitForTimeout(180);
  expect(await pixels(page)).toBe(reduced);
});

test('reading margins, links and raw agent content work without external requests', async ({ page, baseURL }, info) => {
  const external = [];
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(baseURL).origin) external.push(request.url()); });
  await page.goto(siteURL('/en/human/overview/'));
  await expect(page.locator('canvas')).toHaveAttribute('data-rendered', 'true');
  await capture(page, 'reading-dark', info);
  await page.getByRole('link', { name: 'Raw Markdown', exact: true }).click();
  await expect(page.locator('body')).toContainText('# One core. Your framework.');
  const index = await page.request.get(siteURL('/llms.txt'));
  expect(index.ok()).toBe(true);
  expect(await index.text()).toContain('/raw/zh-cn/ai/overview.md');
  const manifest = await (await page.request.get(siteURL('/manifest.json'))).json();
  expect(manifest.documents).toHaveLength(20);
  expect(external).toEqual([]);
});

// A delayed browser notification must not leave motion controls out of sync with the preference.
test('reduced motion synchronizes even without a media change notification', async ({ page }) => {
  await page.addInitScript(() => {
    const match = window.matchMedia.bind(window);
    window.matchMedia = query => {
      const result = match(query);
      if (query.includes('prefers-reduced-motion')) result.addEventListener = () => {};
      return result;
    };
  });
  await page.goto(siteURL('/en/'));
  await expect(page.locator('canvas')).toHaveAttribute('data-rendered', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Animate stars', exact: true })).toBeDisabled();
  const still = await pixels(page);
  await page.mouse.move(1130, 380);
  await page.waitForTimeout(180);
  expect(await pixels(page)).toBe(still);
});

test('phone and tablet layouts keep controls and article width inside the viewport', async ({ page }, info) => {
  for (const width of [390, 631, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/en/', '/zh-cn/human/gin/', '/en/ai/schemas/']) {
      await page.goto(siteURL(route));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.preferences')).toBeVisible();
      if (width === 390 && route === '/zh-cn/human/gin/') {
        await expect(page.locator('.mobile-contents')).not.toHaveAttribute('open', '');
        await page.locator('.mobile-contents > summary').click();
        await expect(page.getByRole('link', { name: '扩展边界', exact: true })).toBeVisible();
        await page.locator('.mobile-contents > summary').click();
        await capture(page, 'reading-mobile', info);
      }
      if (route === '/en/') {
        await page.waitForTimeout(2800);
        const copy = await page.locator('.hero-copy').boundingBox();
        const hit = await page.locator('[data-star-focus]').boundingBox();
        expect(hit.y).toBeGreaterThan(copy.y + copy.height);
        if (width === 390) await capture(page, 'home-mobile', info);
        await page.getByRole('link', { name: 'Read the docs', exact: true }).click();
        await expect(page).toHaveURL(/\/en\/human\/overview\/$/);
      }
    }
  }
});

// Replay identical pointer paths to separate drag inertia from ambient animation.
test('dragging adds visible rotation, keeps inertia and reforms the same cluster', async ({ browser, baseURL }, info) => {
  test.setTimeout(60000);
  const scenes = [];
  for (const drag of [false, true]) {
    const context = await browser.newContext({ baseURL, viewport: { width: 1536, height: 1024 } });
    const page = await context.newPage();
    await page.clock.install({ time: new Date(0) });
    await page.clock.pauseAt(new Date(1000));
    await page.goto(siteURL('/en/'));
    await expect(page.locator('canvas')).toHaveAttribute('data-rendered', 'true');
    await page.clock.runFor(3000);
    await page.mouse.move(1030, 365);
    await page.clock.runFor(400);
    // Sample visible brightness without private renderer state or hidden test hooks.
    async function sample() {
      return page.locator('canvas').evaluate(canvas => {
        const { width, height } = canvas;
        const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
        const values = [];
        for (let y = 0; y < height; y += 4) for (let x = Math.floor(width * .55); x < width; x += 4) {
          const i = (y * width + x) * 4;
          values.push(Math.max(data[i], data[i + 1], data[i + 2]) * data[i + 3] / 255);
        }
        return values;
      });
    }
    const frames = [await sample()];
    if (drag) await page.mouse.down();
    for (let step = 1; step <= 8; step++) {
      await page.mouse.move(1030 + step * 24, 365 + step * 4);
      await page.clock.runFor(32);
    }
    frames.push(await sample());
    if (drag) await page.mouse.up();
    await page.mouse.move(20, 25);
    await page.clock.runFor(250);
    frames.push(await sample());
    if (drag) await capture(page, 'home-dragged', info);
    await page.clock.runFor(9000);
    frames.push(await sample());
    scenes.push(frames);
    await context.close();
  }
  const differences = scenes[0].map((frame, stage) => frame.reduce((sum, value, i) => sum + Math.abs(value - scenes[1][stage][i]), 0) / frame.length);
  const [baseline, rotation, inertia, recovered] = differences;
  await info.attach('rendered-inertia-measurements', { body: JSON.stringify({ baseline, rotation, inertia, recovered }), contentType: 'application/json' });
  console.log({ baseline, rotation, inertia, recovered });
  expect(baseline).toBeLessThan(.5);
  expect(rotation).toBeGreaterThan(baseline + 2);
  expect(inertia).toBeGreaterThan(baseline + 2);
  expect(recovered).toBeLessThan(rotation * .2);
});

test('human and agent documents remain complete with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto(siteURL('/zh-cn/ai/validation/'));
  await expect(page.getByRole('heading', { name: '诊断决策流程。', exact: true })).toBeVisible();
  await expect(page.locator('article')).toContainText('openapi.generate.stale');
  await page.getByRole('link', { name: '人类', exact: true }).click();
  await expect(page).toHaveURL(/\/zh-cn\/human\/validation\/$/);
  await expect(page.locator('article table').first()).toBeVisible();
  await context.close();
});

// Verify the published base path, static assets and machine-readable discovery endpoints.
test('Pages entry, assets and all manifest routes remain inside the published site', async ({ page, baseURL }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(siteURL());
  await expect(page).toHaveURL(new URL(siteURL('/en/'), baseURL).href);
  await expect(page).toHaveTitle('OpenAPI, from your Go code. · go-devtools');
  await expect(page.locator('canvas')).toHaveAttribute('data-rendered', 'true');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', siteURL('/favicon.svg'));
  await page.getByRole('link', { name: 'Language', exact: true }).click();
  await expect(page).toHaveURL(new URL(siteURL('/zh-cn/'), baseURL).href);
  const manifest = await (await page.request.get(siteURL('/manifest.json'))).json();
  for (const document of manifest.documents) {
    for (const path of [document.url, document.markdown]) {
      expect(path.startsWith(siteURL('/'))).toBe(true);
      const response = await page.request.get(path);
      expect(response.status(), path).toBe(200);
      expect(await response.text()).toContain(document.title);
    }
  }
  for (const endpoint of ['/llms.txt', '/llms-full.txt']) {
    const response = await page.request.get(siteURL(endpoint));
    expect(response.status()).toBe(200);
    const text = await response.text();
    for (const [, path] of text.matchAll(/\]\((\/[^)]+)\)/g)) {
      expect(path.startsWith(siteURL('/'))).toBe(true);
      expect((await page.request.get(path)).status(), path).toBe(200);
    }
  }
  expect(errors).toEqual([]);
});
