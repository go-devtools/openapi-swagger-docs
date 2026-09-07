---
title: "依据证据完成接入。"
description: "供编程代理与自动化使用的专用契约参考。"
lang: "zh-cn"
audience: "ai"
chapter: "overview"
source: "https://github.com/openapi-golang/openapi/blob/fcf841bbe00b5b4eba977dc8ab191b89a2065aa0/docs/ai-integration.md"
---

## 契约

- Go 1.27.1；Gin 1.12.0；原生 OpenAPI 3.2。
- 从 [manifest.json](/docs/manifest.json) 读取固定模块版本；CLI 与应用的适配器版本一致。
- 核心负责类型、注释、中立契约和校验；适配器负责框架语义。
- 保留 DTO、handler 签名与函数体、既有路由注册；仅使用公开 SDK。

## 流程

```sh
gin-swagger version
gin-swagger generate --dir . --output ./internal/apidoc
gin-swagger check --dir . --output ./internal/apidoc
```

先下载依赖，再生成。使用实际 router 在启动服务前挂载 Bundle。生成、运行时 Build、HTTP 契约验收分别验证。

## 证据

- 分别读取 stdout JSON、stderr、退出码。原生退出码：0 成功；1 操作或文档错误；2 参数错误。
- 保留诊断和 `implementation: "not-proven"`；不得捏造响应或 OperationKey。
- 独立验收：真实远端固定版本、`GOWORK=off`、无 `replace`、实际正反 HTTP 样本。

## 入口

- [索引](/docs/llms.txt)
- [完整 AI 正文](/docs/llms-full.txt)
- [版本与内容摘要](/docs/manifest.json)
