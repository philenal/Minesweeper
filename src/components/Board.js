import { useEffect, useState } from "react";
import classNames from "classnames";

import Square from "./Square";
import "../styles.css";

export default function Board(props) {
  let [shownSquares, setShownSquares] = useState({});
  let bombs = props.bombs;
  console.log("SIZE", props.size);
  let squareList = new Array(props.size * props.size).fill(1);

  useEffect(() => {
    if (props.clearGame) {
      setShownSquares({});
    }
  }, [props.clearGame]);

  //gets number of adjacent bombs given square loc
  //RETURNS integer
  function getNumber(index) {
    if (index < 0 || index >= props.size * props.size) {
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
      if (newIndex[0] + i < props.size && newIndex[0] + i >= 0) {
        adjacentSquares[to1D(newIndex[0] + i, newIndex[1])] = 1;
      }
      if (newIndex[1] + i < props.size && newIndex[1] + i >= 0) {
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
      props.size * props.size
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
    let i = Math.floor(index / props.size);
    let j = index - props.size * i;
    return [i, j];
  }

  //converts a 2D location into a 1D location
  //RETURNS integer
  function to1D(i, j) {
    return props.size * i + j;
  }

  //shows all squares
  //RETURNS none
  function showAllSquares() {
    let allSquares = shownSquares;
    for (let i = 0; i < props.size * props.size; i++) {
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
          isBomb={bombs != null && bombs.hasOwnProperty(index)}
          start={props.start}
          squareSize={500 / props.size}
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
