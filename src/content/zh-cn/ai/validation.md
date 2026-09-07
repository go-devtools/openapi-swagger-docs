---
title: "诊断决策流程。"
description: "通过结构化结果区分过期输出、无效文档和未知效果。"
lang: "zh-cn"
audience: "ai"
chapter: "validation"
source: "https://github.com/openapi-golang/openapi/blob/365458867d54082e317bbb1f1770e6b34cdb7f25/docs/references.md"
---

## 流程

1. 记录 CLI 版本、命令、目标、build tags、stdout、stderr 和退出码。
2. 读取诊断 `code`、`severity`、`source`、`route`、`facts`、`fix`。
3. 对照源类型、实际 codec 与声明；修正错误元数据或增加经过测试的公开扩展。
4. 重新生成，检查完整生成字节，并验证实际正反样本。

## 处理

| 诊断 | 动作 |
| --- | --- |
| `openapi.generate.stale` | 重新生成；不手改生成字节。 |
| `openapi.comment.type` | 将声明与线类型核对一致。 |
| `gin-swagger.handler.ambiguous` | 先获取身份依据，再设置 Bindings。 |
| `gin-swagger.routes.stale` | 恢复与当前路由一致的原始快照。 |
| 引用／预算错误 | 明确提供离线资源或有界预算；不得返回部分成功。 |

`CheckWithOptions` 接收 `BaseURI`、`Resources`、`ExampleResources`；不自动抓取缺失引用。源码新鲜度、文档有效性、运行时一致性分别证明。保留 `implementation: "not-proven"`；选中路由仍须通过 Build。

`gin-swagger check --spec FILE --max-bytes=8388608 --timeout=30s` 通过公开 `checkio.ReadFile` 限制本地输入；非普通文件、超限、取消和阶段超时返回失败。取消为协作式。整段查询 UI 只读，流式单项面板独立于完整消息 Schema。文档合法不证明客户端序列化正确。
