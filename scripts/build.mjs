import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = {'.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'};
const dataURL = async file => `data:${types[path.extname(file)] || 'application/octet-stream'};base64,${(await readFile(file)).toString('base64')}`;
async function inlineCss(css, directory) {
  for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
    const relative = match[1].replace(/^["']|["']$/g, '');
    if (/^(data:|https?:|#)/.test(relative)) continue;
    const file = path.resolve(directory, relative);
    try { if ((await stat(file)).isFile()) css = css.replace(match[0], `url(${await dataURL(file)})`); } catch {}
  }
  return css;
}
let html = await readFile(path.join(root, 'index.html'), 'utf8');
for (const match of [...html.matchAll(/<link\b[^>]*>/g)]) {
  if (!/rel="stylesheet"/.test(match[0])) continue;
  const href = /href="([^"]+)"/.exec(match[0])?.[1];
  if (!href) continue;
  const file = path.join(root, href);
  html = html.replace(match[0], `<style>${await inlineCss(await readFile(file, 'utf8'), path.dirname(file))}</style>`);
}
for (const match of [...html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g)]) {
  html = html.replaceAll(match[0], match[0].replace(match[1], await dataURL(path.join(root, match[1]))));
}
let js = await readFile(path.join(root, 'calendar.js'), 'utf8');
js = js.replaceAll('assets/metting.svg', await dataURL(path.join(root, 'assets/metting.svg')));
html = html.replace(/<script\b[^>]*src="calendar\.js"[^>]*><\/script>/, `<script>${js.replaceAll('</script', '<\\/script')}</script>`);
if (/<script\b[^>]*src="calendar\.js"/.test(html)) throw new Error('Failed to inline calendar.js');
await mkdir(path.join(root, 'dist'), { recursive: true });
await writeFile(path.join(root, 'sig-calendar.html'), html);
await writeFile(path.join(root, 'dist/index.html'), html);
console.log('Built dist/index.html and sig-calendar.html (self-contained).');
