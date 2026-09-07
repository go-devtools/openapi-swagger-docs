---
title: "One core. Your framework."
description: "Compile Go source into contracts. Keep framework behavior in adapters."
lang: "en"
audience: "human"
chapter: "overview"
source: "https://github.com/openapi-golang/openapi/blob/365458867d54082e317bbb1f1770e6b34cdb7f25/docs/adapter-sdk.md"
---

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

Continue with the [Gin guide](/docs/en/human/gin/) to run the application and inspect its documentation.

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

The SDK is pre-1.0. Pin both modules and the CLI, and read [the version manifest](/docs/manifest.json) before adopting an API. Native object validation still has documented limits, including complete discriminator inheritance and XML name inference. See [validation](/docs/en/human/validation/) for the checks that establish useful evidence.
