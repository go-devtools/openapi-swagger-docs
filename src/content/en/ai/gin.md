---
title: "Gin integration procedure."
description: "Generate, inspect, mount and verify without changing business behavior."
lang: "en"
audience: "ai"
chapter: "gin"
source: "https://github.com/openapi-golang/gin-swagger/blob/1584d531e05826f3c55af71a0404d5a6d1658689/docs/ai-integration.md"
---

## Preconditions

Use Go 1.27.1, the application's actual Gin dependency and fixed real module versions. Set `GOWORK=off` and remove development replacements for independent acceptance. Download dependencies before invoking generation; its default budget is one minute.

## Generate and mount

1. Run `gin-swagger generate --dir . --output ./internal/apidoc` from the application root.
2. Import the generated package using the application's actual module path.
3. Register existing routes normally, then invoke `ginswagger.Mount(engine, apidoc.Bundle(), config)` before serving.
4. Run `gin-swagger check --dir . --output ./internal/apidoc` in CI.

Use the installed CLI at the adapter's fixed version. Never hand-edit `zz_openapi.gen.go`, wrap existing handlers to alter identity, or add documentation tags to DTOs.

## Explain uncertainty

Use `gin-swagger explain --dir . --symbol module/pkg.DTO.Field` with the real symbol. For a handler response, select `--response 201`. Explanations contain origins and declarations; a successful explanation is not a successful runtime route validation.

## UI settings

`Config.Groups` creates complete document definitions; tags group operations within each document. Each group intersects `Config.Include`. The example uses Bearer only and disables tag filtering. `UI.SubmitMethods` must be explicit to permit requests.

## Verification

Compare existing route behavior before and after documentation mounting. Inspect selected-template diagnostics, runtime build-profile checks and actual HTTP samples. Preserve every unresolved diagnostic until a tested centralized rule or accurate source declaration resolves it.
