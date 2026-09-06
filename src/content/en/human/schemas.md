---
title: "Types become wire contracts."
description: "Preserve actual Go identities while describing the bytes your application sends."
lang: "en"
audience: "human"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/094f7f6d9faf6350e48a62a17a619c91757e0dee/docs/standalone-schema.md"
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

Read the source reference for resource-aware `$defs`, embedded dependencies and bounded standalone output. [Native object details](https://github.com/openapi-golang/openapi/blob/094f7f6d9faf6350e48a62a17a619c91757e0dee/docs/native-objects.md) describe migration and current limits.
