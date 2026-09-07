---
title: "适配器实现契约。"
description: "扩展已测试的公开边界，保持核心不包含框架规则。"
lang: "zh-cn"
audience: "ai"
chapter: "extensions"
source: "https://github.com/openapi-golang/openapi/blob/5a53f75a62b8a39c46f1f53d79d456eb510c6734/docs/adapter-sdk.md"
---

## 职责契约

核心负责类型、注释、预算、中立效果、Bundle 和 OpenAPI 模型。适配器负责框架调用语义、路径标准化、handler 身份证据和挂载行为。不得导入核心 internal 包，也不得通过公开 API 暴露第三方 SSA。

## 回调契约

使用公开 `Frontend` 钩子和显式中立效果。回调必须确定，按要求同步执行，独立于网络、时间和机器路径。不得通过执行业务函数发现契约。将已加载的公开视图视为不可变，并遵守独立 Schema 的所有权规则。

## 验收证据

覆盖真实 fixture handler、实际标准化路由快照和独立样本验证。在独立模块中使用固定远端依赖、`GOWORK=off` 且无 `replace` 运行消费者。确认携带效果的未知调用仍会产生诊断。

## 尚未实现的产品

Gin 是已交付适配器，Fiber 与 Echo 仅是未来方向。不得虚构其导入路径、安装命令或支持声明。任意堆别名和异步效果仍是明确分析限制。
