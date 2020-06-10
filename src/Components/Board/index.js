import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { checkStartingCount } from "../../Store/appStatusReducer";
import { Element } from "../Element";
import { PLAYER } from "../../Store/actions";

export const Board = ({
  onClickedBoard,
  highlightedElements = [],
  hidePlayer1 = false,
  hidePlayer2 = false
}) => {
  const board = useSelector(state => state.board.board);
  const boardDim = useSelector(state => state.app.boardDim);
  const activePlayer = useSelector(state => state.app.activePlayer);

  useEffect(() => {
    if (!checkStartingCount())
      alert("The starting kit is not consistent with the size of the board!");
  }, []);

  const activePlayerStyle = {
    border: "5px solid gold",
    backgroundColor: "darkorange"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {hidePlayer2 || (
        <h2
          className="title"
          style={
            activePlayer === PLAYER.PLAYER2
              ? { ...activePlayerStyle, padding: "5px", color: "blue" }
              : { padding: "5px", color: "blue" }
          }
        >
          Player2
        </h2>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${boardDim.columns}, 50px)`,
          gridTemplateRows: `repeat(${boardDim.rows}, 50px)`,
          gap: "0px",
          margin: "10px"
        }}
      >
        {//Array.from(Array(boardDim.rows).keys()).map(row => createRow(row))
        board.map(e => (
          <Element
            key={e.id}
            id={e.id}
            onSelect={() => onClickedBoard(e.row, e.col)}
            highlighted={highlightedElements.includes(e.id)}
          />
        ))}
      </div>
      {hidePlayer1 || (
        <h2
          className="title"
          style={
            activePlayer === PLAYER.PLAYER1
              ? { ...activePlayerStyle, padding: "5px", color: "red" }
              : { padding: "5px", color: "red" }
          }
        >
          Player1
        </h2>
      )}
    </div>
  );
};
