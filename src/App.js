import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { Game } from "./Components/Game";
import { Home } from "./Components/Home";
import { Prepare } from "./Components/Prepare";
import { SelectRoom } from "./Components/SelectRoom";
import { SCREEN } from "./Store/actions";

export default function App() {
  const activeScreen = useSelector(state => state.app.activeScreen);

  useEffect(() => {
    console.log("...init App...");
  }, []);

  const getScreenComponent = id => {
    switch (id) {
      case SCREEN.GAME:
        return <Game />;
      case SCREEN.HOME:
        return <Home />;
      case SCREEN.PREPARE:
        return <Prepare />;
      case SCREEN.SELECT_ROOM:
        return <SelectRoom />;
      default:
        return <Home />;
    }
  };

  return <>{getScreenComponent(activeScreen)}</>;
}
