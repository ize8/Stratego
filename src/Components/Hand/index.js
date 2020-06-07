import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Element } from "../Element";
import { PLAYER } from "../../Store/actions";

export const Hand = ({ player, onSelected }) => {
  const boardDim = useSelector(state => state.app.boardDim);
  const highlighted = useSelector(state => state.board.highlighted);
  const hand = useSelector(state =>
    player === PLAYER.PLAYER1 ? state.board.hand1 : state.board.hand2
  );

  useEffect(() => {}, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${boardDim.columns}, 50px)`,
          gridTemplateRows: `repeat(2, 50px)`,
          gap: "0px",
          margin: "10px"
        }}
      >
        {hand.map(e => (
          <Element
            key={e.id}
            id={e.id}
            onSelect={() => onSelected(e.id)}
            dead={e.dead}
            highlighted={highlighted.includes(e.id)}
          />
        ))}
      </div>
    </div>
  );
};
