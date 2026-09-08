---
title: "诊断决策流程。"
description: "通过结构化结果区分过期输出、无效文档和未知效果。"
lang: "zh-cn"
audience: "ai"
chapter: "validation"
source: "https://github.com/go-devtools/openapi/blob/8daf8d2e4d56822ea2969fcd12cdea395bd73c89/docs/references.md"
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

## 查看器决策

- 普通 Query／Header 示例与可编辑 URL 编码表单使用逻辑值，保留零／false。表单序列化示例仅供参考；精确 XML 请求体需 `serializedValue`。不自动抓取外部示例。
- `openapi.ui.request.blocked` 携带 `openapi.ui.multipart` 或 `openapi.ui.xmlNodeType`：禁止执行不支持的请求体投影，包含程序调用提交。
- Discriminator／XML 元数据只描述契约。Callbacks／Links 只读；Server 选项不证明外部服务行为。`openapi.ui.webhooks` 报告被省略的 Webhook 渲染。
- NDJSON／SSE 响应未结束时可收到首批字节，但 UI 仍在完成后显示。增量事件使用流式客户端。
- 保留原生 3.2。空兼容性报告是有界扫描结果，不是通用客户端认证。请求执行与 QUERY 需显式开启。

原生授权：展示弃用状态、元数据、设备端点及作用域。`openapi.ui.deviceAuthorization` 表示无设备授权提交；`openapi.ui.oauth2Metadata` 表示不自动发现配置。Bearer 提交已验证；外部 OAuth 交换未验证。
