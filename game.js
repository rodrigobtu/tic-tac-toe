/**
 * Tic-Tac-Toe Game
 *
 * A two-player game where X and O alternate turns on a 3x3 grid.
 * The first player to align three marks in a row, column, or diagonal wins.
 * Scores persist across restarts within the same browser session.
 */

/** All winning combinations as cell index triplets. */
const WINNING_COMBOS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // main diagonal
  [2, 4, 6], // anti-diagonal
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
const scores = { X: 0, O: 0, draws: 0 };

const cells     = document.querySelectorAll('.cell');
const statusEl  = document.getElementById('status');
const winsX     = document.getElementById('wins-x');
const winsO     = document.getElementById('wins-o');
const drawsEl   = document.getElementById('draws');
const restartBtn     = document.getElementById('restart');
const resetScoresBtn = document.getElementById('reset-scores');

function getWinningCombo(player) {
  return WINNING_COMBOS.find(([a, b, c]) =>
    board[a] === player && board[b] === player && board[c] === player
  ) ?? null;
}

function handleMove(index) {
  if (gameOver || board[index] !== null) return;
  board[index] = currentPlayer;
  renderCell(index);
  const combo = getWinningCombo(currentPlayer);
  if (combo) { endGame('win', combo); return; }
  if (board.every(cell => cell !== null)) { endGame('draw'); return; }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus(`Player ${currentPlayer}'s turn`);
}

function endGame(result, combo = []) {
  gameOver = true;
  disableAllCells();
  if (result === 'win') {
    scores[currentPlayer]++;
    updateScoreboard();
    highlightWinningCells(combo);
    setStatus(`Player ${currentPlayer} wins!`, 'win');
  } else {
    scores.draws++;
    updateScoreboard();
    setStatus("It's a draw!", 'draw');
  }
}

function renderCell(index) {
  const cell = cells[index];
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;
}

function highlightWinningCells(combo) {
  combo.forEach(i => cells[i].classList.add('winning'));
}

function disableAllCells() {
  cells.forEach(cell => (cell.disabled = true));
}

function setStatus(message, modifier = '') {
  statusEl.textContent = message;
  statusEl.className = `status ${modifier}`.trim();
}

function updateScoreboard() {
  winsX.textContent   = scores.X;
  winsO.textContent   = scores.O;
  drawsEl.textContent = scores.draws;
}

function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
  });
  setStatus("Player X's turn");
}

function resetScores() {
  scores.X = 0;
  scores.O = 0;
  scores.draws = 0;
  updateScoreboard();
  restartGame();
}

cells.forEach(cell => {
  cell.addEventListener('click', () => handleMove(Number(cell.dataset.index)));
});

restartBtn.addEventListener('click', restartGame);
resetScoresBtn.addEventListener('click', resetScores);
