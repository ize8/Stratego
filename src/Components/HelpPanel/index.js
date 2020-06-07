import React, { useState } from "react";
import { Swords } from "../BoardIcon/Swords";
import { Soldier } from "../BoardIcon/Soldier";
import { Skull } from "../BoardIcon/Skull";
import { Medal } from "../BoardIcon/Medal";
import { Bomb } from "../BoardIcon/Bomb";
import { Flag } from "react-feather";
import { nanoid } from "nanoid";

const FightWithOutcome = ({ markdown }) => {
  return (
    <div
      key={nanoid(10)}
      style={{
        width: "150px",
        height: "38px",
        backgroundColor: "floralwhite",
        border: "1px solid lightgray",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: "10px",
        paddingLeft: "10px"
      }}
    >
      {markdown.map(e => {
        switch (e) {
          case "soldier":
            return <Soldier key={nanoid(10)} color="black" />;
          case "sword":
            return <Swords key={nanoid(10)} size={30} />;
          case "bomb":
            return <Bomb key={nanoid(10)} size={30} />;
          case "skull":
            return <Skull key={nanoid(10)} size={30} />;
          case "medal":
            return <Medal key={nanoid(10)} size={30} />;
          case "flag":
            return <Flag key={nanoid(10)} />;
          default:
            return (
              <span
                key={nanoid(10)}
                style={{ fontWeight: "bold", fontSize: "16px" }}
              >
                {e}
              </span>
            );
        }
      })}
    </div>
  );
};

export const HelpPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "25px",
          height: "25px",
          border: "1px solid gray",
          backgroundColor: "floralwhite",
          borderRadius: "25px",
          boxShadow: "-2px 2px 3px black",
          cursor: "help",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <span style={{ fontWeight: "bold", color: "gray" }}>?</span>
      </div>
      {isOpen && (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid gray",
            height: "200px",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            marginTop: "5px"
          }}
        >
          {/* prettier-ignore */}
          <div style={{ display: "flex", flexDirection: "column" }}>
        <FightWithOutcome markdown={['soldier','sword','soldier','=','soldier','>','skull']}/>
        <FightWithOutcome markdown={['[1]','sword','[10]','=','[1]','+','skull']}/>
        <FightWithOutcome markdown={['soldier','sword','bomb','=','skull','+','bomb']}/>
        <FightWithOutcome markdown={['[3]','sword','bomb','=','[3]','+','skull']}/>
        <FightWithOutcome markdown={['soldier','sword','flag','=','medal']}/>
      </div>
        </div>
      )}
    </div>
  );
};
