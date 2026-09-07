---
title: "Schema integration contract."
description: "Preserve type identity, wire shape and explicit value presence."
lang: "en"
audience: "ai"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/2a27bf547b5e4397bde6289df65caba482b6cd7f/docs/native-objects.md"
---

## Projection

- `compiler.Load`: actual build conditions. `Project.Type`/`TypeIn`: real Go expressions.
- `Project.Schema`: explicit direction, media type and codec. `Projection.StandaloneWithOptions`: bounded offline `$defs`.
- Preserve imported/generic identity. Public views are immutable; callbacks are synchronous. Do not assume a custom codec uses JSON.

## Presence

```go
operation := spec.Operation{Deprecated: spec.Set(false)}
```

Import `github.com/openapi-golang/openapi/spec`. Read `.Value` and `.Present`. Absence differs from false; `spec.Set[any](nil)` is explicit null. Enum descriptions must align with values. Comments do not prove runtime enforcement.

## Native checks

| Area | Required decision |
| --- | --- |
| Paths | Bind exact path parameters after references/inheritance; reject equivalent templates. |
| HTTP | Compare resolved `(in, name)`; apply operation overrides; never mix query/querystring. |
| Examples | `dataValue` and `serializedValue` may coexist; legacy `value` is exclusive. |
| Discriminator | Use actual union/inheritance targets and a valid fallback; hints do not validate instances. |
| XML | Provide required use-site names; metadata does not select a wire serializer. |
| Tags/encoding | Preserve optional parent presence; reject cycles and mixed named/positional encoding. |
| Metadata | Preserve required empty strings; validate component names; license URL/identifier are exclusive. |

Read the fixed source guide before constructing advanced objects. These checks do not certify arbitrary schema satisfiability, runtime routing, XML/multipart serialization or every Swagger UI feature. Keep located diagnostics blocking.
