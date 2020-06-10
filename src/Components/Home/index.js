import React, { useEffect } from "react";
import "../../style/App.css";
import { nanoid } from "nanoid";
import { SpinnerRoundFilled } from "spinners-react";

import { useDispatch, useSelector } from "react-redux";
import {
  changeScreen,
  SCREEN,
  setRoomNumber,
  setActivePlayer,
  updateItems,
  updateBoard,
  updateHand1,
  updateHand2,
  PLAYER
} from "../../Store/actions";
import {
  createNewRoom,
  setPlayer1Ready,
  setPlayer2Ready,
  setPlayer2Joined,
  setMissedFightInfo
} from "../../Store/networkActions";

export const Home = () => {
  const dispatch = useDispatch();
  const boardDim = useSelector(state => state.app.boardDim);
  const socket = useSelector(state => state.socket.io);

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
    console.log("Back to home...washing hands and items!");
    dispatch(setActivePlayer(PLAYER.PLAYER1));
    dispatch(updateItems([]));
    dispatch(updateBoard(genEmptyBoard()));
    dispatch(updateHand1(genEmptyHand()));
    dispatch(updateHand2(genEmptyHand()));
    dispatch(setMissedFightInfo(null));
    dispatch(setPlayer2Joined(false));
    dispatch(setPlayer1Ready(false));
    dispatch(setPlayer2Ready(false));
  }, []);

  const startNewGame = async () => {
    try {
      const res = await dispatch(createNewRoom());
      console.log("Room created:", res);
    } catch (err) {
      alert(`Server ERROR!\n${err.message}`);
    }
  };

  const joinRoom = () => {
    dispatch(setRoomNumber(null));
    dispatch(changeScreen(SCREEN.SELECT_ROOM));
  };

  return (
    <div className="page">
      <div className="pageContainer">
        <h1 className="title">STRATEGO</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={startNewGame}>Start new game</button>
          <button onClick={joinRoom}>Join room</button>
          <a href="http://www.ketaklub.hu/letoltes/Stratego%20Aoriginal%20Piatnik.pdf">
            <button>Game rules</button>
          </a>
          {(!socket || !socket.connected) && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <SpinnerRoundFilled color={"salmon"} />
              <span style={{ fontSize: "10px" }}>connecting to server</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
