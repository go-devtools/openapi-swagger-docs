---
title: "Adapter implementation contract."
description: "Extend tested public boundaries without moving framework rules into the core."
lang: "en"
audience: "ai"
chapter: "extensions"
source: "https://github.com/go-devtools/openapi/blob/fb93d0a624f7945a0509243c5ed99fea1fbf34ea/docs/adapter-sdk.md"
---

## Ownership

- Core: types, comments, budgets, neutral effects, Bundle, OpenAPI and Schema validation.
- Adapter: framework calls/codecs, handler evidence, actual routes, path normalization and mounting.
- Public SDK only; no core internal imports or third-party SSA in public APIs.

## Implementation

- Use `Frontend` hooks and explicit neutral effects.
- Callbacks must be deterministic, bounded and synchronous where required.
- Treat loaded views as immutable. Respect detached Schema ownership.
- Never execute business functions for discovery or hide unknown effects.

## Helper and outcome rules

- Preserve exact generic instances, function identities, constants and response/request state. Never execute source helpers or DTO codecs.
- Mutable addresses/captures/callables require bounded source reanalysis. Callback output must be deterministic for inputs and `Options.Configuration`.
- `MaxSummaries=512`, `MaxSummaryBytes=16 MiB`, `DisableHelperSummaries=false`; settings enter the source fingerprint. Bytes describe normalized retained data, not heap usage.
- Reuse still charges call/depth budgets. Type substitution: 4096 types/frame. Summary facts: 4096 values, depth 64. Exceeded budgets diagnose.
- `Effect.NonEmptyBody` is valid only for proven `RequestBody`/`RequestField` outcomes. Body required needs at least one known accepted 2xx/3xx path and proof on every accepted path; field required is independent. Inspect `uses[].nonEmptyBody` provenance.

## Acceptance

Real source fixtures → generated Bundle → actual router → independent positive/negative HTTP samples.

Verify a separate consumer with real fixed remote modules, `GOWORK=off` and no `replace`. Gin is the only delivered adapter. Fiber/Echo imports and support claims are invalid. Arbitrary heap aliasing and asynchronous effects remain explicit limitations.

## Versions

- Pin the Go SDK version; compile and test custom frontends before upgrading.
- Bundle: format 1, OpenAPI 3.2.0, known required capabilities only. Reject future formats and unknown fields/capabilities.
- Recorded writer/reader samples are limited evidence. Format acceptance does not prove build-profile equivalence or source freshness.
