---
title: "适配器实现契约。"
description: "扩展已测试的公开边界，保持核心不包含框架规则。"
lang: "zh-cn"
audience: "ai"
chapter: "extensions"
source: "https://github.com/go-devtools/openapi/blob/8daf8d2e4d56822ea2969fcd12cdea395bd73c89/docs/adapter-sdk.md"
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

## Helper 与结果规则

- 保留精确泛型实例、函数身份、常量及响应／请求状态。不执行源码 helper 或 DTO 编解码器。
- 可变地址、捕获和函数值需要有界源码重分析。回调对输入及 `Options.Configuration` 保持确定性。
- `MaxSummaries=512`、`MaxSummaryBytes=16 MiB`、`DisableHelperSummaries=false`，选项参与源码指纹。字节预算表示保留的规范化数据，不是堆占用。
- 复用仍消耗调用／深度预算。类型替换每帧 4096 个类型；摘要事实 4096 个值、深度 64。超限输出诊断。
- `Effect.NonEmptyBody` 仅用于有证据的 `RequestBody`／`RequestField` 结果。请求体必填要求至少一条已知 2xx／3xx 成功路径且每条成功路径都有证明；字段必填独立。检查 `uses[].nonEmptyBody` 来源。

## 验收

真实源码 fixture → 生成 Bundle → 实际 router → 独立正反 HTTP 样本。

通过独立消费者验证真实远端固定模块、`GOWORK=off`、无 `replace`。当前仅交付 Gin；不能捏造 Fiber/Echo 导入或支持声明。任意堆别名和异步效果仍是明确边界。

## 版本

- 固定 Go SDK 版本；升级前编译并测试自定义前端。
- Bundle：格式 1、OpenAPI 3.2.0、仅接受已知必需能力；拒绝未来格式及未知字段或能力。
- 已记录的 writer/reader 样本仅是有限证据。格式可读不证明构建条件相同或源码新鲜。
