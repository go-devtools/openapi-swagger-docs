---
title: "Integrate with evidence."
description: "A focused reference for coding agents and automation."
lang: "en"
audience: "ai"
chapter: "overview"
source: "https://github.com/go-devtools/openapi/blob/fb93d0a624f7945a0509243c5ed99fea1fbf34ea/docs/ai-integration.md"
---

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
