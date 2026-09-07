---
title: "Gin 接入流程。"
description: "生成、解释、挂载并验证，保持业务行为不变。"
lang: "zh-cn"
audience: "ai"
chapter: "gin"
source: "https://github.com/openapi-golang/gin-swagger/blob/9536d021c64f58bc8bf5149ea15dc50e5b207f60/docs/ai-integration.md"
---

## 前置条件

使用 Go 1.27.1、应用实际的 Gin 依赖和真实固定模块版本。独立验收时设置 `GOWORK=off`，移除开发用 replace。先下载依赖再生成，默认生成预算为一分钟。

## 生成与挂载

1. 在应用根目录执行 `gin-swagger generate --dir . --output ./internal/apidoc`。
2. 按应用实际 module 路径导入生成包。
3. 照常注册既有路由，在启动服务前执行 `ginswagger.Mount(engine, apidoc.Bundle(), config)`。
4. 在 CI 运行 `gin-swagger check --dir . --output ./internal/apidoc`。

安装与适配器相同固定版本的 CLI。不得手改 `zz_openapi.gen.go`，不得包装既有 handler 改变身份，不得给 DTO 增加文档 tag。

## 解释不确定性

使用真实 symbol 执行 `gin-swagger explain --dir . --symbol module/pkg.DTO.Field`。查询 handler 响应时加 `--response 201`。解释包含来源和声明，解释成功不等于实际路由验证成功。

## UI 设置

`Config.Groups` 创建完整文档分类，tags 在每个文档内部组织操作。每组与 `Config.Include` 取交集。示例只使用 Bearer 并禁用 tag 过滤。允许请求时必须显式指定 `UI.SubmitMethods`。

## 验证

比较挂载文档前后的既有路由行为。检查选中模板诊断、运行时构建条件和实际 HTTP 样本。只有经过测试的集中规则或准确声明能解决未知行为，不能直接移除未解决诊断。
