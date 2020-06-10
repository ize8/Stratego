import {
  setRoomNumber,
  changeScreen,
  SCREEN,
  setActivePlayer,
  PLAYER,
  updateBoard,
  updateHand1,
  updateHand2
} from "./actions";

export const SET_SOCKETIO_CLIENT = "SET_SOCKETIO_CLIENT";
export const SOCKET_CREATE_ROOM = "SOCKET_CREATE_ROOM";
export const SOCKET_JOIN_ROOM = "SOCKET_JOIN_ROOM";
export const SOCKET_PLAYER1_READY = "SOCKET_PLAYER1_READY";
export const SOCKET_PLAYER2_READY = "SOCKET_PLAYER2_READY";
export const SOCKET_SEND_BOARD_DATA = "SOCKET_SEND_BOARD_DATA";
export const SOCKET_BOARD_DATA_RECEIVED = "SOCKET_BOARD_DATA_RECEIVED"; //??do I use this ??
export const SOCKET_SET_BOARD_DATA_RECEIVED = "SOCKET_SET_BOARD_DATA_RECEIVED";
export const SOCKET_SEND_ITEMS_TO_ENEMY = "SOCKET_SEND_ITEMS_TO_ENEMY";
export const SOCKET_SEND_FIGHT_INFO_TO_ENEMY =
  "SOCKET_SEND_FIGHT_INFO_TO_ENEMY";
export const SOCKET_SET_MISSED_FIGHT_INFO = "SOCKET_SET_MISSED_FIGHT_INFO";
export const SOCKET_LEAVE_ROOM = "SOCKET_LEAVE_ROOM";

export const processBoardDataReceived = data => dispatch => {
  console.log("Board Data Received!", data);
  dispatch(updateBoard(data.board));
  dispatch(updateHand1(data.hand1));
  dispatch(updateHand2(data.hand2));
  dispatch(setActivePlayer(PLAYER.PLAYER2));
  dispatch(changeScreen(SCREEN.PREPARE));
  dispatch(setBoardDataReceived(true));
};

export const setMissedFightInfo = fight => ({
  type: SOCKET_SET_MISSED_FIGHT_INFO,
  payload: fight
});

export const setSocketIoCient = client => ({
  type: SET_SOCKETIO_CLIENT,
  payload: client
});

export const setBoardDataReceived = received => ({
  type: SOCKET_SET_BOARD_DATA_RECEIVED,
  payload: received
});

export const setPlayer1Ready = (ready = true) => ({
  type: SOCKET_PLAYER1_READY,
  payload: ready
});

export const setPlayer2Ready = (ready = true) => ({
  type: SOCKET_PLAYER2_READY,
  payload: ready
});

//async actions with thunk....

export const leaveRoom = roomId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const socket = state.socket.io;

    if (!socket) {
      reject({ message: "Invalid Socket! Try again a bit later!" });
    }
    socket.emit("leave-room", roomId, data => {
      if (data.status === "ok") {
        dispatch({ type: SOCKET_LEAVE_ROOM });
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
};

export const sendFightInfoToEnemy = (roomId, fight) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const socket = state.socket.io;

    if (!socket) {
      reject({ message: "Invalid Socket! Try again a bit later!" });
    }
    socket.emit(
      "sync-action",
      roomId,
      { type: "fightData", data: fight },
      true,
      data => {
        if (data.status === "ok") {
          resolve(data);
        } else {
          reject(data);
        }
      }
    );
  });
};

export const sendItemsToEnemy = roomId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const socket = state.socket.io;
    const itemsData = state.board.items;

    if (!socket) {
      reject({ message: "Invalid Socket! Try again a bit later!" });
    }
    socket.emit(
      "sync-action",
      roomId,
      { type: "itemsData", data: itemsData },
      true,
      data => {
        if (data.status === "ok") {
          resolve(data);
        } else {
          reject(data);
        }
      }
    );
  });
};

export const sendBoardData = roomId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const socket = state.socket.io;
    const boardData = {
      board: state.board.board,
      hand1: state.board.hand1,
      hand2: state.board.hand2
    };
    if (!socket) {
      reject({ message: "Invalid Socket! Try again a bit later!" });
    }
    socket.emit(
      "sync-action",
      roomId,
      { type: "boardData", data: boardData },
      true,
      data => {
        if (data.status === "ok") {
          resolve(data);
        } else {
          reject(data);
        }
      }
    );
  });
};

export const createNewRoom = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const socket = getState().socket.io;
    if (!socket) {
      reject({ message: "Invalid Socket! Try again a bit later!" });
    }
    socket.emit("create-room", data => {
      if (data.status === "ok") {
        dispatch({ type: SOCKET_CREATE_ROOM }); //just to log the event
        dispatch(setRoomNumber(data.roomId));
        dispatch(setActivePlayer(PLAYER.PLAYER1));
        dispatch(changeScreen(SCREEN.SELECT_ROOM));
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
};

export const sendPlayerReadySignalToEnemy = (roomId, player, items) => (
  dispatch,
  getState
) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const socket = state.socket.io;
    if (!socket) {
      reject({ message: "Invalid Socket! Try again a bit later!" });
    }
    socket.emit(
      "sync-action",
      roomId,
      { type: "playerReady", data: { player: player, items: items } },
      true,
      data => {
        if (data.status === "ok") {
          resolve(data);
        } else {
          reject(data);
        }
      }
    );
  });
};

export const joinRoom = roomId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const socket = getState().socket.io;
    if (!socket) {
      reject({ message: "Invalid Socket! Try again a bit later!" });
    }
    socket.emit("join-room", roomId, data => {
      if (data.status === "ok") {
        dispatch(setRoomNumber(roomId));
        resolve(data);
      } else {
        reject(data);
      }
    });
  });
};
