// Share the project base path across development, static checks and Pages deployment.
export const site = 'https://openapi-golang.github.io';
export const base = '/docs';

// Prefix internal routes while preserving external source references.
export function siteURL(path = '/') {
  return `${base}/${path.replace(/^\/+/, '')}`;
}
