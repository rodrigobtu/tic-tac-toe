/**
 * Sliding Photo Puzzle
 *
 * The dog photo is split into N×N tiles. One tile is removed (blank space).
 * Tap any tile adjacent to the blank to slide it into the empty spot.
 * Rearrange all tiles to reconstruct the original photo.
 */

const IMG = 'images/IMG_3440.jpeg';

// ── State ──────────────────────────────────────────────────────────────────

let N = 3;          // grid size (3 or 4)
let tiles = [];     // tiles[position] = tileValue (N*N-1 = blank)
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
const sizeBtns     = document.querySelectorAll('.size-btn');

// ── Puzzle logic ───────────────────────────────────────────────────────────

/** Returns the array indices adjacent (up/down/left/right) to `pos`. */
function neighbors(pos) {
  const r = Math.floor(pos / N), c = pos % N;
  const result = [];
  if (r > 0)   result.push(pos - N); // up
  if (r < N-1) result.push(pos + N); // down
  if (c > 0)   result.push(pos - 1); // left
  if (c < N-1) result.push(pos + 1); // right
  return result;
}

/**
 * Shuffles the board by making many random valid moves from the solved state.
 * This guarantees the puzzle is always solvable.
 */
function shuffle() {
  tiles = Array.from({ length: N * N }, (_, i) => i);
  let blank = N * N - 1;
  const steps = N === 3 ? 300 : 500;
  let lastBlank = -1;

  for (let i = 0; i < steps; i++) {
    const ns = neighbors(blank).filter(n => n !== lastBlank);
    const next = ns[Math.floor(Math.random() * ns.length)];
    [tiles[blank], tiles[next]] = [tiles[next], tiles[blank]];
    lastBlank = blank;
    blank = next;
  }
}

/** Returns true when all tiles are back in their original positions. */
function isSolved() {
  return tiles.every((v, i) => v === i);
}

/** Handles a tap on the tile at board position `pos`. */
function handleTap(pos) {
  if (solved) return;
  const blank = tiles.indexOf(N * N - 1);
  if (!neighbors(blank).includes(pos)) return;

  [tiles[blank], tiles[pos]] = [tiles[pos], tiles[blank]];
  moves++;
  movesEl.textContent = moves;

  // Update only the two swapped tiles for performance
  renderTile(blank);
  renderTile(pos);

  if (isSolved()) {
    solved = true;
    winMovesEl.textContent = `Completed in ${moves} move${moves !== 1 ? 's' : ''}!`;
    winOverlay.hidden = false;
  }
}

// ── Rendering ──────────────────────────────────────────────────────────────

/**
 * Computes the CSS background-position for a tile's original image slice.
 *
 * With background-size = N*100% × N*100%, the image is N times larger than
 * each cell. The percentage formula maps tile column/row to the correct slice:
 *   X% = col / (N-1) * 100   →  aligns the correct horizontal slice
 *   Y% = row / (N-1) * 100   →  aligns the correct vertical slice
 *
 * @param {number} tileValue - The tile's original index in the solved board.
 * @returns {{ bgSize: string, bgPos: string }}
 */
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

/** Updates the visual of a single board position in place. */
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

/** Builds the full board DOM from scratch and re-attaches all listeners. */
function renderBoard() {
  boardEl.style.setProperty('--n', N);
  boardEl.innerHTML = '';

  for (let pos = 0; pos < N * N; pos++) {
    const btn = document.createElement('button');
    boardEl.appendChild(btn);
    renderTile(pos); // uses the element just appended
    btn.addEventListener('click', () => handleTap(pos));
  }
}

// ── Game control ───────────────────────────────────────────────────────────

function newGame() {
  shuffle();
  moves = 0;
  solved = false;
  movesEl.textContent = '0';
  winOverlay.hidden = true;
  renderBoard();
}

// ── Events ─────────────────────────────────────────────────────────────────

newGameBtn.addEventListener('click', newGame);
winNewBtn.addEventListener('click', newGame);

sizeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const size = Number(btn.dataset.size);
    if (size === N) return;
    N = size;
    sizeBtns.forEach(b => b.classList.toggle('active', b === btn));
    newGame();
  });
});

previewBtn.addEventListener('click', () => {
  previewModal.hidden = false;
});

// Close on tap anywhere in the modal (including the image itself — iOS fix)
previewModal.addEventListener('click', () => { previewModal.hidden = true; });
previewModal.querySelectorAll('img, p').forEach(el => {
  el.addEventListener('click', () => { previewModal.hidden = true; });
});

// ── Start ──────────────────────────────────────────────────────────────────

newGame();
