import { defineConfig } from 'astro/config';

// Keep all documentation readable without a JavaScript runtime or remote services.
export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
