---
title: "Schema integration contract."
description: "Preserve type identity, wire shape and explicit value presence."
lang: "en"
audience: "ai"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/094f7f6d9faf6350e48a62a17a619c91757e0dee/docs/native-objects.md"
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

Example `dataValue` and `serializedValue` may coexist; legacy `value` is mutually exclusive with the native value fields. XML metadata does not select a serializer. The checker does not certify all discriminator inheritance or XML use-site inference contexts. Consult the exact pinned native object guide before using advanced fields.
