export const SCREEN = {
  HOME: 1,
  SELECT_ROOM: 2,
  PREPARE: 3,
  GAME: 4
};

export const PLAYER = {
  PLAYER1: 1,
  PLAYER2: 2
};

export const CHANGE_SCREEN = "CHANGE_SCREEN";
export const SET_ROOM_NUMBER = "SET_ROOM_NUMBER";
export const UPDATE_ITEMS = "UPDATE_ITEMS";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const UPDATE_BOARD = "UPDATE_BOARD";
export const UPDATE_HAND1 = "UPDATE_HAND1";
export const UPDATE_HAND2 = "UPDATE_HAND2";
export const UPDATE_HIGHLIGHTED = "UPDATE_HIGHLIGHTED";
export const SWITCH_PLAYER = "SWITCH_PLAYER";

export const changeScreen = screenId => ({
  type: CHANGE_SCREEN,
  payload: screenId
});

export const setRoomNumber = number => ({
  type: SET_ROOM_NUMBER,
  payload: number
});

export const updateItems = items => ({
  type: UPDATE_ITEMS,
  payload: items
});

export const updateItem = item => ({
  type: UPDATE_ITEM,
  payload: item
});

export const updateBoard = board => ({
  type: UPDATE_BOARD,
  payload: board
});

export const updateHand1 = hand => ({
  type: UPDATE_HAND1,
  payload: hand
});

export const updateHand2 = hand => ({
  type: UPDATE_HAND2,
  payload: hand
});

export const updateHighlighted = list => ({
  type: UPDATE_HIGHLIGHTED,
  payload: list
});

export const switchPlayer = () => ({
  type: SWITCH_PLAYER
});
