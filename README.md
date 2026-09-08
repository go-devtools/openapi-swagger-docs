# go-devtools documentation

[简体中文](README.zh-cn.md) · [Live documentation](https://go-devtools.github.io/openapi-swagger-docs/en/)

The bilingual documentation site for [openapi](https://github.com/go-devtools/openapi) and [gin-swagger](https://github.com/go-devtools/gin-swagger). Human guides and dedicated AI references share explicit chapter identities, with language and audience controls in the header. All pages use the dark appearance. AI pages contain compact contracts and a prominent raw Markdown entry, without decorative animation.

## Development

Use Node.js 24.20.0 and pnpm 12.3.4. The `packageManager` field pins pnpm; install that version through your existing package-manager setup before continuing.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
pnpm preview
```

`pnpm dev` starts the local development server. `pnpm build` emits a static `dist` directory and checks all local links, localized audience coverage, raw Markdown parity and source hashes. Development and preview use `/openapi-swagger-docs/`, matching the published project path.

## GitHub Pages deployment

[Read the documentation](https://go-devtools.github.io/openapi-swagger-docs/en/) or open the [AI index](https://go-devtools.github.io/openapi-swagger-docs/llms.txt).

The repository builds and publishes through `.github/workflows/ci.yml`. Push to `main` or run the workflow manually: it installs the pinned pnpm dependencies, checks source and particle contracts, builds and verifies every local link, then runs Chromium browser checks. Only the successful build artifact is deployed to the `github-pages` environment. Pull requests run the same checks without deploying. Publication uses the automatic `GITHUB_TOKEN` and OIDC; no additional personal token is needed.

In repository **Settings → Pages**, the source is **GitHub Actions**. `src/lib/urls.mjs` defines the public origin and `/openapi-swagger-docs` base shared by Astro, navigation and verification. Authored Markdown uses `/openapi-swagger-docs/` links too. After deployment, the workflow environment links to the live site. A failed build keeps the last published site available; rerun the workflow after fixing the failure.

## Content and machine-readable references

Author matching chapters in `src/content/{en,zh-cn}/{human,ai}`. Every page renders complete HTML without JavaScript and exposes its raw Markdown. `/openapi-swagger-docs/llms.txt`, `/openapi-swagger-docs/llms-full.txt` and `/openapi-swagger-docs/manifest.json` provide agent discovery, the complete dedicated AI corpus and pinned source versions. No AI service, API key or source-code upload is required.

The source references identify actual fixed product commits. This site is an introduction and integration reference; linked product guides describe detailed capability limits. Gin is the implemented adapter. Fiber and Echo are future extension directions only.

## Star fields

The homepage's individual stars gather into the organization's paired braces, stacked core and satellite nodes. Warm and cool stellar colors mix at different sizes and depths, without connecting lines. Perspective, slow orbital motion and twinkling keep the volume alive. Moving the pointer creates a local swirl that springs back; dragging rotates the cluster with inertia after release. Keyboard arrows rotate the hero and Home resets it. Human reading-page margins use a sparse field with depth and local pointer response. The pause control, reduced-motion preference, page visibility and intersection state stop sustained animation when appropriate. Touch scrolling remains native.

All assets and browser scripts are local. The canvas is decorative; it cannot intercept document links or text selection. Project-owned source comments use English; Chinese reader content is authored localization.

## License

[MIT](LICENSE).
