---
title: "Integrate with evidence."
description: "A focused reference for coding agents and automation."
lang: "en"
audience: "ai"
chapter: "overview"
source: "https://github.com/openapi-golang/openapi/blob/5a53f75a62b8a39c46f1f53d79d456eb510c6734/docs/ai-integration.md"
---

## Contract

1. Use public SDK packages only. Framework behavior belongs in the adapter.
2. Keep existing handler bodies, signatures, route registration and DTO tags unchanged.
3. Report uncertainty through diagnostics; never invent responses to make generation pass.

## Workflow

From the Gin repository checkout:

```sh
GOWORK=off go mod download
GOWORK=off go run ./cmd/gin-swagger generate --dir ./examples/basic --output ./internal/apidoc
GOWORK=off go run ./cmd/gin-swagger check --dir ./examples/basic --output ./internal/apidoc
```

For a consumer application, use its real source directory and install the CLI at the same fixed module version. Record `version` output before evaluating diagnostics. Generation success does not imply every selected route can Build.

## Machine-readable entry points

- [llms.txt](/llms.txt): compact discovery index.
- [llms-full.txt](/llms-full.txt): complete authored AI corpus in both explicit languages.
- [manifest.json](/manifest.json): fixed upstream versions, content identities and source SHA-256 digests.

## Evidence rules

Parse stdout JSON separately from stderr and inspect the process status. Native CLI success is 0, operational/document errors are 1, flag syntax errors are 2. `go run` is not the native exit-code interface. Treat `implementation: "not-proven"` literally. No AI service, key or application-source upload is needed to use these documents.
