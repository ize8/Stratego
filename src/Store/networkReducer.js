import {
  SET_SOCKETIO_CLIENT,
  SOCKET_CREATE_ROOM,
  SOCKET_PLAYER2_READY,
  SOCKET_PLAYER1_READY,
  SOCKET_SET_BOARD_DATA_RECEIVED,
  SOCKET_SET_MISSED_FIGHT_INFO,
  SOCKET_SET_PLAYER2_JOINED
} from "./networkActions";

const initState = {
  url: "http://webprogramozas.inf.elte.hu:3030",
  io: null,
  boardDataReceived: false,
  player1Ready: false,
  player2Ready: false,
  player2Joined: false,
  missedFightInfo: null
};

function reducer(state = initState, action) {
  switch (action.type) {
    case SET_SOCKETIO_CLIENT:
      console.log("Socket saved:", action.payload);
      return {
        ...state,
        io: action.payload
      };
    case SOCKET_SET_PLAYER2_JOINED:
      return {
        ...state,
        player2Joined: action.payload
      };
    case SOCKET_SET_MISSED_FIGHT_INFO:
      return {
        ...state,
        missedFightInfo: action.payload
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
