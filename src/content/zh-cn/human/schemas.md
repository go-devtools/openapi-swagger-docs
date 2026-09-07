---
title: "从类型到线上契约。"
description: "保留真实 Go 类型身份，描述应用实际收发的数据。"
lang: "zh-cn"
audience: "human"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/5a53f75a62b8a39c46f1f53d79d456eb510c6734/docs/standalone-schema.md"
---

## 导出源码类型

在核心仓库中运行：

```sh
GOWORK=off go mod download
GOWORK=off go run ./cmd/openapi schema --dir ./testdata/types --type Request --projection request
```

命令向 stdout 输出独立 JSON Schema。用于业务项目时，将 `--dir` 改为实际包目录，`--type` 改为真实类型表达式。泛型实例由已加载的 Go 类型解析，命令不会执行 handler。

## 结构与业务含义

类型和实际编解码器决定线上结构，普通注释提供描述、示例和显式语义约束。不要仅为文档增加 DTO tag。请求与响应可以有不同投影，自定义编解码器负责自身的真实数据表示。

稳定组件身份区分包、泛型参数、方向和媒体类型。Swagger UI 使用可读的 Schema 标题，隐藏身份区分后缀。枚举含义来自类型常量的注释，`x-enum-descriptions` 与 `enum` 保持对应。

## 保留显式值

可选标准布尔字段使用 `spec.Optional[bool]`，区分缺省、false 和 true：

```go
operation := spec.Operation{Deprecated: spec.Set(false)}
body := spec.RequestBody{Required: spec.Set(true)}
```

通过 `.Value` 读取值，通过 `.Present` 区分缺省。零值可选字段不会输出。使用 `spec.Set[any](nil)` 声明值明确为 null 的逻辑示例。上述代码使用公开包 `github.com/openapi-golang/openapi/spec`。

## 原生 Example 与 XML

`Example.DataValue` 表示逻辑数据，`SerializedValue` 表示线上序列化结果。`externalValue` 必须使用显式提供的离线示例资源。XML 元数据只描述契约，不会选择序列化器，也不能证明业务代码实际如何输出 XML。

源码参考介绍了具备资源身份的 `$defs`、嵌入依赖和有界导出。[原生对象指南](https://github.com/openapi-golang/openapi/blob/5a53f75a62b8a39c46f1f53d79d456eb510c6734/docs/native-objects.md)说明了迁移方式和当前限制。

## 多态分支

检查器现已验证离线引用中的 discriminator 候选和 `allOf` 继承。判别字段可缺省时，应提供允许其缺失的默认分支，并将默认分支列入联合候选。使用 `oneOf` 时，已知分支与默认分支应避免重叠。

这些检查保留正常的 JSON Schema 实例验证语义。必填字段证明采用保守规则，高级动态约束或可满足性条件可能需要明确的 `required` 或默认分支。上面的原生对象指南说明了具体诊断和限制。

## XML 使用位置的名称

XML content 中的内联 element 或 attribute Schema，如果无法从组件或属性推断名称，就需要设置 `xml.name`。属性下的数组项继承属性名；根数组的包装名称不会为它的项提供名称。普通引用保留目标的实际命名位置，包括离线资源。名称缺失时，检查器在对应 Schema 输出 `openapi.spec.xml.name.required`。

规则适用于请求、响应、参数和 Header 中的 XML content，不影响只用于 JSON 的 Schema。静态组合和数组遍历共用引用图的资源预算。动态注解收集、嵌套 Encoding 的内容类型及实际 XML 编解码行为不在本次检查范围，完整边界见固定版本的原生对象指南。

## 离线 UI 中的原生示例

请求和响应的媒体示例现在直接读取 `dataValue` 与 `serializedValue`。JSON 数据保留 false、零、null、空集合及外观类似 JSON 的字符串；显式序列化文本原样展示和提交，配对示例另外展示 **Data value**。本地浏览器验证覆盖 JSON、XML、纯文本的实际提交字节、SSE 文本、可复用示例与媒体、选择切换和手动编辑，源文档保留原生 3.2 字段。

需要精确的非 JSON 请求体示例时使用 `serializedValue`。这不代表参数与响应头示例、表单序列化、外部示例获取、只有逻辑值的 XML 序列化均已完整支持。执行请求仍需显式配置。

## 标签层级与 multipart 结构

使用 `spec.Tag{ Name: "items", Parent: spec.Set("resources") }` 指定父标签。`Tag.Parent` 现在是可选字符串：零值表示省略，`spec.Set("")` 则引用已经声明的空名称标签。早期直接赋字符串的代码需要迁移。标签名必须唯一，父标签必须存在，父级链不能成环。summary 和 kind 都是普通字符串，允许自定义 kind。原生层级元数据会保留在文档中，当前固定 UI 仍按普通标签分组展示。

multipart 的具名 `encoding` 不能与同层的位置编码 `prefixEncoding`、`itemEncoding` 共存，嵌套编码同样遵守此规则。位置编码媒体需要 `itemSchema`，或由 `schema` 提供数组结构证据：数组类型、数组项与元组结构、普通引用或正向组合分支。本地及显式提供的离线引用保留基准 URI 和锚点，嵌套 Header 缺少资源时会报告具体位置。

这些检查验证文档结构，包括 style 取值与显式布尔值，不代表已经认证 multipart 线上序列化、完整 contentType 语法、原生位置编码 UI 提交，或任意动态数组形状证明。精确边界见固定版本的原生对象指南。
