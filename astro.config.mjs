import { defineConfig } from 'astro/config';
import { site, base } from './src/lib/urls.mjs';

// Keep all documentation readable without a JavaScript runtime or remote services.
export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
