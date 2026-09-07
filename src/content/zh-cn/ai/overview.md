---
title: "依据证据完成接入。"
description: "供编程代理与自动化使用的专用契约参考。"
lang: "zh-cn"
audience: "ai"
chapter: "overview"
source: "https://github.com/openapi-golang/openapi/blob/5a53f75a62b8a39c46f1f53d79d456eb510c6734/docs/ai-integration.md"
---

## 接入契约

1. 只使用公开 SDK 包，框架行为由适配器负责。
2. 保持既有 handler 内容、签名、路由注册和 DTO tag 不变。
3. 通过诊断报告不确定性，不得为通过生成而虚构响应。

## 操作流程

在 Gin 仓库中执行：

```sh
GOWORK=off go mod download
GOWORK=off go run ./cmd/gin-swagger generate --dir ./examples/basic --output ./internal/apidoc
GOWORK=off go run ./cmd/gin-swagger check --dir ./examples/basic --output ./internal/apidoc
```

用于消费者应用时，指定实际源码目录，CLI 与模块使用同一固定版本。判断诊断前记录 `version` 输出。生成成功不代表所有选中路由都能成功 Build。

## 机器可读入口

- [llms.txt](/llms.txt)：精简发现索引。
- [llms-full.txt](/llms-full.txt)：显式区分中英文的完整 AI 文档正文。
- [manifest.json](/manifest.json)：固定上游版本、文档身份和源文件 SHA-256 摘要。

## 证据规则

分别解析 stdout JSON 与 stderr，并检查进程状态。原生 CLI 成功为 0，运行或文档错误为 1，参数语法错误为 2。`go run` 不提供原生退出码接口。必须保留 `implementation: "not-proven"` 的原始含义。使用这些文档无需 AI 服务、密钥或上传业务源码。
