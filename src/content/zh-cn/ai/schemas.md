---
title: "Schema 接入契约。"
description: "保留类型身份、线上结构和显式值存在性。"
lang: "zh-cn"
audience: "ai"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/2a27bf547b5e4397bde6289df65caba482b6cd7f/docs/native-objects.md"
---

## 投影

- `compiler.Load` 使用实际构建条件；`Project.Type`/`TypeIn` 使用真实 Go 类型表达式。
- `Project.Schema` 明确方向、媒体类型和 codec；`Projection.StandaloneWithOptions` 导出有预算的离线 `$defs`。
- 保留导入与泛型身份。公开视图只读，回调同步；不能假设自定义 codec 使用 JSON。

## 存在性

```go
operation := spec.Operation{Deprecated: spec.Set(false)}
```

导入 `github.com/openapi-golang/openapi/spec`；读取 `.Value` 与 `.Present`。缺省不同于 false；`spec.Set[any](nil)` 表示显式 null。枚举说明与值对齐；注释不证明运行时约束。

## 原生校验

| 范围 | 必要决策 |
| --- | --- |
| 路径 | 引用和继承解析后绑定精确路径参数，拒绝同形模板。 |
| HTTP | 比较解析后的 `(in, name)`，应用操作覆盖，禁止混用 query/querystring。 |
| 示例 | `dataValue` 与 `serializedValue` 可并存，与旧 `value` 互斥。 |
| Discriminator | 使用真实联合或继承目标及有效默认分支；提示不代替实例校验。 |
| XML | 提供必需的使用位置名称；元数据不选择线编码器。 |
| Tags/encoding | 保留 parent 存在性，拒绝循环和命名／位置编码混用。 |
| 元数据 | 保留必需空字符串；验证组件名；license URL/identifier 互斥。 |

构建高级对象前读取固定源码指南。上述检查不证明任意 Schema 可满足性、运行时路由、XML/multipart 序列化或所有 Swagger UI 功能。定位诊断仍是阻塞条件。
