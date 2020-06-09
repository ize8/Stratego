import {
  UPDATE_ITEMS,
  UPDATE_BOARD,
  UPDATE_HAND1,
  UPDATE_HAND2,
  UPDATE_HIGHLIGHTED,
  UPDATE_ITEM,
  UPDATE_PLAYER_ITEMS
} from "./actions";

const initState = {
  items: [], //the items on the board
  board: [], //the board
  hand1: [], //the hand of Player1
  hand2: [], //the hand of Player2
  highlighted: [] //id list of highlighted items
};

function reducer(state = initState, action) {
  let temp = [];
  switch (action.type) {
    case UPDATE_ITEMS:
      return {
        ...state,
        items: action.payload
      };
    case UPDATE_ITEM:
      temp = state.items.filter(e => e.id !== action.payload.id);
      return {
        ...state,
        items: [...temp, action.payload]
      };
    case UPDATE_PLAYER_ITEMS:
      temp = state.items.filter(e => e.owner !== action.payload.player);
      return {
        ...state,
        items: [...temp, ...action.payload.items]
      };
    case UPDATE_BOARD:
      return {
        ...state,
        board: action.payload
      };
    case UPDATE_HAND1:
      return {
        ...state,
        hand1: action.payload
      };
    case UPDATE_HAND2:
      return {
        ...state,
        hand2: action.payload
      };
    case UPDATE_HIGHLIGHTED:
      return {
        ...state,
        highlighted: action.payload
      };
    default:
      return state;
  }
}

export default reducer;
