import { wordColor } from './board.js';
import { WIN_LINES, formatWinLine } from './wins.js';

export function renderGrid(board25, mask, onToggle) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let pos = 0; pos < 25; pos++) {
    const isFree   = pos === 12;
    const isMarked = isFree || Boolean((mask >> pos) & 1);
    const cell = document.createElement('button');
    cell.className = 'cell' + (isFree ? ' free' : '') + (isMarked ? ' marked' : '');
    cell.dataset.pos = pos;

    if (isFree) {
      cell.textContent = '⭐ FREE';
      cell.disabled = true;
    } else {
      cell.textContent = board25[pos];
      cell.style.setProperty('--cell-color', wordColor(board25[pos]));
      cell.addEventListener('click', () => onToggle(pos));
    }

    grid.appendChild(cell);
  }
  return grid;
}

export function updateCell(cellEl, marked) {
  cellEl.classList.toggle('marked', marked);
}

export function highlightWinLine(gridEl, lineIdx) {
  for (const pos of WIN_LINES[lineIdx]) {
    const cell = gridEl.querySelector(`[data-pos="${pos}"]`);
    if (!cell) continue;
    cell.classList.remove('won');
    // force reflow so animation restarts if triggered twice
    void cell.offsetWidth;
    cell.classList.add('won');
  }
}

export function renderBanner(completedLineIndices, board25) {
  const banner = document.createElement('div');
  banner.className = 'banner';

  const h2 = document.createElement('h2');
  h2.textContent = 'Bingo! 🎉';
  banner.appendChild(h2);

  for (const lineIdx of completedLineIndices) {
    const p = document.createElement('p');
    p.className = 'win-line';
    p.textContent = formatWinLine(lineIdx, board25);
    banner.appendChild(p);
  }

  const shareGroup = document.createElement('div');
  shareGroup.className = 'share-group';

  const copyTextBtn = document.createElement('button');
  copyTextBtn.className = 'copy-text-btn';
  copyTextBtn.textContent = 'Copy for sharing';
  shareGroup.appendChild(copyTextBtn);

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = 'Copy link';
  shareGroup.appendChild(copyBtn);
  banner.appendChild(shareGroup);

  const dismissBtn = document.createElement('button');
  dismissBtn.className = 'dismiss-btn';
  dismissBtn.textContent = 'Keep playing';
  banner.appendChild(dismissBtn);

  return banner;
}

export function showBanner(bannerEl) {
  // Must be in DOM before toggling class so transition fires
  requestAnimationFrame(() => bannerEl.classList.add('visible'));
}

export function hideBanner(bannerEl) {
  bannerEl.remove();
}
