---
title: "A tested boundary for adapters."
description: "Use public compilation views and neutral effects to describe framework behavior."
lang: "en"
audience: "human"
chapter: "extensions"
source: "https://github.com/openapi-golang/openapi/blob/2a27bf547b5e4397bde6289df65caba482b6cd7f/docs/adapter-sdk.md"
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

## Upgrade versions deliberately

Pin the source SDK by module version. Bundle format 1 readers accept OpenAPI 3.2.0 and the declared `oas32`, `schema2020-12` and `request-conditions-v1` capabilities; they reject future formats, unknown required capabilities and unknown protocol fields. Informational writer strings do not have to match the reader.

The source SDK guide records two real published writers whose archived output is read by the current runtime and checked against valid and invalid JSON samples. This verifies those ordinary JSON contracts, not every historical module pair. Build-profile matching and source freshness remain separate checks. Run the core's external consumer tests before upgrading an adapter's fixed dependency, then regenerate and verify the adapter with workspace disabled.
