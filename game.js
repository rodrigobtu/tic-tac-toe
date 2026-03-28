/**
 * Sliding Photo Puzzle
 *
 * The photo is divided into N×N tiles with one blank space.
 * Tap a tile adjacent to the blank to slide it into the gap.
 * Goal: reconstruct the original photo.
 *
 * Tile image slicing uses CSS background-size / background-position:
 *   background-size:     N*100%  N*100%
 *   background-position: (col/(N-1)*100)%  (row/(N-1)*100)%
 */

const IMG = 'images/IMG_3440.jpeg';

// ── State ──────────────────────────────────────────────────────────────────

let N      = 3;    // grid dimension
let tiles  = [];   // tiles[position] = tileValue  (N²-1 = blank)
let moves  = 0;
let solved = false;

// ── DOM ────────────────────────────────────────────────────────────────────

const boardEl      = document.getElementById('board');
const movesEl      = document.getElementById('moves');
const winOverlay   = document.getElementById('win-overlay');
const winMovesEl   = document.getElementById('win-moves');
const winNewBtn    = document.getElementById('win-new');
const newGameBtn   = document.getElementById('new-game');
const previewBtn   = document.getElementById('show-preview');
const previewEl    = document.getElementById('preview-overlay');
const sizeBtns     = document.querySelectorAll('.size-btn');

// ── Preview open / close ───────────────────────────────────────────────────
// closePreview is global so the inline ontouchstart attribute can call it.

function openPreview()  { previewEl.classList.add('open'); }
window.closePreview = function () { previewEl.classList.remove('open'); };

// ── Puzzle logic ───────────────────────────────────────────────────────────

function neighbors(pos) {
  const r = Math.floor(pos / N), c = pos % N;
  const out = [];
  if (r > 0)   out.push(pos - N);
  if (r < N-1) out.push(pos + N);
  if (c > 0)   out.push(pos - 1);
  if (c < N-1) out.push(pos + 1);
  return out;
}

function shuffle() {
  tiles = Array.from({ length: N * N }, (_, i) => i);
  let blank    = N * N - 1;
  let prevBlank = -1;
  const steps  = N === 3 ? 300 : 500;

  for (let i = 0; i < steps; i++) {
    const ns   = neighbors(blank).filter(n => n !== prevBlank);
    const next = ns[Math.floor(Math.random() * ns.length)];
    [tiles[blank], tiles[next]] = [tiles[next], tiles[blank]];
    prevBlank = blank;
    blank     = next;
  }
}

function isSolved() {
  return tiles.every((v, i) => v === i);
}

function handleTap(pos) {
  if (solved) return;
  const blank = tiles.indexOf(N * N - 1);
  if (!neighbors(blank).includes(pos)) return;

  [tiles[blank], tiles[pos]] = [tiles[pos], tiles[blank]];
  moves++;
  movesEl.textContent = moves;

  renderTile(blank);
  renderTile(pos);

  if (isSolved()) {
    solved = true;
    winMovesEl.textContent = `${moves} move${moves !== 1 ? 's' : ''}`;
    winOverlay.classList.add('open');
  }
}

// ── Rendering ──────────────────────────────────────────────────────────────

function tileStyle(val) {
  const col = val % N;
  const row = Math.floor(val / N);
  const bpx = N === 1 ? 0 : (col / (N - 1)) * 100;
  const bpy = N === 1 ? 0 : (row / (N - 1)) * 100;
  return {
    bgSize: `${N * 100}% ${N * 100}%`,
    bgPos:  `${bpx}% ${bpy}%`,
  };
}

function renderTile(pos) {
  const el  = boardEl.children[pos];
  if (!el) return;
  const val     = tiles[pos];
  const isBlank = val === N * N - 1;

  el.className = 'tile' + (isBlank ? ' blank' : '');
  el.disabled  = isBlank;

  if (isBlank) {
    el.style.cssText = '';
  } else {
    const { bgSize, bgPos } = tileStyle(val);
    el.style.backgroundImage    = `url('${IMG}')`;
    el.style.backgroundSize     = bgSize;
    el.style.backgroundPosition = bgPos;
  }
}

function renderBoard() {
  boardEl.style.setProperty('--n', N);
  boardEl.innerHTML = '';
  for (let pos = 0; pos < N * N; pos++) {
    const btn = document.createElement('button');
    boardEl.appendChild(btn);
    renderTile(pos);
    btn.addEventListener('click', () => handleTap(pos));
  }
}

// ── Game control ───────────────────────────────────────────────────────────

function newGame() {
  shuffle();
  moves  = 0;
  solved = false;
  movesEl.textContent = '0';
  winOverlay.classList.remove('open');
  renderBoard();
}

// ── Events ─────────────────────────────────────────────────────────────────

newGameBtn.addEventListener('click', newGame);
winNewBtn.addEventListener('pointerdown', newGame);
previewBtn.addEventListener('click', openPreview);

sizeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const size = Number(btn.dataset.size);
    if (size === N) return;
    N = size;
    sizeBtns.forEach(b => b.classList.toggle('active', b === btn));
    newGame();
  });
});

// ── Start ──────────────────────────────────────────────────────────────────

newGame();
