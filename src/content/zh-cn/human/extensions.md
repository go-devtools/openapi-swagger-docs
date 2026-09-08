---
title: "经过测试的适配器边界。"
description: "通过公开编译视图和中立效果描述框架行为。"
lang: "zh-cn"
audience: "human"
chapter: "extensions"
source: "https://github.com/go-devtools/openapi/blob/fb93d0a624f7945a0509243c5ed99fea1fbf34ea/docs/adapter-sdk.md"
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

## 保留 helper 调用上下文

分析器在推断与显式泛型调用、函数值、接收者方法和嵌套 helper 中保留具体类型参数。返回 `Envelope[User]` 的 helper 不能复用 `Envelope[string]` 的契约。替换后的字段继续从原始声明获取注释与来源证据。生成过程不会执行 helper 或 DTO 编解码器。

符合条件的 helper 仅在相同调用上下文中复用关联的返回值和协议效果：真实 Go 身份、常量、泛型参数、已知字段与 nil 事实、请求条件，以及待提交或已提交的响应状态。可变地址、捕获变量和函数值使用有界源码分析。Frontend、codec 和 transform 必须对输入及已声明的 `Options.Configuration` 保持确定性。

| 编译器选项 | 默认值 | 用途 |
| --- | --- | --- |
| `MaxSummaries` | 512 | 限制每个候选操作接纳的 helper 上下文数量 |
| `MaxSummaryBytes` | 16 MiB | 限制保留的规范化上下文与结果数据 |
| `DisableHelperSummaries` | false | 为差分检查重新分析每次 helper 调用 |

复用摘要仍消耗原有嵌套调用预算，并遵守 helper 深度。类型替换每个调用帧最多访问 4096 个类型；摘要事实最多遍历 4096 个值、深度 64。预算耗尽会产生诊断，不返回部分成功。字节计数限制保留的规范化数据，不是进程内存实测值。公开选项参与源码指纹。

## 提供调用结果对应的请求体证据

仅当某个 `RequestBody` 或 `RequestField` 结果不可能在没有请求字节时发生，才设置 `Effect.NonEmptyBody`。该中立证明独立于字段 `Required` 和显式请求体声明。核心至少需要一条已知成功的 2xx／3xx 路径，且所有成功路径都有证明，才推导整个请求体必填。未知状态或解码失败后仍成功的路径会阻止推导。`Explain` 在 `uses[].nonEmptyBody` 中保留证明及原始规则来源。

## 验证新的适配边界

使用公开 SDK 编译真实 fixture handler，关联实际标准化路由，将输出的线上字节与独立契约比较，并在 `GOWORK=off` 的独立 Go module 中运行消费者。携带响应效果的未知调用必须产生诊断。

任意堆别名、异步效果和不支持的控制流仍是限制。实现扩展前，请阅读源码参考中的回调所有权、格式能力和完整预算模型。

## 明确版本升级边界

通过模块版本固定源码 SDK。Bundle 格式 1 的 reader 接受 OpenAPI 3.2.0 以及已声明的 `oas32`、`schema2020-12`、`request-conditions-v1` 能力；未来格式、未知必需能力和未知协议字段会被拒绝。用于说明来源的 writer 字符串不必与 reader 相同。

源码 SDK 指南记录了两个真实已发布 writer：当前运行时读取其归档产物，并使用有效和无效 JSON 样本验证契约。这只证明对应普通 JSON 契约，不覆盖任意历史模块组合。构建条件匹配与源码新鲜度仍需分别检查。升级适配器的固定依赖前，先运行核心的外部消费者测试，再关闭 workspace 重新生成并验证适配器。
