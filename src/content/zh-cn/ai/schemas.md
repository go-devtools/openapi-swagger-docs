---
title: "Schema 接入契约。"
description: "保留类型身份、线上结构和显式值存在性。"
lang: "zh-cn"
audience: "ai"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/dbb920fec4ca18faf8f56f789bbf1a1ef209e674/docs/native-objects.md"
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

Example 的 `dataValue` 与 `serializedValue` 可共存，旧 `value` 与原生值字段互斥。XML 元数据不会选择序列化器。XML 使用位置的静态名称按下方说明的范围检查。采用高级字段前阅读固定版本的原生对象指南。

## 多态决策规则

显式 mapping 和 defaultMapping 的目标应列入相邻 `oneOf`/`anyOf` 候选，或确实通过 `allOf` 继承判别器所在的父 Schema。别名、离线锚点和间接继承的解析受共享资源预算限制。判别属性可缺省时，应提供能接受该属性缺失的 `defaultMapping`。

必填证明使用显式 `required`、普通引用、`allOf` 约束、联合的每个候选及条件的两个分支，不求解任意可满足性，也不把静态引用目标当成动态作用域的证明。无法证明时，补充明确约束或合适的默认分支，并检查带位置的 `openapi.spec.discriminator.*` 诊断。

Discriminator 提示不会改变 JSON Schema 实例验证结果。`oneOf` 分支重叠仍会失败；只验证父 Schema 不会自动验证映射子类。默认分支需要在适当情况下排除已知值，以免与其他联合分支重叠。

## XML 命名决策

对 `application/xml`、`text/xml` 及 `+xml` content，检查 `openapi.spec.xml.name.required`。内联 element/attribute Schema 无法推断名称时，应补充明确名称。组件名、属性名和属性数组的项名称按普通引用解析后的实际位置推断，不得把引用包装的名称传给目标，也不得把根数组名称传给数组项。组合层刻意不生成 XML 节点时使用 `nodeType: "none"`。

静态遍历覆盖复用媒体、普通离线 Schema 引用、具名属性、数组项/元组及正向组合分支。`then`/`else` 仅在存在 `if` 时参与。循环遍历受 `MaxIndexBytes` 限制。未使用的 Schema 和仅 JSON content 不代表 XML 使用。不得将这些检查视为完整动态注解求值、嵌套 Encoding 验证或 XML 线上编解码认证。
