"use client";

import { cardProps } from "@/types/types";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import StackUI from "./components/StackUI";
import Background from "./models/Background";
import ColorChanger from "./models/ColorChanger";
import Deck from "./models/Deck";
import Hand from "./models/Hand";
import OtherHand from "./models/OtherHand";
import Stack from "./models/Stack";
import TableRotation from "./models/TableRotation";
import VictorianTable from "./models/VictorianTable";
const maxPlayers = 4;

//Player Settings
// const seat = Math.floor(Math.random() * maxPlayers);
const seat = 0;
const theta = (seat * (Math.PI * 2)) / maxPlayers;

export default function App({ updateSocket }) {
  const drawCard = useCallback(() => {
    updateSocket.emit("drawCard", seat);
  }, [updateSocket]);

  const playCard = useCallback(
    (card) => {
      console.log("playCard");
      updateSocket.emit("playCard", {
        seat,
        card,
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

  const changeBgColor = useCallback(
    (color) => {
      console.log(color);
      setColorChangerActive(false);
      updateSocket.emit("changeColor", color);
    },
    [updateSocket]
  );

  const shuffleDeck = useCallback(() => {
    console.log("shuffle");
    updateSocket.emit("shuffle");
  }, [updateSocket]);
  const orbitRef = useRef();

  //Frontend
  const [colorChangerActive, setColorChangerActive] = useState(false);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [serverData, setServerData] = useState([]);
  const [cards, setCards] = useState<cardProps[]>([]);

  const [cardStack, setCardStack] = useState<cardProps[]>([]);

  const [deckLength, setDeckLength] = useState<number>(60);

  const [bgColor, setBgColor] = useState<string>("white");
  const [rotationDirection, setRotationDirection] = useState<boolean>(true);

  useEffect(() => {
    console.log("serverData", serverData);
    console.log("cardStack", cardStack);
    console.log("deckLength", deckLength);
    console.log("bgColor", bgColor);
    console.log("rotationDirection", rotationDirection);
  }, [serverData, cardStack, deckLength, bgColor, rotationDirection]);

  useEffect(() => {
    if (serverData[seat]?.cards.length > 0) {
      setCards(serverData[seat].cards);
    }
  }, [serverData]);

  useEffect(() => {
    updateSocket.connect();
    return () => updateSocket.disconnect();
  }, []);

  useEffect(() => {
    console.log("seat", seat);
    updateSocket.emit("join", seat);

    function onPlayerJoined({
      serverData,
      serverStack,
      deckLength,
      serverColor,
      serverRotation,
    }) {
      console.log("playerJoined");

      setServerData(serverData);
      setCardStack(serverStack);
      setDeckLength(deckLength);
      setBgColor(serverColor);
      setRotationDirection(serverRotation);
    }

    function onCardDrawn({ serverData, serverStack, deckLength }) {
      console.log("cardDrawn");
      setServerData(serverData);
      setCardStack(serverStack);
      setDeckLength(deckLength);
    }

    function onRemovedFromStack({
      serverData,
      serverStack,
      serverRotation,
      serverColor,
    }) {
      console.log("stackRemove");
      setServerData(serverData);
      setCardStack(serverStack);
      setRotationDirection(serverRotation);
      setBgColor(serverColor);
    }

    function onShuffled({ serverStack, deckLength }) {
      setCardStack(serverStack);
      setDeckLength(deckLength);
    }

    function onPlayedCard({
      serverData,
      serverStack,
      serverRotation,
      serverColor,
    }) {
      console.log("playedCard");

      setServerData(serverData);
      setCardStack(serverStack);
      setRotationDirection(serverRotation);
      setBgColor(serverColor);
    }

    function onChangedColor(color) {
      setBgColor(color);
    }

    updateSocket.on("playerJoined", onPlayerJoined);
    updateSocket.on("removedFromStack", onRemovedFromStack);
    updateSocket.on("cardDrawn", onCardDrawn);
    updateSocket.on("playedCard", onPlayedCard);
    updateSocket.on("shuffled", onShuffled);
    updateSocket.on("changedColor", onChangedColor);
    return () => {
      updateSocket.off("playerJoined", onPlayerJoined);
      updateSocket.off("addCard", onCardDrawn);
      updateSocket.off("playedCard", onPlayedCard);
      updateSocket.off("shuffle", onShuffled);
    };
  }, []);

  return (
    <div className="relative h-screen w-full">
      <Canvas
        className="h-screen w-full bg-transparent"
        camera={{
          fov: 60,
          near: 0.1,
          far: 1000,
          position: [4 * Math.sin(theta), 7, 4 * Math.cos(theta)],
        }}
      >
        {/* <MainMenu /> */}
        <Suspense fallback={<Loader />}>
          <axesHelper args={[10, 10, 10]} />
          <ambientLight intensity={1} color={"white"} />
          <VictorianTable position={[0, -3.6, 0]} />

          <Stack cardStack={cardStack} position={[0, -0.0, 0]} />
          <Deck
            deckLength={deckLength}
            shuffleDeck={shuffleDeck}
            position={[1, 0, 1]}
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
            bgColor={bgColor}
            setColorChangerActive={setColorChangerActive}
          />

          <Background bgColor={bgColor} />
          <TableRotation rotationDirection={rotationDirection} />
          {/* <Stool position={[0, 0, -1]} scale={5} /> */}
          <OrbitControls
            ref={orbitRef}
            enabled={!isDragging}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.1}
            dampingFactor={0.03}
            minAzimuthAngle={theta - Math.PI / 6}
            maxAzimuthAngle={theta + Math.PI / 6}
            maxPolarAngle={Math.PI / 3}
            minPolarAngle={Math.PI / 6}
          />
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

          <ColorChanger
            colorChangerActive={colorChangerActive}
            changeBgColor={changeBgColor}
            theta={theta}
          />
        </Suspense>
      </Canvas>
      <StackUI cardStack={cardStack} removeCard={removeCard} />
    </div>
  );
}
