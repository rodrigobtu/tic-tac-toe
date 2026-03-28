# Sliding Photo Puzzle

A mobile-first sliding photo puzzle (also known as the 15-puzzle or 8-puzzle) built with **zero dependencies** — pure HTML, CSS, and JavaScript.

The photo is split into a grid of tiles with one empty space. Slide tiles into the gap to reconstruct the original image.

**[Play it live →](https://rodrigobtu.github.io/tic-tac-toe/)**

---

## Gameplay

| Action | Result |
|---|---|
| Tap a tile | Slides it into the adjacent empty space |
| **New Game** | Shuffles the board for a new round |
| **Preview** | Shows the complete target image |
| **3 × 3 / 4 × 4** | Switches grid size (8 or 15 tiles) |

A move counter tracks how efficiently you solve the puzzle.

## Features

- **Photo-based tiles** — any JPEG/PNG can be used as the puzzle image
- **Two difficulty levels** — 3×3 (easy) and 4×4 (challenging)
- **Always solvable** — shuffle algorithm uses random valid moves from a solved state, guaranteeing every puzzle has a solution
- **Native `<dialog>` modal** — uses the browser's built-in dialog API for reliable behavior across all platforms including iOS Safari
- **Responsive layout** — fits any screen size using CSS `min()` and `svh` units
- **Touch-optimized** — `touch-action: manipulation` removes the 300 ms tap delay on mobile; minimum 44 px touch targets throughout
- **No frameworks** — vanilla HTML/CSS/JS, no build step required

## Project Structure

```
sliding-photo-puzzle/
├── index.html            # Markup, semantic HTML5, full meta/OG tags
├── style.css             # Layout, animations, mobile-first responsive design
├── game.js               # Puzzle logic, rendering, event handling
├── images/
│   └── IMG_3440.jpeg     # Puzzle photo (replace to customize)
├── package.json          # Project metadata
└── README.md             # This file
```

## How It Works

### Tile rendering

Each tile is a `<button>` element. Its slice of the photo is shown using CSS `background-image` with calculated `background-size` and `background-position`:

```
background-size:     N×100%  N×100%       (e.g. 300% 300% for a 3×3 grid)
background-position: X%      Y%

where:
  X = col / (N − 1) × 100
  Y = row / (N − 1) × 100
```

This maps each tile's original grid position to the correct image slice without any canvas or image-splitting libraries.

### Shuffle algorithm

The board is shuffled by performing a large number of random valid moves (300 for 3×3, 500 for 4×4) starting from the solved state. Backtracking (reversing the previous move) is prevented to improve shuffle quality. This guarantees:

1. The puzzle is always solvable
2. The starting position is sufficiently random

### Win detection

After every move, `tiles.every((v, i) => v === i)` checks whether each tile has returned to its original position.

## Customization

To use a different photo, replace `images/IMG_3440.jpeg` and update the `src` attribute in `index.html`. No code changes are needed — tile slicing is computed dynamically from the image dimensions.

## Getting Started

No build step required:

```bash
git clone https://github.com/rodrigobtu/tic-tac-toe.git
cd tic-tac-toe
npx serve .         # serves on http://localhost:3000
```

Or just open `index.html` directly in any modern browser.

## Browser Support

Requires support for `<dialog>` (Chrome 37+, Firefox 98+, Safari 15.4+, all modern mobile browsers).

## License

MIT

---

*Created by [rodrigobtu](https://github.com/rodrigobtu)*
