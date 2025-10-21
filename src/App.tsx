import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

import Game from "./components/game/Game";

import ConnectionError from "./components/ConnectionError";
import DeckUI from "./components/DeckUI";
import MainMenu from "./components/menu/MainMenu";
import StackUI from "./components/StackUI";

import { useDispatch, useSelector } from "react-redux";
import { loadTextures3D } from "./lib/loadTextures";
import { connectSocket } from "./state/socket/socketActions";
import type { RootState } from "./state/store";

export default function App() {
  const [ready, setReady] = useState(false);

  const [rotate, setRotate] = useState(false);
  const [fade, setFade] = useState(false);

  const connected = useSelector((state: RootState) => state.socket.connected);
  const error = useSelector((state: RootState) => state.socket.error);

  const dispatch = useDispatch();

  useEffect(() => {
    if (connected) setFade(false);
  }, [connected]);

  const handleClick = () => {
    if (rotate) return;
    setRotate(true);
    setFade(true);
    const timeout = setTimeout(() => {
      dispatch(connectSocket());
    }, 500);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    loadTextures3D();
    setReady(true);
  }, []);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    ready && (
      <div className="relative">
        <div
          className={`relative h-screen w-full transition-opacity transition- duration-500 ${
            fade ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Canvas
            className="h-screen w-full bg-transparent"
            camera={{
              position: [0, 0, 5],
            }}
          >
            {!connected && <MainMenu rotate={rotate} onClick={handleClick} />}
            {connected && <Game />}
          </Canvas>
          {connected && <StackUI />}
          {connected && <DeckUI />}
        </div>
        {error && <ConnectionError onRetry={() => dispatch(connectSocket())} />}
      </div>
    )
  );
}
