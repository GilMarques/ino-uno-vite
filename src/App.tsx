import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Game from "./components/Game";
import MainMenu from "./components/MainMenu";

//Player Settings
// const seat = Math.floor(Math.random() * maxPlayers);

/* ------------------------------ Aux Functions ----------------------------- */

function createShiftedArray(arr, shift) {
  const length = arr.length;
  if (length === 0) {
    return arr.slice(); // Return a shallow copy of the original array
  }

  // Normalize shift value to be within the range of the array length
  shift %= length;

  const shiftedIndices = arr.map((_, index) => {
    let newIndex = index + shift;
    if (newIndex < 0) {
      newIndex += length; // Wrap around for negative indices
    } else if (newIndex >= length) {
      newIndex -= length; // Wrap around for indices beyond array length
    }
    return newIndex;
  });

  return shiftedIndices.map((index) => arr[index]);
}

function findUniqueElements(array1, array2) {
  const uniqueElements = [];

  // Check for elements unique to array1
  array1.forEach((tuple) => {
    if (
      !array2.some((t) => t.id === tuple.id) &&
      !uniqueElements.some((obj) => obj.id === tuple.id)
    ) {
      uniqueElements.push({ id: tuple.id, name: tuple.name, fromArray: 1 });
    }
  });

  // Check for elements unique to array2
  array2.forEach((tuple) => {
    if (
      !array1.some((t) => t.id === tuple.id) &&
      !uniqueElements.some((obj) => obj.id === tuple.id)
    ) {
      uniqueElements.push({ id: tuple.id, name: tuple.name, fromArray: 2 });
    }
  });

  return uniqueElements;
}

//end section
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
