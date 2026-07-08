import { buildHash } from './url.js';

export function buildWinningUrl(board25, mask) {
  const hash = buildHash(board25, mask);
  return `${location.origin}${location.pathname}#${hash}`;
}

export async function copyShareText(text, url, btnEl) {
  const combined = `${text}\n\nTo see the board:\n${url}`;
  try {
    await navigator.clipboard.writeText(combined);
    const original = btnEl.textContent;
    btnEl.textContent = 'Copied!';
    setTimeout(() => { btnEl.textContent = original; }, 2000);
  } catch {
    const input = document.createElement('input');
    input.type = 'text';
    input.readOnly = true;
    input.value = combined;
    input.className = 'copy-fallback';
    btnEl.replaceWith(input);
    input.select();
  }
}

export async function copyLink(url, copyBtnEl) {
  try {
    await navigator.clipboard.writeText(url);
    const original = copyBtnEl.textContent;
    copyBtnEl.textContent = 'Copied!';
    setTimeout(() => { copyBtnEl.textContent = original; }, 2000);
  } catch {
    const input = document.createElement('input');
    input.type = 'text';
    input.readOnly = true;
    input.value = url;
    input.className = 'copy-fallback';
    copyBtnEl.replaceWith(input);
    input.select();
  }
}
