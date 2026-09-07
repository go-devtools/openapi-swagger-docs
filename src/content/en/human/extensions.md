---
title: "A tested boundary for adapters."
description: "Use public compilation views and neutral effects to describe framework behavior."
lang: "en"
audience: "human"
chapter: "extensions"
source: "https://github.com/openapi-golang/openapi/blob/5a53f75a62b8a39c46f1f53d79d456eb510c6734/docs/adapter-sdk.md"
---

## Ownership stays explicit

The core owns Go type projection, ordinary comment semantics, analysis budgets, neutral effects, Bundle data and native document models. An adapter owns framework call semantics, path syntax, handler evidence and mounting. Adapters must not import core `internal` packages.

Gin is the current framework product. Fiber and Echo are future extension directions, not implemented adapters or supported imports.

## Public extension points

| Need | Public boundary |
| --- | --- |
| Recognize framework calls | `Frontend.Match`, `Entry`, `Call`, `Return` |
| Correlate returned values with effects | `CallOutcomes`, `CallOutcome` |
| Represent non-JSON data | `WireCodec`, `WireTypeCodec` |
| Describe response commitment and framing | `ResponseHeader`, `ResponseCommit`, `ResponseItem` |
| Model synchronous callbacks | `CallbackPlan`, `CallbackRepeat` |

Callbacks must be deterministic and must not execute business functions or derive contracts from the clock, network or machine paths. Public source views are read-only. Schema callbacks receive detached data; recursive callbacks remain synchronous.

## Validate a new adapter boundary

Compile real fixture handlers through the public SDK, link actual normalized routes, compare emitted wire bytes against independent contracts, and run the consumer from a separate Go module with `GOWORK=off`. Unknown calls carrying response effects must produce a diagnostic.

Arbitrary heap aliasing, asynchronous effects and unsupported control flow remain limits. Read the source reference for callback ownership, format capabilities and the full budget model before implementing an extension.
