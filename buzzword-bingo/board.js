const PALETTE = [
  '#c0392b', '#d35400', '#27ae60', '#16a085',
  '#2980b9', '#8e44ad', '#d81b60', '#00838f',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildBoard(wordsData) {
  const { words } = wordsData;
  const selected = words.length === 24 ? [...words] : shuffle(words).slice(0, 24);
  return [...selected.slice(0, 12), null, ...selected.slice(12)];
}

export function wordColor(word) {
  let h = 5381;
  for (let i = 0; i < word.length; i++) {
    h = ((h << 5) + h) ^ word.charCodeAt(i);
    h = h & 0xFFFF;
  }
  return PALETTE[Math.abs(h) % PALETTE.length];
}
