---
title: "适配器实现契约。"
description: "扩展已测试的公开边界，保持核心不包含框架规则。"
lang: "zh-cn"
audience: "ai"
chapter: "extensions"
source: "https://github.com/openapi-golang/openapi/blob/fcf841bbe00b5b4eba977dc8ab191b89a2065aa0/docs/adapter-sdk.md"
---

## 职责

- 核心：类型、注释、预算、中立效果、Bundle、OpenAPI 与 Schema 校验。
- 适配器：框架调用及 codec、handler 证据、真实路由、路径转换与挂载。
- 仅使用公开 SDK；不访问核心 internal，不在公开 API 暴露第三方 SSA。

## 实现

- 使用 `Frontend` 钩子与明确的中立效果。
- 回调确定、有界，并遵循同步要求。
- 加载视图只读；遵守独立 Schema 的所有权。
- 不执行业务函数来探测行为，不隐藏未知效果。

## 验收

真实源码 fixture → 生成 Bundle → 实际 router → 独立正反 HTTP 样本。

通过独立消费者验证真实远端固定模块、`GOWORK=off`、无 `replace`。当前仅交付 Gin；不能捏造 Fiber/Echo 导入或支持声明。任意堆别名和异步效果仍是明确边界。

## 版本

- 固定 Go SDK 版本；升级前编译并测试自定义前端。
- Bundle：格式 1、OpenAPI 3.2.0、仅接受已知必需能力；拒绝未来格式及未知字段或能力。
- 已记录的 writer/reader 样本仅是有限证据。格式可读不证明构建条件相同或源码新鲜。
