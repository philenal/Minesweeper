import { useEffect, useState } from "react";
import classNames from "classnames";

import "../styles.css";

export default function Timer(props) {
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
