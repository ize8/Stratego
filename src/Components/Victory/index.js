import React from "react";
import { Medal } from "../BoardIcon/Medal";
import { PLAYER } from "../../Store/actions";

export const Victory = ({ result, ...props }) => {
  return (
    <div
      style={{
        display: "block",
        position: "fixed",
        justifyItems: "center",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        zIndex: 5,
        backgroundColor: "#101010",
        opacity: "0.98"
      }}
    >
      <div
        style={{
          display: "block",
          position: "relative",
          margin: "auto",
          width: "500px",
          height: "300px",
          top: "300px",
          left: "",
          border: "5px solid salmon",
          borderRadius: "20px",
          zIndex: 10,
          boxShadow: "-5px 5px 8px black",
          opacity: "1"
        }}
      >
        <div
          {...props}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            paddingRight: "15px",
            paddingLeft: "15px",
            opacity: "1"
          }}
        >
          <Medal size={200} />
          <div style={{ color: "white" }}>
            <h1 style={{ color: "gold" }}>VICTORY!</h1>
            <h3>
              <span
                style={{
                  color: result?.winner === PLAYER.PLAYER1 ? "red" : "blue"
                }}
              >{`${
                result?.winner === PLAYER.PLAYER1 ? "PLAYER 1" : "PLAYER 2"
              }`}</span>{" "}
              <span>won the Battle!</span>
            </h3>
            <p style={{ marginTop: "40px", fontSize: "15px" }}>
              <i>...click...</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
