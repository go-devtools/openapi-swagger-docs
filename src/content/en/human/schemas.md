---
title: "Types become wire contracts."
description: "Preserve actual Go identities while describing the bytes your application sends."
lang: "en"
audience: "human"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/dbb920fec4ca18faf8f56f789bbf1a1ef209e674/docs/standalone-schema.md"
---

## Project a source type

From the core repository checkout:

```sh
GOWORK=off go mod download
GOWORK=off go run ./cmd/openapi schema --dir ./testdata/types --type Request --projection request
```

The command writes standalone JSON Schema to stdout. For an application, change `--dir` to the actual package and `--type` to its real type expression. Generic instances are resolved from loaded Go types; the command does not execute handlers.

## Structure and meaning

Types and the actual codec determine wire structure. Ordinary comments provide descriptions, examples and explicit semantic constraints. Do not add DTO tags just for documentation. Request and response projections may differ, and custom codecs own their actual wire representation.

Stable component identities distinguish packages, generic arguments, direction and media type. Swagger UI uses readable schema titles without exposing identity suffixes. Enum descriptions come from comments on typed constants; `x-enum-descriptions` stays aligned with `enum`.

## Preserve explicit values

Optional standard booleans use `spec.Optional[bool]`. Absence, false and true remain distinct:

```go
operation := spec.Operation{Deprecated: spec.Set(false)}
body := spec.RequestBody{Required: spec.Set(true)}
```

Read `.Value` for the value and `.Present` to distinguish absence. A zero-valued optional field is omitted. Use `spec.Set[any](nil)` for a logical example whose value is explicitly null. These snippets use the public `github.com/openapi-golang/openapi/spec` package.

## Native examples and XML

`Example.DataValue` represents logical data, while `SerializedValue` contains the actual wire representation. `externalValue` requires explicitly supplied offline example resources. XML metadata describes a contract; it does not select a serializer or prove how business code emits XML.

Read the source reference for resource-aware `$defs`, embedded dependencies and bounded standalone output. [Native object details](https://github.com/openapi-golang/openapi/blob/dbb920fec4ca18faf8f56f789bbf1a1ef209e674/docs/native-objects.md) describe migration and current limits.

## Polymorphic branches

The checker now verifies discriminator candidates and `allOf` inheritance across offline references. If the discriminating field is optional, provide a default branch that accepts its omission and include it among the union candidates. Keep known and fallback branches disjoint when using `oneOf`.

These checks preserve normal JSON Schema validation. Required-field proof is conservative, so advanced dynamic or satisfiability constraints may need an explicit `required` or a default branch. The linked native object guide documents the exact diagnostics and limits.

## XML names at media use sites

For XML content, inline element or attribute schemas need `xml.name` when a component or property name cannot be inferred. Array items beneath a property inherit that property name; a root array's wrapper name does not name its items. Ordinary references preserve the target's physical naming context, including offline resources. Missing names produce `openapi.spec.xml.name.required` at the offending schema.

The checker applies this rule to XML content on requests, responses, parameters and headers. JSON-only schemas are unaffected. Static composition and array traversal share the reference graph's resource budget. Dynamic annotation collection, nested Encoding content types and actual XML codec behavior remain outside this check; see the pinned native object guide for the exact scope.
