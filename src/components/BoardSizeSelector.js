import classNames from "classnames";
import "../styles.css";

export default function BoardSizeSelector(props) {
  return (
    <div className={classNames("util-center", "board-size")}>
      <div
        className={classNames("util-center", "header-item", {
          "size-selector": !props.disabled,
          active: props.size === 5
        })}
        onClick={() => {
          if (!props.disabled) {
            props.setSize(5);
          }
        }}
      >
        5
      </div>
      <div
        className={classNames("util-center", "header-item", {
          "size-selector": !props.disabled,
          active: props.size === 10
        })}
        onClick={() => {
          if (!props.disabled) {
            props.setSize(10);
          }
        }}
      >
        10
      </div>
      <div
        className={classNames("util-center", "header-item", {
          "size-selector": !props.disabled,
          active: props.size === 20
        })}
        onClick={() => {
          if (!props.disabled) {
            props.setSize(20);
          }
        }}
      >
        20
      </div>
    </div>
  );
}
