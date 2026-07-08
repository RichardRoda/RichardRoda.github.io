import { parseHash, buildHash } from './url.js';
import { buildBoard } from './board.js';
import { WIN_LINES, checkWins, getNewWins, buildShareText } from './wins.js';
import { renderGrid, updateCell, highlightWinLine, renderBanner, showBanner, hideBanner } from './render.js';
import { buildWinningUrl, copyLink, copyShareText } from './share.js';

const boardContainer  = document.getElementById('board-container');
const bannerContainer = document.getElementById('banner-container');
const newGameBtn      = document.getElementById('new-game');

let board25        = null;
let mask           = 1 << 12;
let completedLines = [];
let wonSet         = new Set();
let wordsData      = null;
let gridEl         = null;
let fetchInFlight  = false;

function showError(msg, onRetry) {
  boardContainer.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'status-msg';
  const p = document.createElement('p');
  p.textContent = msg;
  div.appendChild(p);
  if (onRetry) {
    const btn = document.createElement('button');
    btn.textContent = 'Retry';
    btn.addEventListener('click', onRetry);
    div.appendChild(btn);
  }
  boardContainer.appendChild(div);
}

async function fetchWords() {
  const res = await fetch('words.json');
  if (!res.ok) throw new Error('fetch failed');
  const data = await res.json();
  if (!data.words || data.words.length < 24) {
    throw new Error(`Word list too short — need at least 24 words (got ${data.words?.length ?? 0})`);
  }
  return data;
}

function mountGrid(b25, m) {
  board25 = b25;
  mask    = m;
  gridEl  = renderGrid(board25, mask, onToggle);
  boardContainer.innerHTML = '';
  boardContainer.appendChild(gridEl);
}

function onToggle(pos) {
  mask ^= (1 << pos);
  const isMarked = Boolean((mask >> pos) & 1);
  updateCell(gridEl.querySelector(`[data-pos="${pos}"]`), isMarked);
  location.hash = buildHash(board25, mask);

  // Check for newly completed lines
  const newWins = getNewWins(wonSet, mask);
  for (const lineIdx of newWins) {
    completedLines.push(lineIdx);
    wonSet.add(lineIdx);
    highlightWinLine(gridEl, lineIdx);
  }

  // Remove lines that are no longer complete (cell was unmarked)
  for (const lineIdx of [...wonSet]) {
    if (!WIN_LINES[lineIdx].every(p => (mask >> p) & 1)) {
      wonSet.delete(lineIdx);
    }
  }
  // Sync completedLines order (preserve order, remove uncompleted)
  completedLines = completedLines.filter(i => wonSet.has(i));

  if (newWins.length > 0) showWinBanner();
}

function showWinBanner() {
  // Remove any existing banner
  const existing = bannerContainer.querySelector('.banner');
  if (existing) existing.remove();

  // Only include lines whose squares are still all marked
  const activeLines = completedLines.filter(lineIdx =>
    WIN_LINES[lineIdx].every(pos => (mask >> pos) & 1)
  );

  const winningUrl = buildWinningUrl(board25, mask);
  const shareText  = buildShareText(activeLines, board25);

  const bannerEl = renderBanner(activeLines, board25);
  bannerContainer.appendChild(bannerEl);

  bannerEl.querySelector('.copy-text-btn').addEventListener('click', e =>
    copyShareText(shareText, winningUrl, e.currentTarget));
  bannerEl.querySelector('.copy-btn').addEventListener('click', e =>
    copyLink(winningUrl, e.currentTarget));
  bannerEl.querySelector('.dismiss-btn').addEventListener('click', () =>
    hideBanner(bannerEl));

  showBanner(bannerEl);
}

async function startNewGame() {
  if (fetchInFlight) return;
  bannerContainer.innerHTML = '';
  try {
    const shouldRefetch = !wordsData || wordsData.words.length === 24;
    if (shouldRefetch) {
      fetchInFlight = true;
      wordsData = await fetchWords();
    }
  } catch (err) {
    showError(err.message, startNewGame);
    return;
  } finally {
    fetchInFlight = false;
  }
  completedLines = [];
  wonSet         = new Set();
  const freshBoard = buildBoard(wordsData);
  mountGrid(freshBoard, 1 << 12);
  location.hash = buildHash(board25, null);
}

function init() {
  const parsed = parseHash(location.hash);

  if (parsed) {
    // Restore from URL — render immediately, no fetch needed yet
    completedLines = [];
    wonSet         = new Set();
    mountGrid(parsed.board25, parsed.mask);

    const alreadyWon = checkWins(parsed.mask);
    for (const lineIdx of alreadyWon) {
      completedLines.push(lineIdx);
      wonSet.add(lineIdx);
      highlightWinLine(gridEl, lineIdx);
    }
    if (alreadyWon.length > 0) showWinBanner();
  } else {
    // No valid hash — fetch words and build fresh board
    fetchWords()
      .then(data => {
        wordsData = data;
        const freshBoard = buildBoard(wordsData);
        mountGrid(freshBoard, 1 << 12);
        location.hash = buildHash(board25, null);
      })
      .catch(err => showError(err.message, () => location.reload()));
  }
}

newGameBtn.addEventListener('click', startNewGame);
init();
