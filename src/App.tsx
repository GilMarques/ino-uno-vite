"use client";

import Loader from "@/components/Loader";
import Background from "@/models/Background";
import Deck from "@/models/Deck";
import Hand from "@/models/Hand";
import Stack from "@/models/Stack";
import VictorianTable from "@/models/VictorianTable";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import StackUI from "./components/StackUI";
import OtherHand from "./models/OtherHand";
import TableRotation from "./models/TableRotation";
import { cardProps } from "./types/types";

const maxPlayers = 4;

//Player Settings
const seat = Math.floor(Math.random() * maxPlayers);

export default function App({ updateSocket }) {
  const drawCard = useCallback(() => {
    updateSocket.emit("drawCard", seat);
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
      // console.log("hover");
      // updateSocket.emit("hoverCard", {
      //   id: id,
      //   playerId: socketId.current,
      // });
    },
    [updateSocket]
  );

  const removeCard = useCallback(
    (card) => {
      console.log("stackRemove");
      updateSocket.emit("stackRemove", {
        seat,
        card,
      });
    },
    [updateSocket]
  );

  const theta = (seat * (Math.PI * 2)) / maxPlayers;
  //Frontend
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [serverData, setServerData] = useState([]);
  const [cards, setCards] = useState<cardProps[]>([]);

  const [cardStack, setCardStack] = useState<cardProps[]>([]);

  const [deckLength, setDeckLength] = useState<number>(60);

  const [bgColor, setBgColor] = useState<string>("white");
  const [rotationDirection, setRotationDirection] = useState<boolean>(true);

  useEffect(() => {
    if (serverData.length)
      setCards((prev) => [...serverData[seat].cards, ...prev]);
  }, [serverData]);

  useEffect(() => {
    updateSocket.connect();
    return () => updateSocket.disconnect();
  }, []);

  useEffect(() => {
    console.log("seat", seat);
    updateSocket.emit("join", seat);

    const onPlayerJoined = ({
      serverData,
      serverStack,
      deckLength,
      serverColor,
      serverRotation,
    }) => {
      setServerData(serverData);
      setCardStack(serverStack);
      setDeckLength(deckLength);
      setBgColor(serverColor);
      setRotationDirection(serverRotation);
    };

    const onCardDrawn = ({ serverData, deckLength }) => {
      setServerData(serverData);
      setDeckLength(deckLength);
    };

    const onStackRemove = ({ serverData, serverStack, deckLength }) => {
      setServerData(serverData);
      setCardStack(serverStack);
      setDeckLength(deckLength);
    };

    const onShuffle = ({ serverStack, deckLength }) => {
      setDeckLength(deckLength);
      setCardStack(serverStack);
    };

    const onPlayedCard = ({ serverData, serverStack }) => {
      setServerData(serverData);
      setCardStack(serverStack);
    };

    updateSocket.on("playerJoined", onPlayerJoined);
    updateSocket.on("stackRemove", onStackRemove);
    updateSocket.on("cardDrawn", onCardDrawn);
    updateSocket.on("playedCard", onPlayedCard);
    updateSocket.on("shuffle", onShuffle);

    return () => {
      updateSocket.off("playerJoined", onPlayerJoined);
      updateSocket.off("addCard", onCardDrawn);
      updateSocket.off("playedCard", onPlayedCard);
      updateSocket.off("shuffle", onShuffle);
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
              player.seat !== seat && (
                <OtherHand
                  key={player.seat}
                  cards={player.cards}
                  rotation={[0, (player.seat * (Math.PI * 2)) / maxPlayers, 0]}
                />
              )
          )}
        </Suspense>
      </Canvas>
      <StackUI cardStack={cardStack} removeCard={removeCard} />
    </div>
  );
}
