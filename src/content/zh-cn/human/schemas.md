---
title: "从类型到线上契约。"
description: "保留真实 Go 类型身份，描述应用实际收发的数据。"
lang: "zh-cn"
audience: "human"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/f019ef8848aaea8077d3f3dc5dcd05512d25e299/docs/standalone-schema.md"
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

源码参考介绍了具备资源身份的 `$defs`、嵌入依赖和有界导出。[原生对象指南](https://github.com/openapi-golang/openapi/blob/f019ef8848aaea8077d3f3dc5dcd05512d25e299/docs/native-objects.md)说明了迁移方式和当前限制。

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

## HTTP 对象与参数继承

原生参数检查先解析引用，再比较名称和位置。操作可覆盖同名同位置的继承参数，但不能移除其他 Path Item 参数。最终参数集合最多包含一个 Querystring 参数，且不能与 Query 参数共存。外部 Path Item 和别名通过显式提供的离线资源解析。`spec.Parameter.Name` 序列化保留原生查询参数的空名称。

Server 检查 URL 模板、变量默认值及枚举成员关系，不访问声明的主机。Link 的操作标识必须在显式提供的描述中唯一且可解析；参数字面值仍作为普通数据保留。这些检查不证明运行时 URL 选择、所有序列化器或任意 Schema 可满足性，具体诊断与边界见固定版本的原生对象指南。

## 元数据与复用名称

原生检查器会保留必填字符串 `info.title`、`info.version` 和 `license.name` 的显式空值，同时拒绝缺失字段和错误类型。文档必须包含 `paths`、`webhooks` 或 `components` 至少一项。组件名称仅允许英文字母、数字、点、连字符和下划线；Schema 内部属性及 `$defs` 名称不受这一组件规则限制。

联系人邮箱和相对 URI 的语法检查离线执行。许可证 `identifier` 与 `url` 按存在性互斥。检查结果不代表 SPDX 表达式、登记信息或法律适用性已经验证。空请求体 `content` 使用规范允许的实现自定行为，本实现明确拒绝。诊断包含具体字段位置，显式提供的离线文档也会进行同样检查；完整边界见固定核心版本指南。

## 端点路径绑定

实际端点模板中的每个变量，都需要 Path Item 或每个操作提供对应的路径参数，包含 QUERY 与自定义方法。引用的 Path Item 会在每个使用它的端点分别检查。缺少变量、未使用的路径参数、重复表达式和同形模板层级都会产生诊断。空 Path Item 保留 ACL 例外。

路径字面量遵循 OpenAPI 3.2 的 ASCII 与百分号编码语法，不允许空的中间路径段。表达式名称保留 Unicode 和大小写，也可以包含 `?`、`#`、`/` 等字符；这不等于认证运行时参数值的编码。组件名、Webhook 名称及 Callback 表达式不会被当作端点路径。检查器不决定其他歧义路由的匹配顺序，也不归一化等价的百分号拼写。
