---
title: "Gin 接入流程。"
description: "生成、解释、挂载并验证，保持业务行为不变。"
lang: "zh-cn"
audience: "ai"
chapter: "gin"
source: "https://github.com/openapi-golang/gin-swagger/blob/5d3bef72339ffccbb0cbf366c513d5dd3f163502/docs/ai-integration.md"
---

## 接入

1. 固定 Go 1.27.1、Gin 1.12.0、适配器与核心版本。
2. 生成 `internal/apidoc`，通过应用真实 module 路径导入。
3. 保留既有路由注册；服务启动前调用 `ginswagger.Mount(engine, apidoc.Bundle(), config)`。
4. CI 检查源码新鲜度；比较挂载前后的实际响应。

## 运行时规则

- `Config.OpenAPI`：核心配置。`Groups`：完整文档分类。Tags：文档内分组。分组过滤与 `Include` 取交集。
- 示例仅使用 Bearer；执行请求必须明确配置 `UI.SubmitMethods`。
- 含转义静态冒号且需初始化后 Build 时，在 Run/ServeHTTP 前保存完整 `Engine.Routes()` 到 `Config.RegisteredRoutes`。过期快照必须报错。
- 编码遵循 Engine 实际开关。`UseEscapedPath` 优先于 `UseRawPath`；raw 回退可能受参数转义影响，检查 `x-gin-raw-path-note`。
- 歧义 handler 需证据及集中 `Bindings`，键为原始 METHOD/path。不能用代码地址推断闭包状态。

## 诊断

使用真实符号执行 `gin-swagger explain --dir . --symbol module/pkg.DTO.Field`；handler 响应加 `--response 201`。保留未解决效果；不得手改生成文件、增加 DTO tag 或包装业务 handler 来掩盖诊断。
