---
title: "Gin integration procedure."
description: "Generate, inspect, mount and verify without changing business behavior."
lang: "en"
audience: "ai"
chapter: "gin"
source: "https://github.com/openapi-golang/gin-swagger/blob/95c521470d1cb47891ece906189875a2cc534902/docs/ai-integration.md"
---

## Integration

1. Pin Go 1.27.1, Gin 1.12.0, adapter and core versions.
2. Generate `internal/apidoc`; import it through the application's actual module path.
3. Register existing routes unchanged. Call `ginswagger.Mount(engine, apidoc.Bundle(), config)` before serving.
4. Check source freshness in CI; compare actual responses before/after mounting.

## Runtime rules

- `Config.OpenAPI`: core document settings. `Groups`: complete definitions. Tags: groups inside a definition. Group filters intersect `Include`.
- Examples use Bearer only. Requests require explicit `UI.SubmitMethods`.
- For builds after initialization with static escaped colons, capture complete `Engine.Routes()` into `Config.RegisteredRoutes` before Run/ServeHTTP. A stale snapshot is an error.
- Encoding follows actual Engine flags. `UseEscapedPath` overrides `UseRawPath`; raw fallback can depend on parameter escapes. Inspect `x-gin-raw-path-note`.
- Ambiguous handlers require evidence and centralized `Bindings` keyed by original METHOD/path. Never infer closure state from code addresses.

## Diagnostics

Use `gin-swagger explain --dir . --symbol module/pkg.DTO.Field` with a real symbol; add `--response 201` for a handler response. Keep unresolved effects visible. Do not edit generated files, add DTO tags or wrap business handlers to silence diagnostics.
