import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "../../../style/join.css";

import { useDispatch, useSelector } from "react-redux";
import { changeScreen, SCREEN, setRoomNumber } from "../../Store/actions";

export const SelectRoom = () => {
  const dispatch = useDispatch();
  const roomNumber = useSelector(state => state.app.roomNumber);
  const [inputNumber, setInputNumber] = useState(0);

  const startGame = () => {
    if (!roomNumber) dispatch(setRoomNumber(Number(inputNumber)));
    dispatch(changeScreen(SCREEN.PREPARE));
  };

  const cancel = () => {
    dispatch(setRoomNumber(null));
    dispatch(changeScreen(SCREEN.HOME));
  };

  return (
    <div className="App2">
      {roomNumber ? (
        <article>
          <h2 className="title">Room number: </h2>
          <input
            className="roomNumber"
            type="text"
            value={"#" + roomNumber}
            readOnly
          />
          <Button variant="primary" id="copy">
            Copy
          </Button>
        </article>
      ) : (
        <section>
          <article>
            <h2 className="title">Enter room number: </h2>
            <input
              className="roomNumber"
              type="number"
              value={inputNumber}
              onChange={e => setInputNumber(e.target.value)}
            />
          </article>
        </section>
      )}
      <section id="gameControll">
        <Button
          variant="primary"
          size="lg"
          block
          className="control"
          onClick={startGame}
        >
          Start game
        </Button>
        <Button
          variant="primary"
          size="lg"
          block
          className="control"
          onClick={cancel}
        >
          Cancel
        </Button>
      </section>
    </div>
  );
};
