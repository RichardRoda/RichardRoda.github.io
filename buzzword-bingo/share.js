import { buildHash } from './url.js';

export function buildWinningUrl(board25, mask) {
  const hash = buildHash(board25, mask);
  return `${location.origin}${location.pathname}#${hash}`;
}

export function shareToX(text, url) {
  const p = new URLSearchParams({ text, url });
  window.open(`https://x.com/intent/tweet?${p}`, '_blank', 'noopener');
}

export function shareToLinkedIn(url) {
  const p = new URLSearchParams({ url });
  window.open(`https://www.linkedin.com/sharing/share-offsite/?${p}`, '_blank', 'noopener');
}

export function shareToFacebook(text, url) {
  const p = new URLSearchParams({ u: url, quote: text });
  window.open(`https://www.facebook.com/sharer/sharer.php?${p}`, '_blank', 'noopener');
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
