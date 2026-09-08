---
title: "依据证据完成接入。"
description: "供编程代理与自动化使用的专用契约参考。"
lang: "zh-cn"
audience: "ai"
chapter: "overview"
source: "https://github.com/go-devtools/openapi/blob/8daf8d2e4d56822ea2969fcd12cdea395bd73c89/docs/ai-integration.md"
---

## 安装首个版本

两个公开 Go module 都从 **v0.0.1** 开始。在自己的业务模块中执行：

```sh
go get github.com/go-devtools/openapi@v0.0.1
go get github.com/go-devtools/gin-swagger@v0.0.1
go install github.com/go-devtools/gin-swagger/cmd/gin-swagger@v0.0.1
gin-swagger version
```

无需私有令牌或本地 `replace`，适配器固定依赖 `openapi v0.0.1`。预编译 CLI、源码和校验和见 [openapi 发布页](https://github.com/go-devtools/openapi/releases/tag/v0.0.1)及 [gin-swagger 发布页](https://github.com/go-devtools/gin-swagger/releases/tag/v0.0.1)。

稳定主线 main、下一版本 develop、维护线 `release/0.0` 和修复线 `hotfix/0.0.2` 分别管理。准备新版本前阅读[发布流程](https://github.com/go-devtools/gin-swagger/blob/main/CONTRIBUTING.zh-cn.md)。版本不可覆盖；CLI 与业务使用的适配器固定为同一版本。

## 契约

- Go 1.27.1；Gin 1.12.0；原生 OpenAPI 3.2。
- 从 [manifest.json](/openapi-swagger-docs/manifest.json) 读取固定模块版本；CLI 与应用的适配器版本一致。
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

- [索引](/openapi-swagger-docs/llms.txt)
- [完整 AI 正文](/openapi-swagger-docs/llms-full.txt)
- [版本与内容摘要](/openapi-swagger-docs/manifest.json)
