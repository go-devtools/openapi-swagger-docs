---
title: "Schema integration contract."
description: "Preserve type identity, wire shape and explicit value presence."
lang: "en"
audience: "ai"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/dbb920fec4ca18faf8f56f789bbf1a1ef209e674/docs/native-objects.md"
---

## Inputs and outputs

Use `compiler.Load` with actual build conditions, `Project.Type` or `TypeIn` with real Go type expressions, and `Project.Schema` for a specific direction, media type and codec. `Projection.StandaloneWithOptions` emits bounded offline `$defs` with resource-aware identities. Views are read-only and callbacks are synchronous.

## Presence rules

Construct optional booleans with `spec.Set(value)`. Read `.Value` and `.Present`; never coerce absence to an explicitly supplied false during serialization. `spec.Set[any](nil)` represents explicit logical null.

```go
operation := spec.Operation{Deprecated: spec.Set(false)}
```

Import `github.com/openapi-golang/openapi/spec`. This is the pinned pre-1.0 API, not an assignment-compatible replacement for earlier plain boolean fields.

## Interpretation rules

Do not infer JSON behavior for an owned custom codec. Preserve generic and imported declaration identity. Comments describe semantics; they are not proof of runtime enforcement. Enum labels must remain aligned with their values and must not invent missing descriptions.

## Native object boundaries

Example `dataValue` and `serializedValue` may coexist; legacy `value` is mutually exclusive with the native value fields. XML metadata does not select a serializer. Static XML use-site names are checked within the scope described below. Consult the exact pinned native object guide before using advanced fields.

## Discriminator decisions

List explicit mapping and default targets in the adjacent `oneOf`/`anyOf` candidates, or use actual `allOf` descendants of the discriminator parent. Aliases, offline anchors and transitive inheritance are resolved within the shared resource budget. When the discriminating property is optional, supply a `defaultMapping` that can accept its omission.

Required-property proof follows explicit `required`, ordinary references, `allOf` constraints, every union alternative, and both conditional branches. It does not solve arbitrary satisfiability or certify dynamic scope from a static reference. For an unproven case, add an explicit constraint or an appropriate default; inspect the located `openapi.spec.discriminator.*` diagnostic.

Discriminator hints do not change JSON Schema instance validation. Overlapping `oneOf` branches still fail; validating a parent alone does not automatically validate the mapped child. A fallback should exclude known values when necessary to keep union branches disjoint.

## XML naming decisions

At `application/xml`, `text/xml`, and `+xml` content uses, inspect `openapi.spec.xml.name.required`. Provide an explicit name for unnamed inline element/attribute schemas. Component names, property names, and property-array item names are inferred from physical locations after ordinary reference resolution; do not propagate a reference wrapper's name to its target or a root array's name to its items. Use `nodeType: "none"` for an intentional composition layer with no XML node.

Static traversal checks reusable media, ordinary offline schema references, named properties, items/tuples and positive composition branches. `then`/`else` require `if` to participate. Cycles terminate within `MaxIndexBytes`. Unused schemas and JSON-only content do not imply XML use. Do not treat this as complete dynamic annotation evaluation, nested Encoding validation or XML wire-codec certification.
