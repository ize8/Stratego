import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import "../../../style/App.css";
import { nanoid } from "nanoid";

import { useDispatch } from "react-redux";
import { changeScreen, SCREEN, setRoomNumber } from "../../Store/actions";

export const Home = () => {
  const dispatch = useDispatch();

  const startNewGame = () => {
    dispatch(setRoomNumber(nanoid(5)));
    dispatch(changeScreen(SCREEN.SELECT_ROOM));
  };

  const joinRoom = () => {
    dispatch(setRoomNumber(null));
    dispatch(changeScreen(SCREEN.SELECT_ROOM));
  };

  return (
    <div className="App">
      <h1 className="title">STRATEGO</h1>
      <nav>
        <Button
          variant="primary"
          size="lg"
          block
          className="Button"
          onClick={startNewGame}
        >
          Start new game
        </Button>
        <Button
          variant="primary"
          size="lg"
          block
          className="Button"
          onClick={joinRoom}
        >
          Join room
        </Button>
        <a href="http://www.ketaklub.hu/letoltes/Stratego%20Aoriginal%20Piatnik.pdf">
          <Button variant="primary" size="lg" block className="Button">
            Game rules
          </Button>
        </a>
      </nav>
    </div>
  );
};
