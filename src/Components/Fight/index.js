import React from "react";
import { PLAYER } from "../../Store/actions";
import { BoardIcon } from "../BoardIcon";
import { Swords } from "../BoardIcon/Swords";

export const Fight = ({ attacker, victim, result }) => {
  const getColor = item => {
    if (!item) return "black";
    if (item.owner === PLAYER.PLAYER1) return "red";
    else return "blue";
  };
  return (
    <div
      style={{
        display: "block",
        position: "absolute",
        width: "10rem",
        height: "2.5rem",
        top: "15rem",
        left: "auto",
        backgroundColor: "floralwhite",
        border: "5px solid salmon",
        borderRadius: "20px",
        zIndex: 10,
        boxShadow: "-5px 5px 8px black"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          height: "100%"
        }}
      >
        <BoardIcon item={attacker} iconColor={getColor(attacker)} />
        <Swords size={30} />
        <BoardIcon item={victim} iconColor={getColor(victim)} />
      </div>
    </div>
  );
};
