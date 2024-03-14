import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Game from "./components/Game";
import MainMenu from "./components/MainMenu";

export default function App({ updateSocket }) {
  /* --------------------------------- States --------------------------------- */
  const [connected, setConnected] = useState(false);
  /* ------------------------------ Socket Events ----------------------------- */
  useEffect(() => {
    updateSocket.connect();
    return () => updateSocket.disconnect();
  }, []);

  /* ------------------------------- Render ------------------------------- */
  return (
    <div className="relative h-screen w-full">
      <Canvas
        className="h-screen w-full bg-transparent"
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        {connected ? (
          <Game updateSocket={updateSocket} />
        ) : (
          <MainMenu updateSocket={updateSocket} setConnected={setConnected} />
        )}
      </Canvas>
    </div>
  );
}
