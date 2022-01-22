import { useEffect, useState } from "react";
import classNames from "classnames";
import { getRandomBombs } from "../src/logic.js";
import "./styles.css";
const PERCENT_BOMB = 0.3;
const BOARD_WIDTH = 5;
const NUM_BOMB = Math.max(
  Math.ceil(BOARD_WIDTH * BOARD_WIDTH * PERCENT_BOMB),
  2
); // we have at least 2 bombs so that if the player clicks on a bomb on their first click, then we still have at least 1 bomb in the board.

function Board(props) {
  let [shownSquares, setShownSquares] = useState({});
  let bombs = props.bombs;
  let squareList = new Array(BOARD_WIDTH * BOARD_WIDTH).fill(1);

  useEffect(() => {
    if (props.clearGame) {
      setShownSquares({});
    }
  }, [props.clearGame]);

  //gets number of adjacent bombs given square loc
  //RETURNS integer
  function getNumber(index) {
    if (index < 0 || index >= BOARD_WIDTH * BOARD_WIDTH) {
      return null;
    }

    let num = 0;
    if (bombs != null) {
      let adjacentSquares = getAdj(index);
      for (let squareIndex in adjacentSquares) {
        num = bombs.hasOwnProperty(squareIndex) ? num + 1 : num;
      }
      return num;
    }
  }

  //gets valid adjacent locations from a location (index)
  //RETURNS object
  function getAdj(index) {
    let adjacentSquares = {};
    let newIndex = to2D(index);
    for (let i = -1; i < 2; i += 2) {
      if (newIndex[0] + i < BOARD_WIDTH && newIndex[0] + i >= 0) {
        adjacentSquares[to1D(newIndex[0] + i, newIndex[1])] = 1;
      }
      if (newIndex[1] + i < BOARD_WIDTH && newIndex[1] + i >= 0) {
        adjacentSquares[to1D(newIndex[0], newIndex[1] + i)] = 1;
      }
    }
    return adjacentSquares;
  }

  //adds the index square to an object of squares to show.
  //if location has no bombs, then reveals all adjacent locations that also have no bombs recursively
  //RETURNS object of squares to show
  function showSquare(index, newShownSquares) {
    if (
      Object.keys(newShownSquares).length + Object.keys(bombs).length ===
      BOARD_WIDTH * BOARD_WIDTH
    ) {
      props.winGame();
    }
    newShownSquares[index] = getNumber(index);
    for (let square in newShownSquares) {
      if (newShownSquares[square] === 0) {
        let adjacentSquares = getAdj(square);
        for (let adj in adjacentSquares) {
          if (!newShownSquares.hasOwnProperty(adj) && getNumber(adj) === 0) {
            newShownSquares = {
              ...newShownSquares,
              ...showSquare(adj, newShownSquares)
            };
          }
        }
      }
    }
    return newShownSquares;
  }

  //converts index location to a 2D [row, col] location
  //RETURNS array [row, col]
  function to2D(index) {
    let i = Math.floor(index / BOARD_WIDTH);
    let j = index - BOARD_WIDTH * i;
    return [i, j];
  }

  //converts a 2D location into a 1D location
  //RETURNS integer
  function to1D(i, j) {
    return BOARD_WIDTH * i + j;
  }

  //shows all squares
  //RETURNS none
  function showAllSquares() {
    let allSquares = shownSquares;
    for (let i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i++) {
      if (!allSquares.hasOwnProperty(i)) {
        allSquares[i] = getNumber(i);
      }
    }
    setShownSquares(allSquares);
  }

  //represents the squares on the board
  //RETURNS map object of <Square> components
  function renderSquares() {
    let renderedSquares = squareList.map((square, index) => {
      return (
        <Square
          key={index}
          index={index}
          onClick={() => {
            if (props.start) {
              if (bombs.hasOwnProperty(index)) {
                //if first click is a bomb, remove the bomb from bombs object so that we don't lose on the first click
                if (Object.keys(shownSquares).length === 0) {
                  props.removeBomb(index);
                } else {
                  showAllSquares();
                  props.loseGame();
                }
              }
              setShownSquares({
                ...shownSquares,
                ...showSquare(index, shownSquares)
              });
            }
          }}
          shown={shownSquares.hasOwnProperty(index)}
          number={index in shownSquares ? shownSquares[index] : null}
          isBomb={bombs.hasOwnProperty(index)}
          start={props.start}
        />
      );
    });
    return renderedSquares;
  }
  return (
    <div className={classNames("util-center", "board-container")}>
      {renderSquares()}
    </div>
  );
}

function Square(props) {
  return (
    <div
      className={classNames("util-center", {
        "square-visible": props.shown,
        "square-hidden": !props.shown,
        bomb: props.isBomb && props.shown
      })}
      style={{
        cursor: props.start ? "pointer" : "default",
        minWidth: `${500 / BOARD_WIDTH}px`,
        height: `${500 / BOARD_WIDTH}px`
      }}
      onClick={() => {
        return props.onClick();
      }}
    >
      {props.number === 0 ? "" : props.number}
    </div>
  );
}

function Timer(props) {
  const [num, setNum] = useState(0);
  useEffect(() => {
    if (props.clear) {
      setNum(0);
    }
  }, [props.clear, num]);
  useEffect(() => {
    if (props.start && !props.stop) {
      setTimeout(() => {
        setNum(num + 1);
      }, 1000);
    }
  });
  function showTime(time) {
    let seconds = (time % 60).toString().padStart(2, "0");
    time = Math.floor(time / 60);
    let minutes = (time % 60).toString().padStart(2, "0");
    time = Math.floor(time / 60);
    let hours = time.toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
  return (
    <div
      className={classNames("util-center", {
        stop: props.stop,
        count: !props.stop
      })}
    >
      {showTime(num)}
    </div>
  );
}

export default function App() {
  let [bombs, setBombs] = useState(getRandomBombs(BOARD_WIDTH, NUM_BOMB));
  const [start, setStart] = useState(false);
  const [clearGame, setClearGame] = useState(true);
  const [status, setStatus] = useState(null);

  //starts game and generates bombs
  function startGame() {
    setBombs(getRandomBombs(BOARD_WIDTH, NUM_BOMB));
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
    </div>
  );
}
