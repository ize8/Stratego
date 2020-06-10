import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";

import { STARTING_SET } from "../../Store/appStatusReducer";

import { useDispatch, useSelector } from "react-redux";
import {
  changeScreen,
  SCREEN,
  setRoomNumber,
  updateItems,
  PLAYER,
  updateHighlighted,
  updatePlayerItems
} from "../../Store/actions";
import { Board } from "../Board";
import { Hand } from "../Hand";
import { sendPlayerReadySignalToEnemy } from "../../Store/networkActions";

export const Prepare = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.board.items);
  const board = useSelector(state => state.board.board);
  const hand1 = useSelector(state => state.board.hand1);
  const hand2 = useSelector(state => state.board.hand2);
  const boardDim = useSelector(state => state.app.boardDim);
  const roomNumber = useSelector(state => state.app.roomNumber);
  const activePlayer = useSelector(state => state.app.activePlayer);
  const player1Ready = useSelector(state => state.socket.player1Ready);
  const player2Ready = useSelector(state => state.socket.player1Ready);
  const enemyReady =
    activePlayer === PLAYER.PLAYER1 ? player2Ready : player1Ready;

  const boardDataReceived = useSelector(
    state => state.socket.boardDataReceived
  );
  const highlightedElements = useSelector(state => state.board.highlighted);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isHandEmpty, setIsHandEmpty] = useState(false);
  const [amIReady, setAmIReady] = useState(false);

  useEffect(() => {
    if (activePlayer === PLAYER.PLAYER1) {
      console.log("Creating Player1's board!");
      const player1Items = genStartingSet(PLAYER.PLAYER1, true); //SWITCH BACK TO FALSE!!
      //const player2Items = genStartingSet(PLAYER.PLAYER2, true); //SWITCH BACK TO FALSE!!
      dispatch(updatePlayerItems(PLAYER.PLAYER1, player1Items));
      resetHighlights();
    }
  }, []);

  useEffect(() => {
    if (boardDataReceived) {
      console.log("Creating Player2's board!");
      //const player1Items = genStartingSet(PLAYER.PLAYER1, true); //SWITCH BACK TO FALSE!!
      const player2Items = genStartingSet(PLAYER.PLAYER2, true); //SWITCH BACK TO FALSE!!
      dispatch(updatePlayerItems(PLAYER.PLAYER2, player2Items));
      resetHighlights();
    }
  }, [boardDataReceived]);

  useEffect(() => {
    if (amIReady && enemyReady) {
      console.log("Both players are ready!!");
      dispatch(changeScreen(SCREEN.GAME));
    }
  }, [amIReady, enemyReady]);

  const cancel = () => {
    dispatch(setRoomNumber(null));
    dispatch(changeScreen(SCREEN.HOME));
  };

  const startGame = () => {
    setAmIReady(true);
    dispatch(
      sendPlayerReadySignalToEnemy(
        roomNumber,
        activePlayer,
        items.filter(e => e.owner === activePlayer)
      )
    )
      .then(res => {
        console.log("Ready signal sent to enemy!", res);
      })
      .catch(err => {
        console.log("Unable to send ready signal to enemy!", err);
      });
  };

  //run func on elements in respective player's starting field (row 1-2)
  const runOnPlayerStartField = (player, func) => {
    for (
      var row = player === PLAYER.PLAYER2 ? 0 : boardDim.rows - 1;
      player === PLAYER.PLAYER2 ? row < 2 : row > boardDim.rows - 3;
      player === PLAYER.PLAYER2 ? row++ : row--
    ) {
      for (var col = 0; col < boardDim.columns; col++) {
        func(row, col);
      }
    }
  };

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getBoardItemByPos = (row, col) =>
    board.find(e => e.row === row && e.col === col);

  const getNextHandItem = (hand, taken) =>
    hand.find(e => !taken.includes(e.id));

  //generates starter kit based on store, if placeOnBoard is true, then
  //places the soldiers on the board in a random manner
  const genStartingSet = (player, placeOnBoard = false) => {
    let startingSet = JSON.parse(JSON.stringify(STARTING_SET));
    let set = [];
    let taken = [];

    runOnPlayerStartField(player, async (row, col) => {
      startingSet = startingSet.filter(e => e.count > 0);
      const rndPos = getRandomInt(0, startingSet.length - 1);
      const rndItem = startingSet[rndPos];
      const position = placeOnBoard
        ? getBoardItemByPos(row, col).id
        : getNextHandItem(player === PLAYER.PLAYER1 ? hand1 : hand2, taken).id;
      if (!placeOnBoard) taken = [...taken, position];
      set = [
        ...set,
        {
          id: nanoid(10),
          position: position,
          owner: player,
          type: rndItem.label,
          dead: false
        }
      ];
      startingSet[rndPos].count -= 1;
    });
    return set;
  };

  const getItemByPos = (row, col) =>
    items.find(e => e.position === getBoardItemByPos(row, col).id);

  useEffect(() => {
    if (checkEmptyHand(activePlayer)) setIsHandEmpty(true);
    else setIsHandEmpty(false);
  }, [items]);

  const resetHighlights = () => {
    setSelectedItemId(null);
    dispatch(updateHighlighted([]));
  };

  const checkEmptyHand = player => {
    const hand = player === PLAYER.PLAYER1 ? hand1 : hand2;
    for (let i = 0; i < hand.length; i++) {
      if (items.find(el => el.position === hand[i].id)) return false;
    }
    return true;
  };

  const setItemPosition = (itemId, position) => {
    const newItems = items.map(e => {
      if (e.id !== itemId) return e;
      return { ...e, position: position };
    });
    dispatch(updateItems(newItems));
  };

  const onClickedBoard = (row, col) => {
    const item = getItemByPos(row, col);
    console.log(`Board click on [r:${row}c:${col}] id:${item?.id}`, item);
    if (item) {
      //if clicked in an item
      if (item?.owner !== activePlayer) return;
      setSelectedItemId(item.id);
      setHighlightsAfterSelection(item.owner, getBoardItemByPos(row, col).id);
    }
    if (selectedItemId && !item) {
      //if there is an item selected and clicked on empty slot
      const boardItem = getBoardItemByPos(row, col);
      if (!highlightedElements.includes(boardItem.id)) return;
      console.log("Moving item!");
      setItemPosition(selectedItemId, boardItem.id);
      resetHighlights();
    }
  };

  const setHighlightsAfterSelection = (player, elementId) => {
    var elementsToHighlight = [elementId];
    runOnPlayerStartField(player, (row, col) => {
      if (!getItemByPos(row, col))
        elementsToHighlight = [
          ...elementsToHighlight,
          getBoardItemByPos(row, col).id
        ];
    });
    dispatch(updateHighlighted(elementsToHighlight));
  };

  const onClickedHand = elementId => {
    const item = items.find(e => e.position === elementId);
    console.log("handElementId:", elementId, "item:", item);
    if (selectedItemId) {
      //if there is a seleted item
      if (!item) {
        //if clicked on empty hand slot
        console.log("Moving back to hand slot");
        setItemPosition(selectedItemId, elementId);
        resetHighlights();
      } else {
        //clicked on same soldier ... spec.says we need to remove selection (silly ...)
        if (selectedItemId === item.id) {
          setSelectedItemId(null);
          resetHighlights();
        } else {
          setSelectedItemId(item.id);
          setHighlightsAfterSelection(activePlayer, elementId);
        }
      }
    } else {
      //if no item selected yet
      if (item) {
        //if clicked on an item
        console.log(
          `${
            item?.owner === PLAYER.PLAYER1 ? "Player1" : "Player2"
          } hand clicked on item [${item.id}] at handElement [${elementId}]`
        );
        console.log("selectedItemId:", selectedItemId, item.id);
        if (!selectedItemId) {
          setSelectedItemId(item.id);
          setHighlightsAfterSelection(activePlayer, elementId);
        }
      } else {
        console.log("empty hand item click");
      }
    }
  };

  return (
    <div className="page">
      <div className="pageContainer">
        <section>
          <h2 className="title">Place your players onto the board!</h2>
        </section>
        {activePlayer === PLAYER.PLAYER2 && (
          <Hand
            player={PLAYER.PLAYER2}
            onSelected={amIReady ? () => {} : onClickedHand}
          />
        )}
        <Board
          hidePlayer1={activePlayer === PLAYER.PLAYER2}
          hidePlayer2={activePlayer === PLAYER.PLAYER1}
          onClickedBoard={amIReady ? () => {} : onClickedBoard}
          highlightedElements={highlightedElements}
        />
        {activePlayer === PLAYER.PLAYER1 && (
          <Hand
            player={PLAYER.PLAYER1}
            onSelected={amIReady ? () => {} : onClickedHand}
          />
        )}
        <section id="startGameControll">
          {amIReady || (
            <button disabled={!isHandEmpty} onClick={startGame}>
              Play
            </button>
          )}

          <button onClick={cancel}>Cancel</button>
        </section>
        {enemyReady ? (
          <h3>{`${
            activePlayer === PLAYER.PLAYER1 ? "Player2" : "Player1"
          } is ready for battle!`}</h3>
        ) : (
          <h3 className="title">{`${
            activePlayer === PLAYER.PLAYER1 ? "Player2" : "Player1"
          } is getting ready!`}</h3>
        )}
      </div>
    </div>
  );
};
