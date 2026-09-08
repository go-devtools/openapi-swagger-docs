---
title: "检查契约，验证行为。"
description: "区分文档有效性、源码新鲜度和实际样本提供的证据。"
lang: "zh-cn"
audience: "human"
chapter: "validation"
source: "https://github.com/go-devtools/openapi/blob/8daf8d2e4d56822ea2969fcd12cdea395bd73c89/docs/contracttest.md"
---

## 三种不同的检查

| 检查 | 能够证明的内容 |
| --- | --- |
| `openapi check --spec` | 文档结构、已支持的语义检查和离线引用 |
| `gin-swagger check --dir --output` | 生成字节与当前源码和构建输入一致 |
| 使用实际样本的 `contracttest` | 提供的样本符合已声明契约 |

其中任何一项都不能单独证明所有执行路径已经实现某条业务规则。请向现有应用发送实际的正向与反向请求进行验证。

## 检查输入文档

在核心仓库中运行：

```sh
GOWORK=off go run ./cmd/openapi check --spec ./testdata/golden/openapi32-full.json
```

`CheckWithOptions` 接收明确的基础 URI、预加载的 OpenAPI / JSON Schema 资源及原始外部示例。检查过程不会下载引用。显式提供有界资源，缺失资源会产生诊断，不会触发任意 URL 请求。

## 根据诊断判断结果

读取诊断 code、severity、source、route、facts 和 fix。检查成功退出 0，文档错误退出 1，参数语法错误退出 2。安装后的 CLI 可直接提供原生退出码，`go run` 会包装程序失败。

在提供来源分类的位置，`Source.Kind` 区分推导、声明和未解决行为。解释中的 `implementation: "not-proven"` 表示声明尚未被证明是业务执行约束。

## 当前原生能力边界

检查器在官方 Schema 基础上补充了有测试覆盖的 Example、Discriminator 和 XML 字段检查及显式布尔存在性，但尚未认证所有 discriminator 组合继承场景或 XML 使用位置的名称推断。Swagger UI 渲染能力也独立于文档有效性。

独立验证器接收预加载资源，使用另一个引擎检查实际样本。源码参考说明了参数、预算、递归和流式数据的限制。

## 限制本地输入

```sh
gin-swagger check --spec ./openapi.json --max-bytes=8388608 --timeout=30s
```

两个 CLI 通过核心可选的 `checkio.ReadFile` 读取明确指定的本地文件。Gin 默认输入上限为 8 MiB，允许文件恰好达到边界。超限、非普通文件、取消和超时都会返回失败，不会继续报告成功。超时在读取与有界验证阶段之间协作检查，不能强制中断内核调用。`--max-bytes` 仅适用于 `check --spec`。

## 核对查看器的实际能力

文档有效不代表每个功能都有可用客户端。共享 UI 保留原生 OpenAPI 3.2，并在不修改源文档的情况下报告限制。

| 功能 | 已验证的查看器行为 |
| --- | --- |
| 普通 Query／Header 与 URL 编码示例 | 选择和编辑后保留零、false 等逻辑值，实际提交已有验证 |
| Discriminator、XML 与外部文档元数据 | 展示元数据，不将判别提示当作实例验证或分支选择 |
| 位置编码或非表单 multipart | 定位限制，同时阻止 Execute 和程序调用提交 |
| XML `nodeType` 缺少显式序列化示例 | 阻止提交，不捏造线上文本 |
| Callbacks 与 Links | 只读展示关系和表达式，不声明回调投递或链接遍历已实现 |
| 根级及操作级 Server | 展示可选项及操作覆盖 |
| 固定渲染器省略的 Webhooks | 输出定位警告，也覆盖仅含 Webhook 的文档 |
| 整段查询参数 | 只读，固定渲染器会遗漏其提交值 |

流式 `itemSchema` 面板独立于完整消息 Schema。真实分阶段 NDJSON／SSE 检查证明服务器响应未结束时客户端已收到首批字节，但固定 UI 仅在响应完成后显示输出。需要逐条观察长连接事件时，请使用流式客户端。有限消息的分帧检查不能证明 UI 支持增量渲染。

QUERY 和所有请求执行都需要显式开启。省略的扩展方法与标签元数据会产生兼容性提示。兼容性报告为空仅表示未发现已列举的限制，不证明任意序列化器可用。具体范围见[实际验证的 UI 边界](https://github.com/go-devtools/openapi/blob/8daf8d2e4d56822ea2969fcd12cdea395bd73c89/docs/swaggerui-compatibility.md)。

## 查看器中的授权

原生安全定义会显示弃用状态、OAuth 元数据地址、设备授权端点和作用域说明。设备授权保持只读：当前查看器不执行设备授权交换，也不会抓取元数据自动发现配置；弹窗会说明限制，并且不提供设备授权提交按钮。普通 OAuth 表单继续可用，本地 Bearer 请求已实际验证。Gin 基础示例仍只提供 Bearer。
