# Tic-Tac-Toe

A classic two-player Tic-Tac-Toe game built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

## Features

- Two-player gameplay (X and O alternate turns)
- Win detection for all rows, columns, and diagonals
- Draw detection when the board is full
- Persistent scoreboard across rounds (within the same session)
- Winning cells highlighted with an animation
- Responsive layout that works on mobile

## How to Play

1. Open `index.html` in any modern browser.
2. Players take turns clicking an empty cell.
3. The first player to align **three marks** in a row, column, or diagonal wins.
4. Click **Restart Game** to start a new round (scores are kept).
5. Click **Reset Scores** to clear the scoreboard and start fresh.

## Project Structure

```
tic-tac-toe/
├── index.html   # Markup and page structure
├── style.css    # All visual styles and animations
├── game.js      # Game logic and DOM interactions
└── README.md    # This file
```

## Getting Started

No build step required. Simply clone the repository and open the file:

```bash
git clone https://github.com/rodrigobtu/tic-tac-toe.git
cd tic-tac-toe
open index.html   # macOS
# or
xdg-open index.html  # Linux
# or just double-click index.html on Windows
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT
