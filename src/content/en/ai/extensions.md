---
title: "Adapter implementation contract."
description: "Extend tested public boundaries without moving framework rules into the core."
lang: "en"
audience: "ai"
chapter: "extensions"
source: "https://github.com/openapi-golang/openapi/blob/365458867d54082e317bbb1f1770e6b34cdb7f25/docs/adapter-sdk.md"
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

## Acceptance

Real source fixtures → generated Bundle → actual router → independent positive/negative HTTP samples.

Verify a separate consumer with real fixed remote modules, `GOWORK=off` and no `replace`. Gin is the only delivered adapter. Fiber/Echo imports and support claims are invalid. Arbitrary heap aliasing and asynchronous effects remain explicit limitations.
