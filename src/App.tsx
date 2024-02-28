"use client";

import Loader from "@/components/Loader";
import Background from "@/models/Background";
import Deck from "@/models/Deck";
import Hand from "@/models/Hand";
import Stack from "@/models/Stack";
import VictorianTable from "@/models/VictorianTable";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import StackUI from "./components/StackUI";
import OthersCard from "./models/OthersCard";
import TableRotation from "./models/TableRotation";
import { cardProps } from "./types/types";

const maxPlayers = 4;

//Player Settings

export default function App({ updateSocket }) {
  const drawCard = useCallback(() => {
    console.log("drawCard");
    updateSocket.emit("drawCard");
  }, [updateSocket]);

  const playCard = useCallback(
    (id, name) => {
      console.log("playCard");
      updateSocket.emit("playCard", {
        id: id,
        name: name,
      });
    },
    [updateSocket]
  );

  const hoverCard = useCallback(
    (id) => {
      console.log("hover");
      updateSocket.emit("hoverCard", {
        id: id,
        playerId: socketId.current,
      });
    },
    [updateSocket]
  );

  const removeCard = useCallback(
    (id) => {
      console.log("removeCard");
      updateSocket.emit("removeCard", {
        id: id,
      });
    },
    [updateSocket]
  );

  const socketId = useRef<string>();
  const seatIndex = useRef<number>(0);
  const theta = (seatIndex.current * Math.PI * 2) / maxPlayers;
  //Frontend
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [cards, setCards] = useState<cardProps[]>([]);
  const [serverData, setServerData] = useState([]);

  const [cardStack, setCardStack] = useState<cardProps[]>([]);

  const [deckLength, setDeckLength] = useState<number>(60);

  const [bgColor, setBgColor] = useState<string>("blue");
  const [rotationDirection, setRotationDirection] = useState<boolean>(true);

  useEffect(() => {
    // no-op if the socket is already connected
    updateSocket.connect();

    return () => {
      updateSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    updateSocket.emit("join");

    const onInfo = (data) => {};

    const onAddCard = ({ playerID, id, name, deckLength }) => {};

    const onShuffleBack = ({ stack, deckLength }) => {};

    const onReverse = ({ rotationDirection }) => {};

    const onPlayedCard = (data) => {};

    updateSocket.on("info", onInfo);
    updateSocket.on("addCard", onAddCard);
    updateSocket.on("playedCard", onPlayedCard);
    updateSocket.on("reverse", onReverse);
    updateSocket.on("shuffledBack", onShuffleBack);

    return () => {
      updateSocket.off("info", onInfo);
      updateSocket.off("addCard", onAddCard);
      updateSocket.off("playedCard", onPlayedCard);
      updateSocket.off("reverse", onReverse);
      updateSocket.off("shuffledBack", onShuffleBack);
    };
  }, []);

  return (
    <div className="relative h-screen w-full">
      <Canvas
        className="h-screen w-full bg-transparent"
        camera={{
          near: 0.1,
          far: 1000,
          position: [0, 7, 6],
        }}
      >
        <Suspense fallback={<Loader />}>
          <axesHelper args={[10]} />
          <ambientLight intensity={1} color={"white"} />
          <VictorianTable position={[0, -3.6, 0]} />
          <Stack cardStack={cardStack} position={[0, 1.8, 0]} />
          <Deck
            deckLength={deckLength}
            position={[1, 0, 0]}
            drawCard={drawCard}
          />

          <Hand
            rotation={[0, theta, 0]}
            cards={cards}
            setCards={setCards}
            hoverCard={hoverCard}
            setIsDragging={setIsDragging}
            isDragging={isDragging}
            playCard={playCard}
          />

          <Background bgColor={bgColor} />
          <TableRotation rotationDirection={rotationDirection} />

          <OrbitControls enableZoom={true} enabled={!isDragging} />

          {serverData.map(
            (player) =>
              player &&
              player.id !== socketId.current &&
              player.cards.map((card, index) => (
                <OthersCard key={index} name={card.name} />
              ))
          )}
        </Suspense>
      </Canvas>
      <StackUI cardStack={cardStack} removeCard={removeCard} />
    </div>
  );
}
