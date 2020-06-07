import React from "react";
import { PLAYER } from "../../Store/actions";
import { BoardIcon } from "../BoardIcon";
import { useSelector } from "react-redux";

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

  return (
    <div
      onClick={onSelect}
      style={{
        cursor: "pointer",
        width: "100%",
        height: "100",
        border: highlighted ? "3px solid gold" : "1px solid gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: item?.dead ? "lightgray" : bkColor(item)
      }}
    >
      <span
        style={{
          color: color(item),
          fontWeight: "bold"
        }}
      >
        <BoardIcon item={item} hidden={item && item.owner !== activePlayer} />
      </span>
    </div>
  );
};
