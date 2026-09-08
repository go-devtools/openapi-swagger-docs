---
title: "Add docs to your Gin application."
description: "Generate from real handlers and mount documentation once at startup."
lang: "en"
audience: "human"
chapter: "gin"
source: "https://github.com/openapi-golang/gin-swagger/blob/60545e2ee3b400bf9225ca7e42f89660370867a2/docs/ai-integration.md"
---

## Run the complete example

From the gin-swagger repository checkout, using Go 1.27.1:

```sh
GOWORK=off go mod download
GOWORK=off go run ./cmd/gin-swagger generate --dir ./examples/basic --output ./internal/apidoc
GOWORK=off go run ./cmd/gin-swagger check --dir ./examples/basic --output ./internal/apidoc
GOWORK=off go run ./examples/basic
```

Open `http://127.0.0.1:8080/docs/`. For an application, install the CLI at the same fixed adapter version as its `go.mod`; the [manifest](/docs/manifest.json) records this documentation's source versions. Private repository access must already be available to Go.

## Keep startup integration small

Register existing routes normally, then call `ginswagger.Mount(engine, apidoc.Bundle(), config)` once before serving. The generated import path belongs to your application. The mounted documents are built before new documentation routes are added. Do not change handler signatures, wrap handlers to invent identity, or add DTO tags for documentation.

`Build` supports document construction without mounting. Keep source generation in development or CI; runtime uses the generated Bundle and actual route snapshot.

## Explore methods, enums and authorization

The example includes GET, POST, PUT, PATCH and DELETE; 201 creation, 204 deletion, 400 invalid input, 404 missing resources, and a deprecated GET replacement. The type and enum examples show allowed values with descriptions from constant comments.

Authorize uses Bearer only. Enter the intentionally public demo value `demo-token` without a `Bearer` prefix for the example authentication route. Original business routes are unchanged. Request submission is disabled unless explicitly enabled in `UI.SubmitMethods`.

## Group the documentation

`Config.Groups` creates complete documents in the top-right definition selector. Every group's `Include(method, path)` intersects `Config.Include`. `Config.DefaultGroup` chooses the initial document. Tags group operations within a document; they are different from the definition selector.

The example disables `UI.Filter`. Shared UI displays readable model titles, compact examples and enum meanings. Existing Gin binding, response, SSE and stream behavior is described in the [request guide](https://github.com/openapi-golang/gin-swagger/blob/60545e2ee3b400bf9225ca7e42f89660370867a2/docs/requests.md) and [response guide](https://github.com/openapi-golang/gin-swagger/blob/60545e2ee3b400bf9225ca7e42f89660370867a2/docs/responses.md).

## Derive body presence from accepted paths

JSON or multipart binding success and a successful `FormFile` read supply nonempty-body evidence. The final HTTP outcome determines whether this makes the complete request body required.

| Handler behavior | Derived body presence |
| --- | --- |
| Reject a JSON binding error with 400 and return | Required when every accepted path needs the body |
| Ignore the error, replace a pending error with 200, or return 204 on failure | No universal requirement established |
| Mandatory binding commits an error before later rendering | Preserve its committed 400/413 |
| URL-encoded binding or a required form property | Property constraints alone do not require a body |

Automatic binding keeps evidence within each method/media condition. Incompatible presence requirements across media produce a condition diagnostic rather than weakening a branch. Custom input-stream replacement or decoder behavior requires a centralized rule or explicit client declaration. Inspect `nonEmptyBody` and the binding source in Explain. An optional body does not imply that every malformed input is accepted.

## Distinguish parsing from wire types

`Query` values remain strings even when passed to `strconv.Atoi` or `ParseInt`. Checked errors can produce an actual rejection branch; ignored errors can still return 200 with zero or a saturated integer. Do not invent a 400 response or numeric query schema from conversion alone. Likewise, `len(string)` measures UTF-8 bytes, while JSON Schema `minLength` counts Unicode code points.

## Declare bounded file responses

`File`, `FileAttachment` and `FileFromFS` require a centralized contract for media, ranges, preconditions and filesystem errors. A constant filename alone does not establish those facts. Use the public `Frontend.CallOutcomes` boundary with exact application and Gin identities, supported methods, asset scope and configuration evidence.

The response guide includes a fixed text-asset profile tested through real GET/HEAD servers: full and partial content, multipart ranges, 304/412 preconditions, 416 ranges and missing-file 404. Its facts are declared, not inferred for arbitrary files. Potential 403/500 alternatives are declared but not exercised permission/I/O failures. Changing assets, directory redirects, symlinks and binary formats need their own contract and samples.

## Check freshness in CI

Use `GOWORK=off`, fixed real module versions and no local `replace`. Regenerate under the application's actual target and build tags. `gin-swagger check` compares complete generated bytes without writing them. A local workspace success is not evidence of independent module consumption.
