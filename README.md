# Minesweeper
Goal: reveal all squares that are not bombs.

# General Instructions
- To change the size of the board, click on any of the three numbers below the board: 5, 10, 20. This will create a 5 by 5, 10 by 10, or 20 by 20 board.
  - Note: You can only change the size of the board if the board is currently cleared (i.e. all of the squares are hidden) and you have not yet started the game.
- To begin, click "Start". This will start the clock, and will allow you to click on any square on the board. 
  - Note: You can only click "Start" if the board is currently cleared.
- To end, click "Reset". This will clear the board.

Clicking on a square will reveal the square's identity. Clicking on a:
- Bomb: will lose the game. All squares on the board will be revealed.
- Square with:
  - No adjacent bombs: will reveal the square, as well as all adjacent squares that also have no adjacent bombs in a recursive manner.
  - Adjacent bombs: will reveal the square, as well as the number of bombs adjacent to the square.

The game will only end if:
- You force quit by clicking "Reset"
- You win by revealing all squares that are not bombs.
- You lose by clicking on a bomb.

If the game ends, then the clock stops. The clock reflects the game duration.
