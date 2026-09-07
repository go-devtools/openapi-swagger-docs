---
title: "检查契约，验证行为。"
description: "区分文档有效性、源码新鲜度和实际样本提供的证据。"
lang: "zh-cn"
audience: "human"
chapter: "validation"
source: "https://github.com/openapi-golang/openapi/blob/c9afc2b2a8db6a881fce7f56fbd988e4b198fe44/docs/contracttest.md"
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
