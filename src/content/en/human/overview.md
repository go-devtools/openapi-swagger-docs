---
title: "One core. Your framework."
description: "Compile Go source into contracts. Keep framework behavior in adapters."
lang: "en"
audience: "human"
chapter: "overview"
source: "https://github.com/go-devtools/openapi/blob/8daf8d2e4d56822ea2969fcd12cdea395bd73c89/docs/adapter-sdk.md"
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

## How it fits together

1. **Analyze source.** The core reads Go syntax, types and ordinary comments. The framework frontend describes recognized calls as neutral effects and produces a static Bundle.
2. **Link real routes.** The Gin adapter links that Bundle to the existing `Engine.Routes()` snapshot. Existing DTO tags, handlers and route registration stay intact.
3. **Serve cached documents.** Startup builds and checks the documents once. Requests read cached OpenAPI JSON and local Swagger UI assets. Runtime linking does not read application source or import the compiler.

## Start with the Gin adapter

In the gin-swagger repository checkout, download its pinned dependencies before generating:

```sh
GOWORK=off go mod download
GOWORK=off go run ./cmd/gin-swagger generate --dir ./examples/basic --output ./internal/apidoc
GOWORK=off go run ./cmd/gin-swagger check --dir ./examples/basic --output ./internal/apidoc
```

Continue with the [Gin guide](/openapi-swagger-docs/en/human/gin/) to run the application and inspect its documentation.

## Choose the right package

| Responsibility | Public package |
| --- | --- |
| Bundle, neutral routes, runtime Build and document checking | `openapi` |
| Native OpenAPI 3.2 objects and explicit value presence | `spec` |
| Source loading, projection and framework extension callbacks | `compiler` |
| Independent validation of actual request and response samples | `contracttest` |
| Shared offline Swagger UI resources | `swaggerui` |

## Read the capability boundaries

Automatic derivation, explicit declaration, centralized adaptation and unresolved behavior are different outcomes. A declared constraint describes a contract; it does not prove the server enforces it. Unknown effects and ambiguous handler identities produce diagnostics instead of guessed responses.

The SDK is pre-1.0. Pin both modules and the CLI, and read [the version manifest](/openapi-swagger-docs/manifest.json) before adopting an API. Native object validation still has documented limits, including complete discriminator inheritance and XML name inference. See [validation](/openapi-swagger-docs/en/human/validation/) for the checks that establish useful evidence.
