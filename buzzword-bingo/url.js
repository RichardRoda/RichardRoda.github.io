function toBase64url(bytes) {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromBase64url(str) {
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
  const b64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

export function encodeBoard(words24) {
  const bytes = new TextEncoder().encode(words24.join('|'));
  return toBase64url(bytes);
}

export function decodeBoard(str) {
  try {
    const bytes = fromBase64url(str);
    const words = new TextDecoder().decode(bytes).split('|');
    return words.length === 24 ? words : null;
  } catch {
    return null;
  }
}

export function encodeMask(mask) {
  const bytes = new Uint8Array(4);
  bytes[0] = (mask >>> 24) & 0xFF;
  bytes[1] = (mask >>> 16) & 0xFF;
  bytes[2] = (mask >>> 8) & 0xFF;
  bytes[3] = mask & 0xFF;
  return toBase64url(bytes);
}

export function decodeMask(str) {
  try {
    const bytes = fromBase64url(str);
    return (((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0);
  } catch {
    return 1 << 12;
  }
}

// board25: 25-element array, board25[12] === null (FREE)
export function buildHash(board25, mask = null) {
  const words24 = [...board25.slice(0, 12), ...board25.slice(13)];
  const boardStr = encodeBoard(words24);
  if (mask === null) return boardStr;
  return `${boardStr}.${encodeMask(mask)}`;
}

// Returns { board25, mask } or null
export function parseHash(hash) {
  try {
    const raw = (hash ?? '').replace(/^#/, '');
    if (!raw) return null;
    const dotIdx = raw.lastIndexOf('.');
    const boardStr = dotIdx === -1 ? raw : raw.slice(0, dotIdx);
    const maskStr  = dotIdx === -1 ? null : raw.slice(dotIdx + 1);
    const words24 = decodeBoard(boardStr);
    if (!words24) return null;
    const board25 = [...words24.slice(0, 12), null, ...words24.slice(12)];
    let mask = maskStr ? decodeMask(maskStr) : (1 << 12);
    mask |= (1 << 12); // FREE always set
    return { board25, mask };
  } catch {
    return null;
  }
}
