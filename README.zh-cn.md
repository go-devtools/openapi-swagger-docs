# openapi-golang 文档站

[English](README.md)

面向 [openapi](https://github.com/openapi-golang/openapi) 与 [gin-swagger](https://github.com/openapi-golang/gin-swagger) 的双语文档站。人类指南和 AI 专用参考使用对应章节，顶部提供语言、读者类型及亮暗主题切换。

## 开发

使用 Node.js 24.20.0 与 pnpm 12.3.4。`packageManager` 固定 pnpm 版本，请先通过现有包管理器安装对应版本。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
pnpm preview
```

`pnpm dev` 启动本地开发服务。`pnpm build` 生成静态 `dist` 目录，并检查全部本地链接、语言与读者覆盖、原始 Markdown 一致性和源码摘要。CI 使用 `pnpm-lock.yaml` 安装并保留静态构建产物，不会发布公开站点。

## 文档与机器可读参考

在 `src/content/{en,zh-cn}/{human,ai}` 编写对应章节。每页都提供无需 JavaScript 的完整 HTML 和原始 Markdown。`/llms.txt`、`/llms-full.txt` 与 `/manifest.json` 分别提供代理发现索引、完整 AI 专用正文和固定源码版本。无需 AI 服务、API key 或上传业务源码。

源码参考对应真实固定产品提交。本站提供概览和接入参考，具体能力边界见链接的产品指南。Gin 是当前适配器，Fiber 与 Echo 仅为未来扩展方向。

## 星空

首页由独立星点聚合成组织标识的双花括号、中央层叠核心和卫星节点。星点混合自然冷暖色、不同大小与深度，不使用连线；透视、缓慢轨道运动和明暗变化维持空间动态。鼠标经过时产生局部涡流并弹性回归，拖拽可旋转星团，松开后保留惯性。方向键可旋转首页星团，Home 键复位。阅读页两侧使用具有景深和局部鼠标响应的稀疏星空。暂停按钮、减少动态偏好、页面可见性及视口状态共同控制持续动画，触屏保留原生滚动。

资源和浏览器脚本均在本地。Canvas 只承担装饰，不拦截正文链接或文字选择。项目源码注释使用英文，中文阅读内容为正式本地化文档。

## 协议

[MIT](LICENSE)。
