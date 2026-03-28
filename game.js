/**
 * Sliding Photo Puzzle
 *
 * The dog photo is split into N×N tiles. One tile is missing (blank space).
 * Tap any tile adjacent to the blank to slide it into the empty spot.
 * Goal: reconstruct the original photo.
 */

const IMG = 'images/IMG_3440.jpeg';

// ── State ──────────────────────────────────────────────────────────────────

let N = 3;       // grid size (3 or 4)
let tiles = [];  // tiles[position] = tileValue  (N*N-1 = blank)
let moves = 0;
let solved = false;

// ── DOM ────────────────────────────────────────────────────────────────────

const boardEl      = document.getElementById('board');
const movesEl      = document.getElementById('moves');
const winOverlay   = document.getElementById('win-overlay');
const winMovesEl   = document.getElementById('win-moves');
const newGameBtn   = document.getElementById('new-game');
const winNewBtn    = document.getElementById('win-new');
const previewBtn   = document.getElementById('show-preview');
const previewModal = document.getElementById('preview-modal');
const modalClose   = document.getElementById('modal-close');
const sizeBtns     = document.querySelectorAll('.size-btn');

// ── Puzzle logic ───────────────────────────────────────────────────────────

function neighbors(pos) {
  const r = Math.floor(pos / N), c = pos % N;
  const result = [];
  if (r > 0)   result.push(pos - N);
  if (r < N-1) result.push(pos + N);
  if (c > 0)   result.push(pos - 1);
  if (c < N-1) result.push(pos + 1);
  return result;
}

function shuffle() {
  tiles = Array.from({ length: N * N }, (_, i) => i);
  let blank = N * N - 1;
  let lastBlank = -1;
  const steps = N === 3 ? 300 : 500;

  for (let i = 0; i < steps; i++) {
    const ns = neighbors(blank).filter(n => n !== lastBlank);
    const next = ns[Math.floor(Math.random() * ns.length)];
    [tiles[blank], tiles[next]] = [tiles[next], tiles[blank]];
    lastBlank = blank;
    blank = next;
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
    winMovesEl.textContent = `Completed in ${moves} move${moves !== 1 ? 's' : ''}!`;
    winOverlay.classList.add('open');
  }
}

// ── Rendering ──────────────────────────────────────────────────────────────

function tileStyle(tileValue) {
  const col = tileValue % N;
  const row = Math.floor(tileValue / N);
  const bpx = N === 1 ? 0 : (col / (N - 1)) * 100;
  const bpy = N === 1 ? 0 : (row / (N - 1)) * 100;
  return {
    bgSize: `${N * 100}% ${N * 100}%`,
    bgPos:  `${bpx}% ${bpy}%`,
  };
}

function renderTile(pos) {
  const el = boardEl.children[pos];
  if (!el) return;
  const val = tiles[pos];
  const isBlank = val === N * N - 1;

  el.className = 'tile' + (isBlank ? ' blank' : '');
  el.disabled  = isBlank;

  if (isBlank) {
    el.style.backgroundImage    = '';
    el.style.backgroundSize     = '';
    el.style.backgroundPosition = '';
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
  moves = 0;
  solved = false;
  movesEl.textContent = '0';
  winOverlay.classList.remove('open');
  renderBoard();
}

// ── Modal (native <dialog>) ────────────────────────────────────────────────

function openModal()  { previewModal.showModal(); }
function closeModal() { previewModal.close(); }

// ── Events ─────────────────────────────────────────────────────────────────

newGameBtn.addEventListener('click', newGame);
// pointerdown fires before click — more reliable on iOS Safari
winNewBtn.addEventListener('pointerdown', newGame);

sizeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const size = Number(btn.dataset.size);
    if (size === N) return;
    N = size;
    sizeBtns.forEach(b => b.classList.toggle('active', b === btn));
    newGame();
  });
});

previewBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

// ── Start ──────────────────────────────────────────────────────────────────

newGame();
