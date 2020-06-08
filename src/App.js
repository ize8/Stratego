import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
//import io from "socket.io";

import { Game } from "./Components/Game";
import { Home } from "./Components/Home";
import { Prepare } from "./Components/Prepare";
import { SelectRoom } from "./Components/SelectRoom";
import { SCREEN } from "./Store/actions";
import {
  setSocketIoCient,
  sendBoardData,
  processBoardDataReceived
} from "./Store/networkActions";

export default function App() {
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.app.activeScreen);
  const socketio = useSelector(state => state.socket);

  useEffect(() => {
    const connectToServer = async () => {
      const socket = io(socketio.url);
      console.log("connecing to server:", socketio.url);

      socket.on("connect", () => {
        console.log("Server connected!", socket.connected); // true
        dispatch(setSocketIoCient(socket));
      });

      socket.on("room-is-full", data => {
        console.log("Room is full!", data); // true
      });

      socket.on("player-joined", data => {
        dispatch(sendBoardData(data.roomId))
          .then(res => {
            console.log("Board data sent to Player2!", res);
          })
          .catch(err => {
            console.log("Error when sending board data to Player2!", err);
          });
      });

      socket.on("player-left", data => {
        console.log("Player left:", data); // true
      });

      socket.on("action-sent", data => {
        console.log("Action received:", data); // true
        if (data.action.type === "boardData") {
          dispatch(
            processBoardDataReceived({
              board: data.action.data.board,
              hand1: data.action.data.hand1,
              hand2: data.action.data.hand2
            })
          );
        }
      });
    };

    console.log("...init App...");
    if (!socketio || !socketio.connected) connectToServer();
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
