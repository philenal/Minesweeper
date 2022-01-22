import { useState } from "react";
import classNames from "classnames";

import BoardSizeSelector from "./components/BoardSizeSelector";
import Board from "./components/Board";
import Timer from "./components/Timer";

import { getRandomBombs } from "../src/logic.js";
import "./styles.css";

const PERCENT_BOMB = 0.3;

export default function App() {
  const [size, setSize] = useState(10);
  const [start, setStart] = useState(false);
  const [clearGame, setClearGame] = useState(true);
  const [status, setStatus] = useState(null);
  const numBomb = Math.max(Math.ceil(size * size * PERCENT_BOMB), 2); // we have at least 2 bombs so that if the player clicks on a bomb on their first click, then we still have at least 1 bomb in the board.
  let [bombs, setBombs] = useState(getRandomBombs(size, numBomb));
  //starts game and generates bombs
  function startGame() {
    setBombs(getRandomBombs(size, numBomb));
    setStart(true);
    setClearGame(false);
  }
  //clears the board (hides all squares)
  function resetGame() {
    setStart(false);
    setClearGame(true);
    setStatus(null);
  }
  function loseGame() {
    setStart(false);
    setStatus("lost");
  }
  function winGame() {
    setStart(false);
    setStatus("won");
  }
  function removeBomb(index) {
    delete bombs[index];
    setBombs(bombs);
  }

  return (
    <div className={classNames("util-center", "App")}>
      <div
        className={classNames("header", "util-center", {
          [status]: status !== null
        })}
      >
        <div className={classNames("header-item", "util-center")}>
          {status ? "You " + status : "Minesweeper"}
        </div>

        <Timer start={start} stop={status != null} clear={clearGame} />
      </div>
      <div className={classNames("main-container", "util-center")}>
        <div
          className={classNames({
            disabled: !clearGame,
            start: clearGame
          })}
          onClick={() => {
            if (clearGame) {
              startGame();
            }
          }}
        >
          Start
        </div>
        <Board
          size={size}
          bombs={bombs}
          removeBomb={(index) => removeBomb(index)}
          start={start}
          clearGame={clearGame}
          loseGame={() => loseGame()}
          winGame={() => winGame()}
        />
        <div className="reset" onClick={() => resetGame()}>
          Reset
        </div>
      </div>
      <BoardSizeSelector
        size={size}
        disabled={start && !clearGame}
        setSize={(val) => setSize(val)}
      />
    </div>
  );
}
