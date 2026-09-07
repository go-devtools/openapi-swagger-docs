---
title: "Adapter implementation contract."
description: "Extend tested public boundaries without moving framework rules into the core."
lang: "en"
audience: "ai"
chapter: "extensions"
source: "https://github.com/openapi-golang/openapi/blob/f577090e4f47e3f7c194dc2868fb6ee9e01e6bb4/docs/adapter-sdk.md"
---

## Ownership contract

Core: types, comments, budgets, neutral effects, Bundle and OpenAPI models. Adapter: framework call semantics, path normalization, handler identity evidence and mount behavior. Do not import core internal packages or expose third-party SSA through public APIs.

## Callback contract

Use public `Frontend` hooks and explicit neutral effects. Keep callbacks deterministic, synchronous where required, and independent of network, time and machine paths. Never execute business functions for discovery. Treat loaded public views as immutable and respect detached schema ownership.

## Acceptance evidence

Exercise real fixture handlers, actual normalized route snapshots and independent sample validation. Run a consumer in a separate module with fixed remote dependencies, `GOWORK=off`, and no `replace`. Verify unknown calls carrying effects remain diagnostics.

## Unimplemented products

Gin is the delivered adapter. Fiber and Echo are future directions only. Do not invent imports, installation commands or support claims for them. Arbitrary heap aliasing and asynchronous effects remain explicit analysis limitations.
