import { siteURL } from './urls.mjs';

// Explicit routes preserve the selected chapter across language and audience changes.
export type Language = 'en' | 'zh-cn';
export type Audience = 'human' | 'ai';
export const languages: Language[] = ['en', 'zh-cn'];
export const audiences: Audience[] = ['human', 'ai'];
export const chapters = ['overview', 'schemas', 'validation', 'gin', 'extensions'] as const;
export const labels = {
  en: { docs: 'Documentation', examples: 'Examples', human: 'Human', language: 'Language', audience: 'Documentation audience', core: 'Core', adapters: 'Framework adapters', overview: 'Overview', schemas: 'Schemas', validation: 'Validation', gin: 'Gin', extensions: 'Extension boundaries', toc: 'On this page', menu: 'Contents', raw: 'Raw Markdown', source: 'Source reference', copy: 'Copy', copied: 'Copied', failed: 'Copy failed', skip: 'Skip to content', pause: 'Pause stars', resume: 'Animate stars', star: 'Interactive go-devtools star cluster. Drag or use arrow keys to rotate; Home resets the view.' },
  'zh-cn': { docs: '文档', examples: '示例', human: '人类', language: '语言', audience: '文档读者', core: '核心', adapters: '框架适配器', overview: '概览', schemas: 'Schema', validation: '验证', gin: 'Gin', extensions: '扩展边界', toc: '本页目录', menu: '文档目录', raw: '原始 Markdown', source: '源码参考', copy: '复制', copied: '已复制', failed: '复制失败', skip: '跳到正文', pause: '暂停星辰', resume: '启用星辰动画', star: 'go-devtools 交互星系团。拖拽或使用方向键旋转，Home 键复位。' },
};

// Keep links deterministic so crawlers and no-script readers see the same content.
export function docURL(lang: Language, audience: Audience, chapter = 'overview') {
  return siteURL(`/${lang}/${audience}/${chapter}/`);
}
