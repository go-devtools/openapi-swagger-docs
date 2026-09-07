---
title: "一个核心，适配你的框架。"
description: "从 Go 源码生成契约，将框架行为留在适配器中。"
lang: "zh-cn"
audience: "human"
chapter: "overview"
source: "https://github.com/openapi-golang/openapi/blob/f577090e4f47e3f7c194dc2868fb6ee9e01e6bb4/docs/adapter-sdk.md"
---

## 各部分如何配合

1. **分析源码。** 核心读取 Go 语法、类型和普通注释。框架前端将识别到的调用描述为中立效果，并生成静态 Bundle。
2. **关联实际路由。** Gin 适配器将 Bundle 与现有 `Engine.Routes()` 快照关联。既有 DTO tag、handler 与路由注册保持原样。
3. **提供缓存文档。** 启动时构建并检查文档，后续请求读取缓存的 OpenAPI JSON 和本地 Swagger UI 资源。运行时关联不读取业务源码，也不导入编译器。

## 从 Gin 适配器开始

在 gin-swagger 仓库中，先下载固定依赖，再生成文档：

```sh
GOWORK=off go mod download
GOWORK=off go run ./cmd/gin-swagger generate --dir ./examples/basic --output ./internal/apidoc
GOWORK=off go run ./cmd/gin-swagger check --dir ./examples/basic --output ./internal/apidoc
```

继续阅读 [Gin 指南](/zh-cn/human/gin/)，运行示例并查看文档。

## 选择公开包

| 职责 | 公开包 |
| --- | --- |
| Bundle、中立路由、运行时 Build 和文档检查 | `openapi` |
| 原生 OpenAPI 3.2 对象和显式值存在性 | `spec` |
| 源码加载、类型投影和框架扩展回调 | `compiler` |
| 独立验证实际请求与响应样本 | `contracttest` |
| 共享离线 Swagger UI 资源 | `swaggerui` |

## 理解能力边界

自动推导、显式声明、集中适配和未解决行为是不同结果。声明约束是在描述契约，不能证明服务端已经执行了该约束。未知效果和有歧义的 handler 身份会产生诊断，而不是猜测响应。

SDK 仍处于 1.0 之前。请固定模块和 CLI 版本，并查看[版本清单](/manifest.json)。原生对象验证仍有明确限制，包括完整的 discriminator 继承关系和 XML 名称推断。[验证指南](/zh-cn/human/validation/)说明了各类检查分别能证明什么。
