import { useEffect, useState } from "react";
import classNames from "classnames";
import "../styles.css";

export default function Square(props) {
  return (
    <div
      className={classNames("util-center", "border")}
      style={{
        minWidth: `${props.squareSize}px`,
        minHeight: `${props.squareSize}px`
      }}
      onClick={() => {
        return props.onClick();
      }}
    >
      <div
        className={classNames("util-center", {
          "square-visible": props.shown,
          "square-hidden": !props.shown,
          bomb: props.isBomb && props.shown
        })}
        style={{
          cursor: props.start ? "pointer" : "default",
          minWidth: `${props.squareSize - 1}px`,
          minHeight: `${props.squareSize - 1}px`
        }}
      >
        {props.number === 0 ? "" : props.number}
      </div>
    </div>
  );
}
