import React from "react";
import { Flag } from "react-feather";
import { PLAYER } from "../../Store/actions";
import { Bomb } from "./Bomb";
import { Soldier } from "./Soldier";
import { Skull } from "./Skull";

export const BoardIcon = ({
  item,
  hidden = false,
  iconColor = null,
  style
}) => {
  //hide the enemy soldiers! ..or show graves for dead ones
  if (hidden) {
    if (item?.dead) return <Skull size={30} />;
    return <Soldier color={color(item)} size={25} />;
  }
  const num = parseInt(item?.type, 10);
  //if type is a vali number (1-10)
  if (!isNaN(num))
    return (
      <span
        style={{
          fontWeight: "bold",
          color: iconColor ? iconColor : null,
          ...style
        }}
      >
        {num}
      </span>
    );
  //if type is a non-number
  switch (item?.type) {
    case "flag":
      return <Flag />;
    case "bomb":
      return <Bomb color={iconColor ? iconColor : color(item)} />;
    default:
      return <span />;
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
