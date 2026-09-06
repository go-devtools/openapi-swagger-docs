// Synchronize the theme without requiring a framework or changing the document route.
document.querySelector<HTMLButtonElement>('[data-theme-toggle]')?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('openapi-theme', theme); } catch {}
  window.dispatchEvent(new Event('themechange'));
});

// Start compact on phones while leaving a fully expanded no-script navigation.
if (matchMedia('(max-width: 650px)').matches) {
  const contents = document.querySelector<HTMLDetailsElement>('.mobile-contents');
  if (contents) contents.open = false;
}

// Keep copy actions progressive: code remains selectable when clipboard access fails.
document.querySelectorAll<HTMLElement>('article pre').forEach((pre) => {
  const lang = document.documentElement.lang === 'zh-cn';
  const button = document.createElement('button');
  button.className = 'copy-code';
  button.textContent = lang ? '复制' : 'Copy';
  button.setAttribute('aria-label', lang ? '复制代码' : 'Copy code');
  const status = document.createElement('span');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.querySelector('code')?.textContent ?? '');
      button.textContent = lang ? '已复制' : 'Copied';
    } catch { button.textContent = lang ? '复制失败' : 'Copy failed'; }
    status.textContent = button.textContent;
    setTimeout(() => { button.textContent = lang ? '复制' : 'Copy'; }, 1800);
  });
  pre.append(button, status);
});
