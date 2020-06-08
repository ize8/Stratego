import {
  SET_SOCKETIO_CLIENT,
  SOCKET_CREATE_ROOM,
  SOCKET_PLAYER2_READY,
  SOCKET_PLAYER1_READY,
  SOCKET_SET_BOARD_DATA_RECEIVED
} from "./networkActions";

const initState = {
  url: "http://webprogramozas.inf.elte.hu:3030",
  io: null,
  boardDataReceived: false,
  player1Ready: false,
  player2Ready: false
};

function reducer(state = initState, action) {
  switch (action.type) {
    case SET_SOCKETIO_CLIENT:
      console.log("Socket saved:", action.payload);
      return {
        ...state,
        io: action.payload
      };
    case SOCKET_SET_BOARD_DATA_RECEIVED:
      return { ...state, boardDataReceived: action.payload };
    case SOCKET_CREATE_ROOM:
      return {
        ...state
      };
    case SOCKET_PLAYER1_READY:
      return {
        ...state,
        player1Ready: action.payload
      };
    case SOCKET_PLAYER2_READY:
      return {
        ...state,
        player2Ready: action.payload
      };
    default:
      return state;
  }
}

export default reducer;