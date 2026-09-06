import { defineConfig } from '@playwright/test';

// Test the built static site in CI, or an explicitly selected local dev server.
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4322', viewport: { width: 1536, height: 1024 }, trace: 'retain-on-failure' },
  webServer: process.env.TEST_BASE_URL ? undefined : { command: 'pnpm preview --port 4322', url: 'http://127.0.0.1:4322/en/', reuseExistingServer: !process.env.CI },
});
