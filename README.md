# openapi-golang documentation

[简体中文](README.zh-cn.md)

The bilingual documentation site for [openapi](https://github.com/openapi-golang/openapi) and [gin-swagger](https://github.com/openapi-golang/gin-swagger). Human guides and dedicated AI references share explicit chapter identities, with language, audience and light/dark theme controls in the header.

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

`pnpm dev` starts the local development server. `pnpm build` emits a static `dist` directory and checks all local links, localized audience coverage, raw Markdown parity and source hashes. CI installs from `pnpm-lock.yaml` and retains the static output as an artifact; it does not publish a public website.

## Content and machine-readable references

Author matching chapters in `src/content/{en,zh-cn}/{human,ai}`. Every page renders complete HTML without JavaScript and exposes its raw Markdown. `/llms.txt`, `/llms-full.txt` and `/manifest.json` provide agent discovery, the complete dedicated AI corpus and pinned source versions. No AI service, API key or source-code upload is required.

The source references identify actual fixed product commits. This site is an introduction and integration reference; linked product guides describe detailed capability limits. Gin is the implemented adapter. Fiber and Echo are future extension directions only.

## Star fields

The homepage's individual stars gather into the organization's paired braces, stacked core and satellite nodes. Warm and cool stellar colors mix at different sizes and depths, without connecting lines. Perspective, slow orbital motion and twinkling keep the volume alive. Moving the pointer creates a local swirl that springs back; dragging rotates the cluster with inertia after release. Keyboard arrows rotate the hero and Home resets it. Reading-page margins use a sparse field with depth and local pointer response. The pause control, reduced-motion preference, page visibility and intersection state stop sustained animation when appropriate. Touch scrolling remains native.

All assets and browser scripts are local. The canvas is decorative; it cannot intercept document links or text selection. Project-owned source comments use English; Chinese reader content is authored localization.

## License

[MIT](LICENSE).
