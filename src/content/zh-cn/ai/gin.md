---
title: "Gin 接入流程。"
description: "生成、解释、挂载并验证，保持业务行为不变。"
lang: "zh-cn"
audience: "ai"
chapter: "gin"
source: "https://github.com/go-devtools/gin-swagger/blob/659f752b8890a0293ffeddcf6d02ac41e9646d30/docs/ai-integration.md"
---

## 接入

1. 固定 Go 1.27.1、Gin 1.12.0、适配器与核心版本。
2. 生成 `internal/apidoc`，通过应用真实 module 路径导入。
3. 保留既有路由注册；服务启动前调用 `ginswagger.Mount(engine, apidoc.Bundle(), config)`。
4. CI 检查源码新鲜度；比较挂载前后的实际响应。

## 运行时规则

- `Config.OpenAPI`：核心配置。`Groups`：完整文档分类。Tags：文档内分组。分组过滤与 `Include` 取交集。
- 示例仅使用 Bearer；执行请求必须明确配置 `UI.SubmitMethods`。
- 含转义静态冒号且需初始化后 Build 时，在 Run/ServeHTTP 前保存完整 `Engine.Routes()` 到 `Config.RegisteredRoutes`。过期快照必须报错。
- 编码遵循 Engine 实际开关。`UseEscapedPath` 优先于 `UseRawPath`；raw 回退可能受参数转义影响，检查 `x-gin-raw-path-note`。
- 歧义 handler 需证据及集中 `Bindings`，键为原始 METHOD/path。不能用代码地址推断闭包状态。

## 输入与文件边界

- 检查 JSON 错误并拒绝返回，可建立请求体必填证明。忽略错误或失败后仍成功会阻止推导；强制绑定保留已提交错误。表单属性必填独立判断。
- 自动方法／媒体条件分别保留，存在性冲突输出诊断；检查 Explain `nonEmptyBody`。自定义输入流替换需显式规则。
- 原始查询值保持字符串。`Atoi`／`ParseInt` 错误按实际检查或忽略分支处理，忽略后可能返回零／饱和值。UTF-8 字节长度不是 Schema 字符长度。
- 文件方法需要完整集中 `CallOutcomes`：精确身份／资源／方法、媒体、范围、前置条件、失败及声明来源。固定文本 fixture 验证 GET／HEAD 与 404，不证明任意文件或所有 403／500 原因。

## 诊断

使用真实符号执行 `gin-swagger explain --dir . --symbol module/pkg.DTO.Field`；handler 响应加 `--response 201`。保留未解决效果；不得手改生成文件、增加 DTO tag 或包装业务 handler 来掩盖诊断。
