import {
  CHANGE_SCREEN,
  SCREEN,
  SET_ROOM_NUMBER,
  PLAYER,
  SWITCH_PLAYER
} from "./actions";

/*
Babuk:
1 zászló
2 bomba
1 kém (1)
2 felderítő (2)
2 aknász (3)
1 4-es
1 6-os
1 8-as
1 10-es
*/

export const STARTING_SET = [
  {
    label: "flag",
    count: 1
  },
  {
    label: "bomb",
    count: 2
  },
  {
    label: "1",
    count: 1
  },
  {
    label: "2",
    count: 2
  },
  {
    label: "3",
    count: 2
  },
  {
    label: "4",
    count: 1
  },
  {
    label: "6",
    count: 1
  },
  {
    label: "8",
    count: 1
  },
  {
    label: "10",
    count: 1
  }
];

//check if our starting set fills the first two rows ....
export const checkStartingCount = () =>
  STARTING_SET.reduce((total, item) => total + item.count, 0) ===
  initState.boardDim.columns * 2
    ? true
    : false;

const initState = {
  activeScreen: SCREEN.HOME, //active screen
  roomNumber: null, //active room id
  boardDim: {
    //board dimensions
    rows: 6,
    columns: 6
  },
  activePlayer: PLAYER.PLAYER1 //the active player
};

function reducer(state = initState, action) {
  switch (action.type) {
    case CHANGE_SCREEN:
      return {
        ...state,
        activeScreen: action.payload
      };
    case SET_ROOM_NUMBER:
      return {
        ...state,
        roomNumber: action.payload
      };
    case SWITCH_PLAYER:
      return {
        ...state,
        activePlayer:
          state.activePlayer === PLAYER.PLAYER1
            ? PLAYER.PLAYER2
            : PLAYER.PLAYER1
      };
    default:
      return state;
  }
}

export default reducer;
