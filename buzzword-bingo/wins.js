export const WIN_LINES = [
  // Rows
  [0,1,2,3,4],
  [5,6,7,8,9],
  [10,11,12,13,14],
  [15,16,17,18,19],
  [20,21,22,23,24],
  // Columns
  [0,5,10,15,20],
  [1,6,11,16,21],
  [2,7,12,17,22],
  [3,8,13,18,23],
  [4,9,14,19,24],
  // Diagonals
  [0,6,12,18,24],
  [4,8,12,16,20],
];

export function checkWins(mask) {
  return WIN_LINES.reduce((acc, line, idx) => {
    if (line.every(pos => (mask >> pos) & 1)) acc.push(idx);
    return acc;
  }, []);
}

export function getNewWins(prevWinSet, mask) {
  return checkWins(mask).filter(i => !prevWinSet.has(i));
}

export function formatWinLine(lineIdx, board25) {
  return WIN_LINES[lineIdx]
    .map(pos => board25[pos] === null ? '⭐' : board25[pos])
    .join(' · ');
}

export function buildShareText(completedLineIndices, board25) {
  const lines = completedLineIndices.map(i => formatWinLine(i, board25));
  return `Buzzword Bingo! 🎉\n${lines.join('\n')}`;
}
