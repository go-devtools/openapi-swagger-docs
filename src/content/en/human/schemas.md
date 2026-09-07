---
title: "Types become wire contracts."
description: "Preserve actual Go identities while describing the bytes your application sends."
lang: "en"
audience: "human"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/fcf841bbe00b5b4eba977dc8ab191b89a2065aa0/docs/standalone-schema.md"
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

Read the source reference for resource-aware `$defs`, embedded dependencies and bounded standalone output. [Native object details](https://github.com/openapi-golang/openapi/blob/fcf841bbe00b5b4eba977dc8ab191b89a2065aa0/docs/native-objects.md) describe migration and current limits.

## Polymorphic branches

The checker now verifies discriminator candidates and `allOf` inheritance across offline references. If the discriminating field is optional, provide a default branch that accepts its omission and include it among the union candidates. Keep known and fallback branches disjoint when using `oneOf`.

These checks preserve normal JSON Schema validation. Required-field proof is conservative, so advanced dynamic or satisfiability constraints may need an explicit `required` or a default branch. The linked native object guide documents the exact diagnostics and limits.

## XML names at media use sites

For XML content, inline element or attribute schemas need `xml.name` when a component or property name cannot be inferred. Array items beneath a property inherit that property name; a root array's wrapper name does not name its items. Ordinary references preserve the target's physical naming context, including offline resources. Missing names produce `openapi.spec.xml.name.required` at the offending schema.

The checker applies this rule to XML content on requests, responses, parameters and headers. JSON-only schemas are unaffected. Static composition and array traversal share the reference graph's resource budget. Dynamic annotation collection, nested Encoding content types and actual XML codec behavior remain outside this check; see the pinned native object guide for the exact scope.

## Native examples in the offline UI

Request and response media examples now read `dataValue` and `serializedValue` directly. JSON data preserves false, zero, null, empty collections and JSON-looking strings. Explicit wire text is shown and submitted unchanged; paired examples also show **Data value**. Local browser checks cover exact JSON/XML/plain-text submissions, SSE text, reusable examples/media, selection, and manual edits. The source document keeps its native 3.2 fields.

Use `serializedValue` for exact non-JSON body examples. This does not certify all parameter/header examples, form serializers, external example retrieval, or data-only XML serialization. Request execution still requires explicit configuration.

## Tag hierarchy and multipart structure

Use `spec.Tag{ Name: "items", Parent: spec.Set("resources") }` for an explicit parent. `Tag.Parent` is an optional string: the zero value omits it, while `spec.Set("")` refers to a declared tag whose name is empty. Earlier plain-string assignments must be migrated. Names must be unique, every parent must exist, and parent chains cannot cycle. Summary and kind remain ordinary strings; custom kinds are allowed. Native hierarchy metadata is preserved in the document, but the pinned UI still presents ordinary tag groups.

For multipart, named `encoding` cannot coexist with positional `prefixEncoding` or `itemEncoding` at the same level. This also applies to nested encodings. Positional media requires `itemSchema` or array evidence in `schema`: an array type, items/tuple structure, ordinary references, or positive composition branches. Local and explicitly supplied offline references retain their base URI and anchors. Missing nested Header resources produce located diagnostics.

These checks validate document structure, including style values and explicit booleans. They do not certify multipart wire serializers, complete contentType grammar, native positional UI submission, or arbitrary dynamic array-shape proofs. See the pinned native object guide for the precise boundaries.

## HTTP objects and inherited parameters

Native parameter checks resolve references before comparing names and locations. Operations can override the same inherited parameter, but cannot remove other Path Item parameters. A resulting parameter set may contain only one querystring parameter and cannot combine it with query parameters. External Path Items and aliases use explicitly supplied offline resources. Empty native query names remain present in `spec.Parameter.Name` serialization.

Servers validate URL-template syntax, variable defaults and enum membership without contacting hosts. Links require a unique resolvable operation ID across the supplied description; literal parameter values remain ordinary data. These checks do not certify runtime URL selection, every serializer or arbitrary Schema satisfiability. See the pinned native object guide for diagnostics and boundaries.

## Metadata and reusable names

The native checker preserves required empty `info.title`, `info.version` and `license.name` strings while rejecting missing fields and incorrect types. Documents need at least one of `paths`, `webhooks` or `components`. All component names use ASCII letters, digits, dots, hyphens or underscores; nested property and `$defs` names retain their own naming freedom.

Contact mailbox and relative URI checks run offline. License `identifier` and `url` are exclusive by presence. SPDX grammar, registry membership and legal applicability are not certified. Empty Request Body `content` is explicitly rejected under OpenAPI's implementation-defined allowance. Diagnostics identify the native field, including fields in supplied offline documents. See the pinned core guide for the complete tested scope.

## Endpoint path bindings

Each actual endpoint template needs matching path parameters in the Path Item or every operation, including QUERY and custom methods. Referenced Path Items are checked at each endpoint where they are used. Missing names, unused path parameters, repeated expressions and identical template hierarchies produce diagnostics. An empty Path Item retains the ACL exception.

Literal paths follow the OpenAPI 3.2 ASCII and percent-encoding grammar; empty interior segments are invalid. Expression names preserve Unicode and case, and can contain characters such as `?`, `#` and `/`. These are name rules, not runtime parameter-value serialization. Component names, webhook names and callback expressions are not endpoint paths. The checker does not choose a router's otherwise ambiguous match or normalize equivalent percent spellings.
