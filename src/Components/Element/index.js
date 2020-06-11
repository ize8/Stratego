import React, { useEffect, useRef } from "react";
import { PLAYER } from "../../Store/actions";
import { BoardIcon } from "../BoardIcon";
import { useSelector } from "react-redux";

import { useSpring, animated } from "react-spring";

const bkColor = item => {
  switch (item?.owner) {
    case PLAYER.PLAYER1:
      return "red";
    case PLAYER.PLAYER2:
      return "blue";
    default:
      return "white";
  }
};

const color = item => {
  if (!item || item?.dead) return "black";
  switch (item?.owner) {
    case PLAYER.PLAYER1:
      return "pink";
    case PLAYER.PLAYER2:
      return "lightblue";
    default:
      return "black";
  }
};
export const Element = ({ id, onSelect, highlighted = false }) => {
  const item = useSelector(state => state.board.items)?.find(
    e => e.position === id
  );
  const activePlayer = useSelector(state => state.app.activePlayer);
  const oldItem = useRef(item);
  //CSS props to be animated
  const [props, set, stop] = useSpring(() => ({
    opacity: 0,
    transform: "scale(0,0)",
    backgroundColor: item?.dead ? "lightgray" : bkColor(item),
    color: color(item)
  }));

  //animations for react-spring
  useEffect(() => {
    if (!oldItem.current && item) {
      //item is appearing
      set({
        opacity: 1,
        backgroundColor: item?.dead ? "lightgray" : bkColor(item),
        color: color(item),
        transform: "scale(1,1)"
      });
    }
    if (oldItem.current && !item) {
      //item is disappearing
      set({
        opacity: 0,
        backgroundColor: item?.dead ? "lightgray" : bkColor(item),
        color: color(item),
        transform: "scale(0,0)"
      });
    }
    if (oldItem.current && item) {
      //item was "stepped on"
      set({
        opacity: 1,
        backgroundColor: item?.dead ? "lightgray" : bkColor(item),
        color: color(item),
        transform: "scale(1,1)"
      });
    }
    oldItem.current = item;
  }, [item]);

  return (
    <div
      onClick={onSelect}
      style={{
        cursor: "pointer",
        border: highlighted ? "3px solid gold" : "1px solid gray",
        backgroundColor: item?.dead ? "lightgray" : "white"
      }}
    >
      <animated.div
        style={{
          ...props,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          fontWeight: "bold"
        }}
      >
        <BoardIcon item={item} hidden={item && item.owner !== activePlayer} />
      </animated.div>
    </div>
  );
};
