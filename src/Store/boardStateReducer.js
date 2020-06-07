import {
  UPDATE_ITEMS,
  UPDATE_BOARD,
  UPDATE_HAND1,
  UPDATE_HAND2,
  UPDATE_HIGHLIGHTED,
  UPDATE_ITEM
} from "./actions";

const initState = {
  items: [], //the items on the board
  board: [], //the board
  hand1: [], //the hand of Player1
  hand2: [], //the hand of Player2
  highlighted: [] //id list of highlighted items
};

function reducer(state = initState, action) {
  switch (action.type) {
    case UPDATE_ITEMS:
      return {
        ...state,
        items: action.payload
      };
    case UPDATE_ITEM:
      const temp = state.items.filter(e => e.id !== action.payload.id);
      return {
        ...state,
        items: [...temp, action.payload]
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
