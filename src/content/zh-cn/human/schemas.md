---
title: "从类型到线上契约。"
description: "保留真实 Go 类型身份，描述应用实际收发的数据。"
lang: "zh-cn"
audience: "human"
chapter: "schemas"
source: "https://github.com/openapi-golang/openapi/blob/094f7f6d9faf6350e48a62a17a619c91757e0dee/docs/standalone-schema.md"
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

源码参考介绍了具备资源身份的 `$defs`、嵌入依赖和有界导出。[原生对象指南](https://github.com/openapi-golang/openapi/blob/094f7f6d9faf6350e48a62a17a619c91757e0dee/docs/native-objects.md)说明了迁移方式和当前限制。
