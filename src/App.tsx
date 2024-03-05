"use client";

import Seats from "@/components/Seats";
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
  console.log("findUniqueElements", array1, array2);

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

  const [sortingActive, setSortingActive] = useState(false);

  const [cardStack, setCardStack] = useState<cardProps[]>([]);

  const [deckLength, setDeckLength] = useState<number>(60);

  const [bgColor, setBgColor] = useState<string>("white");
  const [rotationDirection, setRotationDirection] = useState<boolean>(true);

  //logs
  useEffect(() => {
    console.log("serverData", serverData);
    console.log("cardStack", cardStack);
    console.log("deckLength", deckLength);
    console.log("bgColor", bgColor);
    console.log("rotationDirection", rotationDirection);
  }, [serverData, cardStack, deckLength, bgColor, rotationDirection]);

  const sortCards = useCallback(() => {
    setCards((prevData) => {
      return [...prevData].sort((a, b) => {
        // Extract color and value from the strings
        const colorA = a.name?.split("/")[0];
        const colorB = b.name?.split("/")[0];
        let valueA = parseInt(a.name?.split("/")[1]);
        let valueB = parseInt(b.name?.split("/")[1]);

        // Handling special cards
        if (isNaN(valueA)) {
          if (a.name.includes("reverse")) valueA = 11;
          else if (a.name.includes("block")) valueA = 12;
          else if (a.name.includes("+2")) valueA = 10;
        }

        if (isNaN(valueB)) {
          if (b.name.includes("reverse")) valueB = 11;
          else if (b.name.includes("block")) valueB = 12;
          else if (b.name.includes("+2")) valueB = 10;
        }

        // First, compare the colors alphabetically
        if (colorA < colorB) return -1;
        if (colorA > colorB) return 1;

        // If colors are the same, compare values numerically
        return valueA - valueB;
      });
    });
  }, []);

  const handleShift = useCallback((x) => {
    setCards((prev) => createShiftedArray(prev, x));
  }, []);

  const handleSetCards = useCallback((prev, serverCards) => {
    const uniqueElements = findUniqueElements(prev, serverCards);
    console.log("unique", uniqueElements);
    console.log("before", prev);

    let newCards = [];
    //from array1 remove
    //from array2 add
    uniqueElements.forEach((element) => {
      if (element.fromArray === 1) {
        prev = prev.filter((card) => card.id !== element.id);
      }

      if (element.fromArray === 2) {
        prev.push(element);
      }
    });
    console.log("after", prev);

    return [...prev];
  }, []);

  //update user cards
  useEffect(() => {
    if (serverData[seat]?.cards.length > 0) {
      setCards((prev) => handleSetCards(prev, serverData[seat]?.cards));
    }
  }, [serverData]);

  //SOCKET IO EVENTS
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
            handleShift={handleShift}
            setCards={setCards}
            hoverCard={hoverCard}
            setIsDragging={setIsDragging}
            isDragging={isDragging}
            playCard={playCard}
            bgColor={bgColor}
            sortCards={sortCards}
            setColorChangerActive={setColorChangerActive}
          />

          <Background bgColor={bgColor} />
          <TableRotation rotationDirection={rotationDirection} />
          {/* <Stool position={[0, 0, -1]} scale={5} /> */}
          {/* {spectating && <OrbitControls/>} */}
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
      <Seats sides={maxPlayers} takenSeats={[0, 2]} spectators={3} />
      <StackUI cardStack={cardStack} removeCard={removeCard} />
    </div>
  );
}
