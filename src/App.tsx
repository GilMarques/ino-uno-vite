import Seats from "@/components/Seats";
import { cardProps } from "@/types/types";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import StackUI from "./components/StackUI";
import Background from "./models/Background";
import CameraController from "./models/CameraController";
import ColorChanger from "./models/ColorChanger";
import Deck from "./models/Deck";
import Hand from "./models/Hand";
import OtherHand from "./models/OtherHand";
import Particles from "./models/Particles";
import SpectateText from "./models/SpectateText";
import Stack from "./models/Stack";
import TableRotation from "./models/TableRotation";
import VictorianTable from "./models/VictorianTable";

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

  const [playing, setPlaying] = useState(false);

  const [seat, setSeat] = useState(-1);

  const [theta, setTheta] = useState(0);

  const [maxPlayers, setMaxPlayers] = useState(4);

  const [spectators, setSpectators] = useState(0);

  const [colorChangerActive, setColorChangerActive] = useState(false);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [serverData, setServerData] = useState([]);
  const [cards, setCards] = useState<cardProps[]>([]);
  const [seatsTaken, setSeatsTaken] = useState([]);

  const [cardStack, setCardStack] = useState<cardProps[]>([]);

  const [deckLength, setDeckLength] = useState<number>(60);

  const [bgColor, setBgColor] = useState<string>("white");
  const [rotationDirection, setRotationDirection] = useState<boolean>(true);

  const [particleEffectsActive, setParticleEffectsActive] = useState(false);

  const controlsRef = useRef();

  /* -------------------------------- Callbacks ------------------------------- */
  const drawCard = useCallback(() => {
    updateSocket.emit("drawCard", seat);
  }, [updateSocket]);

  const playCard = useCallback(
    (card) => {
      console.log("playCard", seat);
      updateSocket.emit("playCard", {
        seat,
        card,
      });
    },
    [updateSocket, seat]
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
    [updateSocket, seat]
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

  const takeSeat = useCallback(
    (seat) => {
      if (playing) return;
      console.log("takeSeat", seat);
      updateSocket.emit("takeSeat", seat);
    },
    [updateSocket, playing]
  );

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

    return [...prev];
  }, []);

  const handleLeave = useCallback(() => {
    console.log("leave");
    setPlaying(false);
    updateSocket.emit("leave", seat);
  }, [updateSocket, seat]);

  //logs
  /* --------------------------------- Effects -------------------------------- */

  useEffect(() => {
    setTheta((seat * (Math.PI * 2)) / maxPlayers);
  }, [seat]);

  useEffect(() => {
    // console.log("serverData", serverData);
    // console.log("cardStack", cardStack);
    // console.log("deckLength", deckLength);
    // console.log("bgColor", bgColor);
    // console.log("rotationDirection", rotationDirection);
  }, [serverData, cardStack, deckLength, bgColor, rotationDirection]);

  //update user cards
  useEffect(() => {
    if (playing) {
      setCards((prev) => handleSetCards(prev, serverData[seat]?.cards));
    }

    setSeatsTaken(
      serverData.reduce((acc, p) => {
        if (p.cards !== null) {
          return acc.concat(p.seat);
        }
        return acc;
      }, [])
    );
  }, [serverData]);

  /* ------------------------------ Socket Events ----------------------------- */
  useEffect(() => {
    updateSocket.connect();
    return () => updateSocket.disconnect();
  }, []);

  useEffect(() => {
    updateSocket.emit("join");

    function onJoined({
      serverData,
      serverStack,
      deckLength,
      serverColor,
      serverRotation,
      spectators,
    }) {
      console.log("joined");
      setMaxPlayers(serverData.length);
      setServerData(serverData);
      setCardStack(serverStack);
      setDeckLength(deckLength);
      setBgColor(serverColor);
      setRotationDirection(serverRotation);
      setSpectators(spectators);
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
      setParticleEffectsActive(true);
    }

    function onChangedColor(color) {
      setBgColor(color);
    }

    function onSeatTaken({
      seat,
      serverData,
      serverStack,
      deckLength,
      serverColor,
      serverRotation,
    }) {
      console.log(seat);

      setPlaying(true);
      setSeat(seat);
      setTheta((seat * (Math.PI * 2)) / maxPlayers);
      setServerData(serverData);
      setCardStack(serverStack);
      setBgColor(serverColor);
      setDeckLength(deckLength);
      setRotationDirection(serverRotation);
    }

    function onLeft({ serverData }) {
      setServerData(serverData);
    }

    updateSocket.on("joined", onJoined);
    updateSocket.on("seatTaken", onSeatTaken);
    updateSocket.on("removedFromStack", onRemovedFromStack);
    updateSocket.on("cardDrawn", onCardDrawn);
    updateSocket.on("playedCard", onPlayedCard);
    updateSocket.on("shuffled", onShuffled);
    updateSocket.on("changedColor", onChangedColor);
    updateSocket.on("left", onLeft);
    return () => {
      updateSocket.off("joined", onJoined);
      updateSocket.off("addCard", onCardDrawn);
      updateSocket.off("playedCard", onPlayedCard);
      updateSocket.off("shuffle", onShuffled);
      updateSocket.off("removedFromStack", onRemovedFromStack);
      updateSocket.off("seatTaken", onSeatTaken);
      updateSocket.off("left", onLeft);
    };
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
          // position: [4 * Math.sin(theta), 7, 4 * Math.cos(theta)],
        }}
      >
        {/* <MainMenu /> */}

        <Suspense fallback={<Loader />}>
          {/* <axesHelper args={[10, 10, 10]} /> */}

          <CameraController
            isDragging={isDragging}
            theta={theta}
            playing={playing}
            particleEffectsActive={particleEffectsActive}
          />

          <ambientLight intensity={1} color={"white"} />
          {!playing && <SpectateText />}

          <VictorianTable position={[0, -3.6, 0]} />
          <Stack cardStack={cardStack} position={[0, -0.0, 0]} />

          {particleEffectsActive && (
            <Particles color={bgColor} setActive={setParticleEffectsActive} />
          )}

          <Deck
            deckLength={deckLength}
            shuffleDeck={shuffleDeck}
            position={[1, 0, 1]}
            drawCard={drawCard}
          />
          {playing && (
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
          )}
          <Background bgColor={bgColor} />
          <TableRotation rotationDirection={rotationDirection} />
          {/* <Stool position={[0, 0, -1]} scale={5} /> */}

          {serverData.map(
            (player) =>
              player.seat !== seat &&
              player.cards && (
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
      <Seats
        sides={maxPlayers}
        takenSeats={seatsTaken}
        spectators={spectators}
        takeSeat={takeSeat}
        handleLeave={handleLeave}
      />
      <StackUI cardStack={cardStack} removeCard={removeCard} />
    </div>
  );
}
