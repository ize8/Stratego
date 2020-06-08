import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "../../style/join.css";

import { useDispatch, useSelector } from "react-redux";
import { changeScreen, SCREEN, setRoomNumber } from "../../Store/actions";
import { joinRoom, setBoardDataReceived } from "../../Store/networkActions";

export const SelectRoom = () => {
  const roomCode = useRef(null);
  const dispatch = useDispatch();
  const roomNumber = useSelector(state => state.app.roomNumber);
  const [inputNumber, setInputNumber] = useState(0);

  const startGame = async () => {
    if (!roomNumber) {
      try {
        setBoardDataReceived(false);
        const res = await dispatch(joinRoom(inputNumber));
        console.log("Joined room!", res);
      } catch (err) {
        alert(`Server ERROR!\n${err.message}`);
      }
    } else {
      dispatch(changeScreen(SCREEN.PREPARE));
    }
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
          <h2 className="title">Room ID: </h2>
          <textarea
            className="roomNumber"
            type="text"
            ref={roomCode}
            value={roomNumber}
            readOnly
            style={{ fontSize: "15px", resize: "none", textAlign: "center" }}
          />
          <Button variant="primary" id="copy" onClick={onCopy}>
            Copy
          </Button>
        </article>
      ) : (
        <section>
          <article>
            <h2 className="title">Enter room ID: </h2>
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
          {roomNumber ? "Start Game" : "Join Game"}
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
