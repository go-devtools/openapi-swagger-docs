---
title: "Integrate with evidence."
description: "A focused reference for coding agents and automation."
lang: "en"
audience: "ai"
chapter: "overview"
source: "https://github.com/go-devtools/openapi/blob/8daf8d2e4d56822ea2969fcd12cdea395bd73c89/docs/ai-integration.md"
---

## Install the first release

Both public Go modules start at **v0.0.1**. In your own application's module:

```sh
go get github.com/go-devtools/openapi@v0.0.1
go get github.com/go-devtools/gin-swagger@v0.0.1
go install github.com/go-devtools/gin-swagger/cmd/gin-swagger@v0.0.1
gin-swagger version
```

No private token or local `replace` is needed. The adapter pins `openapi v0.0.1`. Prebuilt CLIs, source and checksums are published in [openapi releases](https://github.com/go-devtools/openapi/releases/tag/v0.0.1) and [gin-swagger releases](https://github.com/go-devtools/gin-swagger/releases/tag/v0.0.1).

Stable main, next-version develop, `release/0.0` maintenance and `hotfix/0.0.2` corrections are separate. See the [release workflow](https://github.com/go-devtools/gin-swagger/blob/main/CONTRIBUTING.md) before preparing a version. Versions are immutable; pin the CLI to the adapter version used by the application.

## Contract

- Go 1.27.1; Gin 1.12.0; native OpenAPI 3.2.
- Read fixed module versions from [manifest.json](/openapi-swagger-docs/manifest.json). Install the CLI at the application's adapter version.
- Core owns types, comments, neutral contracts and validation. Adapters own framework behavior.
- Preserve DTOs, handler signatures/bodies and route registration. Use public SDK packages only.

## Workflow

```sh
gin-swagger version
gin-swagger generate --dir . --output ./internal/apidoc
gin-swagger check --dir . --output ./internal/apidoc
```

Download dependencies first. Mount the generated Bundle on the actual router before serving. Generation, runtime Build and HTTP contract validation are separate checks.

## Evidence

- Parse stdout JSON separately from stderr. Native exit codes: 0 success; 1 operation/document error; 2 flag error.
- Preserve diagnostics and `implementation: "not-proven"`. Never invent a response or operation key.
- Independent acceptance: fixed remote versions, `GOWORK=off`, no `replace`, actual positive/negative HTTP samples.

## Resources

- [Index](/openapi-swagger-docs/llms.txt)
- [Full AI corpus](/openapi-swagger-docs/llms-full.txt)
- [Versions and content hashes](/openapi-swagger-docs/manifest.json)
