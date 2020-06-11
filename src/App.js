import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Game } from "./Components/Game";
import { Home } from "./Components/Home";
import { Prepare } from "./Components/Prepare";
import { SelectRoom } from "./Components/SelectRoom";
import {
  SCREEN,
  PLAYER,
  updateItems,
  updatePlayerItems,
  setWaitingForEnemy
} from "./Store/actions";
import {
  setSocketIoCient,
  sendBoardData,
  processBoardDataReceived,
  setPlayer1Ready,
  setPlayer2Ready,
  setMissedFightInfo,
  setPlayer2Joined
} from "./Store/networkActions";

export default function App() {
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.app.activeScreen);
  const socketio = useSelector(state => state.socket);

  useEffect(() => {
    const connectToServer = async () => {
      /*
        importing Socket.io from CDN in index.html, 
        as it wouldn't work in codesandbox with the standard ES6 import :( 
      */
      const socket = io(socketio.url); /* eslint-disable-line */
      console.log("connecing to server:", socketio.url);

      socket.on("connect", () => {
        console.log("Server connected!", socket.connected); // true
        dispatch(setSocketIoCient(socket));
      });

      socket.on("disconnect", function() {
        alert(`Lost connection with server!\nPlease restart game!`);
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
        dispatch(setPlayer2Joined(true));
      });

      socket.on("player-left", data => {
        console.log("Player left:", data); // true
        alert("Unfortunately your enemy ran away! ...");
      });

      socket.on("action-sent", data => {
        console.log("Action received:", data); // true
        switch (data.action.type) {
          case "fightData":
            console.log("Fight info received!", data.action.data);
            dispatch(setMissedFightInfo(data.action.data));
            break;
          case "itemsData":
            dispatch(updateItems(data.action.data));
            dispatch(setWaitingForEnemy(false));
            break;
          case "boardData":
            dispatch(
              processBoardDataReceived({
                board: data.action.data.board,
                hand1: data.action.data.hand1,
                hand2: data.action.data.hand2
              })
            );
            break;
          case "playerReady":
            console.log("playerReady:", data.action);
            const playerToUpdate = data.action.data.player;
            dispatch(updatePlayerItems(playerToUpdate, data.action.data.items));
            dispatch(
              playerToUpdate === PLAYER.PLAYER1
                ? setPlayer1Ready()
                : setPlayer2Ready()
            );
            break;
          default:
            break;
        }
      });
    };

    console.log("...init App...");
    if (!socketio || !socketio.connected) connectToServer();
  }, []);

  useEffect(() => {
    console.log("Socket.IO connected", socketio.connected);
  }, [socketio.connected]);

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
