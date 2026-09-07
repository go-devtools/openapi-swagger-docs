---
title: "经过测试的适配器边界。"
description: "通过公开编译视图和中立效果描述框架行为。"
lang: "zh-cn"
audience: "human"
chapter: "extensions"
source: "https://github.com/openapi-golang/openapi/blob/f577090e4f47e3f7c194dc2868fb6ee9e01e6bb4/docs/adapter-sdk.md"
---

## 明确职责归属

核心负责 Go 类型投影、普通注释语义、分析预算、中立效果、Bundle 数据和原生文档模型。适配器负责框架调用语义、路径语法、handler 证据和挂载。适配器不得导入核心 `internal` 包。

Gin 是当前交付的框架产品。Fiber 与 Echo 只是未来扩展方向，没有已实现的适配器或可用导入路径。

## 公开扩展点

| 需求 | 公开边界 |
| --- | --- |
| 识别框架调用 | `Frontend.Match`、`Entry`、`Call`、`Return` |
| 关联返回值与效果 | `CallOutcomes`、`CallOutcome` |
| 表达非 JSON 数据 | `WireCodec`、`WireTypeCodec` |
| 描述响应提交和帧格式 | `ResponseHeader`、`ResponseCommit`、`ResponseItem` |
| 建模同步回调 | `CallbackPlan`、`CallbackRepeat` |

回调必须确定，不得执行业务函数，也不能根据时钟、网络或机器路径推导契约。公开源码视图只读，Schema 回调接收独立数据，递归回调仍按同步规则执行。

## 验证新的适配边界

使用公开 SDK 编译真实 fixture handler，关联实际标准化路由，将输出的线上字节与独立契约比较，并在 `GOWORK=off` 的独立 Go module 中运行消费者。携带响应效果的未知调用必须产生诊断。

任意堆别名、异步效果和不支持的控制流仍是限制。实现扩展前，请阅读源码参考中的回调所有权、格式能力和完整预算模型。
