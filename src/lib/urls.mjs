// Share the project base path across development, static checks and Pages deployment.
export const site = 'https://go-devtools.github.io';
export const base = '/openapi-swagger-docs';

// Prefix internal routes while preserving external source references.
export function siteURL(path = '/') {
  return `${base}/${path.replace(/^\/+/, '')}`;
}
