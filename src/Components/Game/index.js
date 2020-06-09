import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Board } from "../Board";
import { Hand } from "../Hand";
import { useSelector, useDispatch } from "react-redux";
import {
  changeScreen,
  SCREEN,
  setRoomNumber,
  updateHighlighted,
  PLAYER,
  updateItem,
  setWaitingForEnemy
} from "../../Store/actions";

import "../../style/App.css";
import { Fight } from "../Fight";
import { Victory } from "../Victory";
import { HelpPanel } from "../HelpPanel";
import {
  sendItemsToEnemy,
  sendFightInfoToEnemy
} from "../../Store/networkActions";

export const Game = () => {
  const dispatch = useDispatch();
  const roomNumber = useSelector(state => state.app.roomNumber);
  const highlighted = useSelector(state => state.board.highlighted);
  const activePlayer = useSelector(state => state.app.activePlayer);
  const items = useSelector(state => state.board.items);
  const board = useSelector(state => state.board.board);
  const boardDim = useSelector(state => state.app.boardDim);
  const hand1 = useSelector(state => state.board.hand1);
  const hand2 = useSelector(state => state.board.hand2);
  const waitingForEnemy = useSelector(state => state.app.waitingForEnemy);
  const missedFightInfo = useSelector(state => state.socket.missedFightInfo);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isItOver, setIsItOver] = useState(false); //true if there is a Victory

  const [thereIsAFight, setThereIsAFight] = useState(false); //true if there is a fight ...
  const [fightDetails, setFightDetails] = useState({
    attacker: null,
    victim: null,
    result: null
  });

  useEffect(() => {
    console.log("Room Number:", roomNumber);
    //Player1 starts first ...
    if (activePlayer === PLAYER.PLAYER1) dispatch(setWaitingForEnemy(false));
    else dispatch(setWaitingForEnemy(true));
    resetHighlights();
  }, []);

  useEffect(() => {
    if (thereIsAFight) setTimeout(() => setThereIsAFight(false), 3000);
  }, [thereIsAFight]);

  useEffect(() => {
    if (missedFightInfo) {
      console.log("Missed fight!", missedFightInfo);
      if (missedFightInfo?.win) displayVictory(missedFightInfo?.result);
      else
        displayFight(
          missedFightInfo?.attacker,
          missedFightInfo?.victim,
          missedFightInfo?.result
        );
    }
  }, [missedFightInfo]);

  //if a player looses all soldiers, then the other wins
  useEffect(() => {
    if (!hasMoves(PLAYER.PLAYER1)) console.log("player1 has no moves!");
    if (!hasMoves(PLAYER.PLAYER2)) console.log("player2 has no moves!");
    if (!hasMoves(PLAYER.PLAYER1))
      displayVictory({
        win: true,
        winner: PLAYER.PLAYER2
      });
    if (!hasMoves(PLAYER.PLAYER2))
      displayVictory({
        win: true,
        winner: PLAYER.PLAYER1
      });
  }, [items]);

  const hasMoves = player =>
    items.find(
      e => !e.dead && !isNaN(parseInt(e.type, 10)) && e.owner === player
    );

  const quitGame = () => {
    dispatch(setRoomNumber(null));
    dispatch(changeScreen(SCREEN.HOME));
  };

  const getBoardItemByPos = (row, col) =>
    board.find(e => e.row === row && e.col === col);

  const getItemByPos = (row, col) =>
    items.find(e => e.position === getBoardItemByPos(row, col).id);

  const setItemPosition = (itemId, position) => {
    const oldItem = items.find(e => e.id === itemId);
    const newItem = { ...oldItem, position: position };
    dispatch(updateItem(newItem));
  };

  const resetHighlights = () => {
    setSelectedItemId(null);
    dispatch(updateHighlighted([]));
  };

  const getItemByPosId = id => items.find(e => e.position === id);
  const getNextEmptyHandSlot = hand => hand.find(e => !getItemByPosId(e.id));

  const getMaxDistancedEmptyBoardItems = (row, col, dist) => {
    let res = [];

    //probe forward in the same row...
    for (let i = 1; i <= dist && i + row < boardDim.rows; i++) {
      const item = getItemByPos(row + i, col);
      if (item) {
        if (item.owner !== activePlayer) {
          res = [...res, getBoardItemByPos(row + i, col).id];
          //console.log(`can attack:`, item);
        }
        break;
      }
      res = [...res, getBoardItemByPos(row + i, col).id];
    }
    //probe backward in the same row...
    for (let i = 1; i <= dist && row - i >= 0; i++) {
      const item = getItemByPos(row - i, col);
      if (item) {
        if (item.owner !== activePlayer) {
          res = [...res, getBoardItemByPos(row - i, col).id];
          //console.log(`can attack:`, item);
        }
        break;
      }
      res = [...res, getBoardItemByPos(row - i, col).id];
    }
    //probe forward in the same column...
    for (let i = 1; i <= dist && i + col < boardDim.columns; i++) {
      const item = getItemByPos(row, col + i);
      if (item) {
        if (item.owner !== activePlayer) {
          res = [...res, getBoardItemByPos(row, col + i).id];
          //console.log(`can attack:`, item);
        }
        break;
      }
      res = [...res, getBoardItemByPos(row, col + i).id];
    }
    //probe backward in the same column...
    for (let i = 1; i <= dist && col - i >= 0; i++) {
      const item = getItemByPos(row, col - i);
      if (item) {
        if (item.owner !== activePlayer) {
          res = [...res, getBoardItemByPos(row, col - i).id];
          //console.log(`can attack:`, item);
        }
        break;
      }
      res = [...res, getBoardItemByPos(row, col - i).id];
    }

    return res;
  };

  const setHighlightsAfterSelection = (item, boardItem) => {
    var elementsToHighlight = [boardItem.id];
    const row = boardItem.row;
    const col = boardItem.col;
    const value = parseInt(item.type, 10);
    if (isNaN(value)) return; //flags and bombs can't move!
    switch (value) {
      case 2:
        const emptyLines = getMaxDistancedEmptyBoardItems(
          row,
          col,
          boardDim.rows
        );
        elementsToHighlight = [...elementsToHighlight, ...emptyLines];
        break;
      default:
        const emptyNeighbours = getMaxDistancedEmptyBoardItems(row, col, 1);
        elementsToHighlight = [...elementsToHighlight, ...emptyNeighbours];
        break;
    }

    dispatch(updateHighlighted(elementsToHighlight));
  };

  //decide the outcome of a fight
  const concludeFight = (attacker, victim) => {
    if (victim.type === "flag")
      return {
        win: true,
        winner: attacker.owner,
        lives: [attacker],
        dies: [victim]
      };

    if (victim.type === "bomb") {
      //bomb always wins ... unless attacked by No.3
      if (attacker.type === "3") return { lives: [attacker], dies: [victim] };
      else return { lives: [victim], dies: [attacker] };
    }

    //if No.1 sneaks upon No.10 ...
    if (attacker.type === "1" && victim.type === "10") {
      return {
        lives: [attacker],
        dies: [victim]
      };
    }

    const attackerValue = parseInt(attacker.type, 10);
    const victimValue = parseInt(victim.type, 10);
    if (attackerValue > victimValue)
      return { lives: [attacker], dies: [victim] };
    if (victimValue > attackerValue)
      return { lives: [victim], dies: [attacker] };
    return { lives: [], dies: [attacker, victim] };
  };

  const logFight = (attacker, victim) => {
    console.log(
      `%cFIGHT!\n%c ${attacker.type} %c -vs-> %c ${victim.type} `,
      "color:hotpink;",
      `background-color:${attacker.owner === PLAYER.PLAYER1 ? "red" : "blue"};`,
      `background-color:black; color:gold;`,
      `background-color:${victim.owner === PLAYER.PLAYER1 ? "red" : "blue"};`
    );
  };

  const logFightResult = result => {
    if (result.win)
      console.log(
        `%cVICTORY!\n${
          result.winner === PLAYER.PLAYER1 ? "Player1" : "Player2"
        } captured the enemy flag!`,
        "color:black; background-color:gold;"
      );
  };

  const displayVictory = result => {
    setFightDetails({ result: result });
    setThereIsAFight(false);
    setIsItOver(true);
  };

  //show the splash screen
  const displayFight = (attacker, victim, result) => {
    const details = {
      attacker: attacker,
      victim: victim,
      result: result
    };
    setFightDetails(details);
    setThereIsAFight(true);
  };

  //move the dead bodies into the respective hands (gross!)
  const disposeTheBodies = result => {
    if (!result?.dies) return;
    result.dies.forEach(item => {
      const newItem = {
        ...item,
        //swap owner of dead soldiers, so players can see who they have killed
        owner: item.owner === PLAYER.PLAYER1 ? PLAYER.PLAYER2 : PLAYER.PLAYER1,
        position: getNextEmptyHandSlot(
          item.owner === PLAYER.PLAYER1 ? hand2 : hand1
        ).id,
        dead: true //mark them dead
      };
      dispatch(updateItem(newItem));
    });
  };

  const finishedRound = () => {
    resetHighlights();
    dispatch(setWaitingForEnemy(true));
    dispatch(sendItemsToEnemy(roomNumber));
  };

  //process the clicks on the playboard
  const onClickedBoard = (row, col) => {
    const item = getItemByPos(row, col);
    const boardItem = getBoardItemByPos(row, col);
    //console.log(`Board click on [r:${row}c:${col}] id:${item?.id}`, item);
    if (item) {
      //if clicked in an item that is a valid target
      if (item.owner !== activePlayer && highlighted.includes(boardItem.id)) {
        //...and it is an enemy soldier within reach
        if (!selectedItemId) return; //if not launchhing an attack
        const attacker = items.find(e => e.id === selectedItemId);
        logFight(attacker, item);
        const result = concludeFight(attacker, item);
        logFightResult(result);
        displayFight(attacker, item, result); //display fight details on screen
        dispatch(
          sendFightInfoToEnemy(roomNumber, {
            attacker: attacker,
            victim: item,
            result: result
          })
        );
        if (result.win) {
          dispatch(sendFightInfoToEnemy(roomNumber, result));
          displayVictory(result); //finish the game
        }
        disposeTheBodies(result); //remove the dead
        if (result.lives[0]?.id === attacker.id)
          //if the attacker lives, then move him ahead
          setItemPosition(attacker.id, getBoardItemByPos(row, col).id);
        finishedRound();
      } else if (
        item.owner === activePlayer &&
        !isNaN(parseInt(item.type, 10))
      ) {
        if (item.id === selectedItemId) {
          //clicked on same soldier ... spec.says we need to remove selection (silly ...)
          setSelectedItemId(null);
          resetHighlights();
        } else {
          //clicked on another friendly soldier
          setSelectedItemId(item.id);
          setHighlightsAfterSelection(item, getBoardItemByPos(row, col));
        }
      }
    }
    if (selectedItemId && !item) {
      //if there is an item selected and clicked on empty slot
      if (!highlighted.includes(boardItem.id)) return;
      console.log("Moving item!");
      setItemPosition(selectedItemId, boardItem.id);
      finishedRound();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {isItOver && (
        <Victory
          result={fightDetails.result}
          onClick={() => dispatch(changeScreen(SCREEN.HOME))}
        />
      )}
      {waitingForEnemy && <h2>Waiting for Enemy ...</h2>}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          {thereIsAFight && (
            <Fight
              attacker={fightDetails.attacker}
              victim={fightDetails.victim}
              result={fightDetails.result}
            />
          )}
          {activePlayer === PLAYER.PLAYER2 && (
            <Hand player={PLAYER.PLAYER2} onSelected={() => {}} />
          )}
          <Board
            onClickedBoard={waitingForEnemy ? () => {} : onClickedBoard}
            highlightedElements={highlighted}
          />
          {activePlayer === PLAYER.PLAYER1 && (
            <Hand player={PLAYER.PLAYER1} onSelected={() => {}} />
          )}
        </div>
        <HelpPanel />
      </div>
      <Button
        variant="primary"
        size="lg"
        className="control"
        style={{ alignSelf: "flex-start" }}
        onClick={quitGame}
      >
        Quit game
      </Button>
    </div>
  );
};
