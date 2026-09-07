// 让开发、静态检查与 Pages 发布使用相同的项目路径。
export const site = 'https://openapi-golang.github.io';
export const base = '/docs';

// 为站内路由添加前缀，保留外部源码引用。
export function siteURL(path = '/') {
  return `${base}/${path.replace(/^\/+/, '')}`;
}
