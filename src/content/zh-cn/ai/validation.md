---
title: "诊断决策流程。"
description: "通过结构化结果区分过期输出、无效文档和未知效果。"
lang: "zh-cn"
audience: "ai"
chapter: "validation"
source: "https://github.com/openapi-golang/openapi/blob/f577090e4f47e3f7c194dc2868fb6ee9e01e6bb4/docs/references.md"
---

## 决策步骤

1. 记录命令、安装版本、target、build tags、stdout、stderr 和退出码。
2. 读取诊断 code、severity、source、route、facts 和 fix。
3. 比较源码类型、实际编解码器和声明，不要从 Swagger UI 抓取契约。
4. 修正不准确的注释，或为不支持行为添加集中公开扩展。
5. 重新生成、检查完整生成字节，并验证实际正反样本。

## 必须区分的情况

`openapi.generate.stale` 要求重新生成，不能手改生成文件。`openapi.comment.type` 表示声明约束与推导出的线上类型冲突，修改前需检查业务意图。`gin-swagger.handler.ambiguous` 需要 handler 身份证据，不能虚构 operation key。

## 离线资源

`CheckWithOptions` 接收显式 BaseURI、Resources 和 ExampleResources。检查时不得下载缺失引用。输入大小、深度和节点数必须有界。资源或预算诊断不能成为把部分契约当作完整结果的理由。

## 完成证据

源码新鲜度、结构有效性和实际样本符合性是不同声明。保留来源中的 `implementation: "not-proven"`。需要准确原生退出码时，安装固定 CLI。选中的实际路由仍必须通过运行时 Build。
