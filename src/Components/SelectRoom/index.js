import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "../../style/join.css";

import { useDispatch, useSelector } from "react-redux";
import { changeScreen, SCREEN, setRoomNumber } from "../../Store/actions";

export const SelectRoom = () => {
  const roomCode = useRef(null);
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

  const fallbackCopy = () => {
    //works on every browser
    console.log("...copying as a caveman...");
    roomCode.current.select();
    document.execCommand("copy");
  };

  const onCopy = () => {
    if (navigator) {
      //only works when served over https!
      navigator.clipboard.writeText(roomNumber).then(
        function() {
          console.log("Async: Copying to clipboard was successful!");
        },
        function(err) {
          console.error("Async: Could not copy text: ", err);
          fallbackCopy();
        }
      );
    } else fallbackCopy();
  };

  return (
    <div className="App2">
      {roomNumber ? (
        <article>
          <h2 className="title">Room number: </h2>
          <input
            className="roomNumber"
            type="text"
            ref={roomCode}
            value={roomNumber}
            readOnly
          />
          <Button variant="primary" id="copy" onClick={onCopy}>
            Copy
          </Button>
        </article>
      ) : (
        <section>
          <article>
            <h2 className="title">Enter room number: </h2>
            <input
              className="roomNumber"
              type="text"
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
