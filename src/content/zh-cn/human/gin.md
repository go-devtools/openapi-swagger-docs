---
title: "为 Gin 应用接入文档。"
description: "从真实 handler 生成契约，在启动时挂载一次文档。"
lang: "zh-cn"
audience: "human"
chapter: "gin"
source: "https://github.com/openapi-golang/gin-swagger/blob/a2437c6092ed2f7c45016761c1e31aef3de17306/docs/ai-integration.md"
---

## 运行完整示例

在 gin-swagger 仓库中使用 Go 1.27.1：

```sh
GOWORK=off go mod download
GOWORK=off go run ./cmd/gin-swagger generate --dir ./examples/basic --output ./internal/apidoc
GOWORK=off go run ./cmd/gin-swagger check --dir ./examples/basic --output ./internal/apidoc
GOWORK=off go run ./examples/basic
```

打开 `http://127.0.0.1:8080/docs/`。用于业务项目时，CLI 应安装为与 `go.mod` 相同的固定适配器版本。[版本清单](/docs/manifest.json)记录本套文档参考的源码版本。Go 需要已经具备私有仓库访问权限。

## 保持启动接入简洁

照常注册既有路由，在启动服务前调用一次 `ginswagger.Mount(engine, apidoc.Bundle(), config)`。生成包的导入路径属于业务应用。系统先构建文档，再增加文档路由。不要修改 handler 签名、通过包装 handler 人为改变身份，或仅为文档添加 DTO tag。

`Build` 支持只构建文档、不挂载路由。源码生成在开发或 CI 阶段执行，运行时只使用生成的 Bundle 和实际路由快照。

## 查看方法、枚举与授权

示例提供 GET、POST、PUT、PATCH 和 DELETE，涵盖 201 创建、204 删除、400 输入错误、404 资源缺失，以及带替代说明的 Deprecated GET。类型与枚举示例展示允许值和来自常量注释的含义。

Authorize 只使用 Bearer。为示例授权路由输入公开演示值 `demo-token`，不加 `Bearer` 前缀。原有业务路由保持不变。只有通过 `UI.SubmitMethods` 显式启用后才允许提交请求。

## 配置整体分组

`Config.Groups` 定义右上角选择器中的完整文档，每组的 `Include(method, path)` 与 `Config.Include` 取交集。`Config.DefaultGroup` 选择初始文档。Tags 用于一个文档内部的操作分组，与整体文档选择器不同。

示例关闭 `UI.Filter`。共享 UI 展示可读模型标题、紧凑示例和枚举含义。Gin 请求绑定、响应、SSE 和流式行为分别见[请求指南](https://github.com/openapi-golang/gin-swagger/blob/a2437c6092ed2f7c45016761c1e31aef3de17306/docs/requests.md)和[响应指南](https://github.com/openapi-golang/gin-swagger/blob/a2437c6092ed2f7c45016761c1e31aef3de17306/docs/responses.md)。

## 从成功路径推导请求体存在性

JSON 或 multipart 绑定成功，以及 `FormFile` 成功读取，会提供非空请求体证据。最终 HTTP 结果决定它能否使整个请求体必填。

| Handler 行为 | 推导的请求体存在性 |
| --- | --- |
| JSON 绑定错误后返回 400 并结束 | 所有成功路径都需要请求体时为必填 |
| 忽略错误、将待提交错误改为 200，或失败后返回 204 | 无法建立所有成功路径均必填的证明 |
| 强制绑定先提交错误，随后继续渲染 | 保留已提交的 400／413 |
| URL 编码绑定或表单属性必填 | 属性约束本身不要求请求体存在 |

自动绑定按方法和媒体条件保留证据。不同媒体的存在性要求不兼容时输出条件诊断，不削弱某个分支。自定义输入流替换或解码行为需要集中规则或显式客户端声明。通过 Explain 查看 `nonEmptyBody` 与绑定来源。请求体可选不代表任何畸形输入都会被接受。

## 区分数值解析与线上类型

`Query` 值即使传给 `strconv.Atoi` 或 `ParseInt`，线上类型仍是字符串。检查错误可能产生实际拒绝分支；忽略错误后仍可能返回 200，结果为零或饱和值。不能仅凭转换操作捏造 400 响应或数值查询 Schema。同样，`len(string)` 计算 UTF-8 字节，而 JSON Schema `minLength` 计算 Unicode 码点。

## 声明有明确范围的文件响应

`File`、`FileAttachment` 和 `FileFromFS` 需要覆盖媒体、范围请求、前置条件及文件系统错误的集中契约。常量文件名不能单独证明这些事实。使用公开 `Frontend.CallOutcomes`，匹配完整业务及 Gin 身份，并记录支持方法、资源范围与配置证据。

响应指南包含一个固定文本资源规则，已通过真实 GET／HEAD 服务验证完整与部分内容、multipart 范围、304／412 前置条件、416 范围错误和文件缺失 404。其中事实属于声明，不是任意文件的自动推导。潜在 403／500 分支仅被声明，尚未实测对应权限或 I/O 失败。动态资源、目录重定向、符号链接和二进制格式需要各自的契约与样本。

## 在 CI 检查生成结果

设置 `GOWORK=off`，使用真实固定远端版本，移除本地 `replace`。按照应用实际 target 和 build tags 重新生成。`gin-swagger check` 比较全部生成字节且不写入文件。workspace 内联调成功不能证明模块可独立使用。
