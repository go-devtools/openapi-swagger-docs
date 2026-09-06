---
title: "Schema 接入契约。"
description: "保留类型身份、线上结构和显式值存在性。"
lang: "zh-cn"
audience: "ai"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/094f7f6d9faf6350e48a62a17a619c91757e0dee/docs/native-objects.md"
---

## 输入与输出

使用 `compiler.Load` 加载实际构建条件，通过 `Project.Type` 或 `TypeIn` 解析真实 Go 类型表达式，再按方向、媒体类型和编解码器调用 `Project.Schema`。`Projection.StandaloneWithOptions` 输出具有资源身份、预算受限的离线 `$defs`。公开视图只读，回调同步执行。

## 存在性规则

通过 `spec.Set(value)` 构造可选布尔字段，通过 `.Value` 和 `.Present` 读取值与存在性。序列化时不得将缺省强制转换为显式 false。`spec.Set[any](nil)` 表示明确的逻辑 null。

```go
operation := spec.Operation{Deprecated: spec.Set(false)}
```

导入 `github.com/openapi-golang/openapi/spec`。这是当前固定的 1.0 前 API，与早期普通 bool 字段不能直接赋值兼容。

## 解释规则

不要给自定义编解码器强加 JSON 行为。保留泛型和导入声明的身份。注释描述语义，不能证明运行时执行约束。枚举标签与值必须对应，不得虚构缺失描述。

## 原生对象边界

Example 的 `dataValue` 与 `serializedValue` 可共存，旧 `value` 与原生值字段互斥。XML 元数据不会选择序列化器。检查器尚未认证全部 discriminator 继承或 XML 使用位置推断场景。采用高级字段前阅读固定版本的原生对象指南。
