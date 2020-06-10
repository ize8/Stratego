import React, { useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { changeScreen, SCREEN, setRoomNumber } from "../../Store/actions";
import { joinRoom, setBoardDataReceived } from "../../Store/networkActions";

export const SelectRoom = () => {
  const roomCode = useRef(null);
  const dispatch = useDispatch();
  const roomNumber = useSelector(state => state.app.roomNumber);
  const [inputNumber, setInputNumber] = useState("");
  const [joining, setJoining] = useState(false);

  const startGame = async () => {
    if (!roomNumber) {
      try {
        setBoardDataReceived(false);
        setJoining(true);
        const res = await dispatch(joinRoom(inputNumber));
        console.log("Joined room!", res);
      } catch (err) {
        alert(`Server ERROR!\n${err.message}`);
        setJoining(false);
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
    <div className="page">
      <div className="pageContainer">
        {roomNumber && !joining ? (
          <div>
            <h2 className="title">Room ID: </h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              <textarea
                className="roomNumber"
                type="text"
                ref={roomCode}
                value={roomNumber}
                readOnly
              />
              <button onClick={onCopy}>Copy</button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="title">Enter room ID: </h2>
            <input
              className="roomNumber"
              type="text"
              value={inputNumber}
              onChange={e => setInputNumber(e.target.value)}
            />
          </div>
        )}
        <div id="gameControll">
          <button onClick={startGame} disabled={joining}>
            {roomNumber ? "Start Game" : "Join Game"}
          </button>
          <button onClick={cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
