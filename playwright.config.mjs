import { defineConfig } from '@playwright/test';
import { siteURL } from './src/lib/urls.mjs';

// Test the built static site in CI, or an explicitly selected local dev server.
export default defineConfig({
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR || 'test-results',
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4322', viewport: { width: 1536, height: 1024 }, trace: 'retain-on-failure' },
  webServer: process.env.TEST_BASE_URL ? undefined : { command: 'pnpm preview --port 4322', url: 'http://127.0.0.1:4322' + siteURL('/en/'), reuseExistingServer: !process.env.CI },
});
