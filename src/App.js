import React, { useEffect } from "react";
import { nanoid } from "nanoid";
import { useSelector, useDispatch } from "react-redux";

import { Game } from "./Components/Game";
import { Home } from "./Components/Home";
import { Prepare } from "./Components/Prepare";
import { SelectRoom } from "./Components/SelectRoom";
import { SCREEN, updateBoard, updateHand1, updateHand2 } from "./Store/actions";

export default function App() {
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.app.activeScreen);
  const boardDim = useSelector(state => state.app.boardDim);

  //generates an empty board array
  /*
  board item : {id: ID, row:number, col:number, itemId:ID|null} 
  */
  const genEmptyBoard = () => {
    let res = [];
    for (let row = 0; row < boardDim.rows; row++) {
      for (let col = 0; col < boardDim.columns; col++) {
        res = [
          ...res,
          {
            id: nanoid(10),
            row: row,
            col: col
          }
        ];
      }
    }
    return res;
  };

  //generates an empty hand array
  /*
  hand item : {id: ID, highlighted:Bool, itemId:ID|null} 
  */
  const genEmptyHand = () => {
    let res = [];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < boardDim.columns; col++) {
        res = [
          ...res,
          {
            id: nanoid(10),
            highlighted: false
          }
        ];
      }
    }
    return res;
  };

  useEffect(() => {
    console.log("...init App...");
    dispatch(updateBoard(genEmptyBoard()));
    dispatch(updateHand1(genEmptyHand()));
    dispatch(updateHand2(genEmptyHand()));
  }, []);

  const getScreenComponent = id => {
    switch (id) {
      case SCREEN.GAME:
        return <Game />;
      case SCREEN.HOME:
        return <Home />;
      case SCREEN.PREPARE:
        return <Prepare />;
      case SCREEN.SELECT_ROOM:
        return <SelectRoom />;
      default:
        return <Home />;
    }
  };

  return <>{getScreenComponent(activeScreen)}</>;
}
