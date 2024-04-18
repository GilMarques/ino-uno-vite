import Background from "@/models/Background";
import CameraController from "@/models/CameraController";
import ColorChanger from "@/models/ColorChanger";
import Deck from "@/models/Deck";
import Hand from "@/models/Hand";
import HudElements from "@/models/HudElements";
import OtherHand from "@/models/OtherHand";
import Particles from "@/models/Particles";
import PlayedCard from "@/models/PlayedCard";
import SpectateText from "@/models/SpectateText";
import Stack from "@/models/Stack";
import TableRotation from "@/models/TableRotation";
import VictorianTable from "@/models/VictorianTable";
import { ServerDataProps, cardProps } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
function createShiftedArray(arr: cardProps[], shift: number) {
  const length = arr.length;
  if (length === 0) {
    return arr.slice(); // Return a shallow copy of the original array
  }

  // Normalize shift value to be within the range of the array length
  shift %= length;

  const shiftedIndices = arr.map((_, index: number) => {
    let newIndex = index + shift;
    if (newIndex < 0) {
      newIndex += length; // Wrap around for negative indices
    } else if (newIndex >= length) {
      newIndex -= length; // Wrap around for indices beyond array length
    }
    return newIndex;
  });

  return shiftedIndices.map((index: number) => arr[index]);
}

function findUniqueElements(array1: cardProps[], array2: cardProps[]) {
  const uniqueElements: { id: string; name: string; fromArray: number }[] = [];

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
const Game = ({ updateSocket }) => {
  const [playing, setPlaying] = useState<boolean>(false);

  const [seat, setSeat] = useState<number>(-1);

  const [theta, setTheta] = useState<number>(0);

  const [maxPlayers, setMaxPlayers] = useState<number>(4);

  const [spectators, setSpectators] = useState<number>(0);

  const [colorChangerActive, setColorChangerActive] = useState<boolean>(false);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [serverData, setServerData] = useState<ServerDataProps[]>([]);
  const [cards, setCards] = useState<cardProps[]>([]);
  const [seatsTaken, setSeatsTaken] = useState<number[]>([]);

  const [cardStack, setCardStack] = useState<cardProps[]>([]);

  const [deckLength, setDeckLength] = useState<number>(60);

  const [bgColor, setBgColor] = useState<string>("white");
  const [rotationDirection, setRotationDirection] = useState<boolean>(true);

  const [particleEffectsActive, setParticleEffectsActive] =
    useState<boolean>(false);

  const [playedCards, setPlayedCards] = useState<
    { id: string; rotation: number }[]
  >([]);

  /* -------------------------------- Callbacks ------------------------------- */
  const drawCard = useCallback(() => {
    updateSocket.emit("drawCard");
  }, [updateSocket]);

  const playCard = useCallback(
    (card: cardProps) => {
      updateSocket.emit("playCard", {
        card,
      });
    },
    [updateSocket]
  );

  const removeCard = useCallback(
    (card: cardProps) => {
      updateSocket.emit("stackRemove", {
        card,
      });
    },
    [updateSocket]
  );

  const changeBgColor = useCallback(
    (color: string) => {
      setColorChangerActive(false);
      updateSocket.emit("changeColor", color);
    },
    [updateSocket]
  );

  const takeSeat = useCallback(
    (seat: number) => {
      if (playing) return;

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

  const handleShift = useCallback((x: number) => {
    setCards((prev) => createShiftedArray(prev, x));
  }, []);

  const handleSetCards = useCallback(
    (prev: cardProps[], serverCards: cardProps[]) => {
      const uniqueElements = findUniqueElements(prev, serverCards);

      //from array1 remove
      //from array2 add
      uniqueElements.forEach(
        (element: { id: string; fromArray: number; name: string }) => {
          if (element.fromArray === 1) {
            prev = prev.filter((card) => card.id !== element.id);
          }

          if (element.fromArray === 2) {
            prev.push(element);
          }
        }
      );

      return [...prev];
    },
    []
  );

  const handleLeave = useCallback(() => {
    updateSocket.emit("leaveSeat");
  }, [updateSocket]);

  const removePlayed = useCallback(
    (id: string) => {
      setPlayedCards((prev) =>
        prev.filter((card: { id: string; rotation: number }) => card.id !== id)
      );
    },
    [setPlayedCards]
  );

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    console.log("played cards", playedCards);
  }, [playedCards]);

  useEffect(() => {
    if (seat !== -1) {
      setTheta((seat * (Math.PI * 2)) / maxPlayers);
    }
  }, [seat, maxPlayers]);

  //update user cards
  useEffect(() => {
    if (playing) {
      setCards((prev) =>
        handleSetCards(prev, serverData[seat].cards as cardProps[])
      );
    }

    setSeatsTaken(
      serverData.filter((p) => p.cardsLength !== 0).map((p) => p.seat)
    );
  }, [serverData, handleSetCards, playing, seat]);

  useEffect(() => {
    updateSocket.emit("join");

    function onJoined({
      numberofPlayers,
      serverData,
      serverStack,
      deckLength,
      serverColor,
      serverRotation,
      spectators,
    }) {
      setMaxPlayers(numberofPlayers);
      setServerData(serverData);
      setCardStack(serverStack);
      setDeckLength(deckLength);
      setBgColor(serverColor);
      setRotationDirection(serverRotation);
      setSpectators(spectators);
    }

    function onChangedColor(color) {
      setBgColor(color);
    }

    function onSpectators({ spectators }) {
      setSpectators(spectators);
    }

    function onSeatTaken({
      seat,
      serverData,
      serverStack,
      deckLength,
      spectators,
    }) {
      setPlaying(true);
      setSeat(seat);
      setServerData(serverData);
      setCardStack(serverStack);
      setDeckLength(deckLength);
      setSpectators(spectators);
    }

    function onSeatLeave({ serverData, spectators, deckLength }) {
      setPlaying(false);
      setSeat(-1);
      setServerData(serverData);
      setSpectators(spectators);
      setDeckLength(deckLength);
    }

    function onUpdate({
      action,
      serverData,
      serverStack,
      deckLength,
      serverColor,
      serverRotation,
      spectators,
    }) {
      setServerData(serverData);
      setCardStack(serverStack);
      setDeckLength(deckLength);
      setBgColor(serverColor);
      setRotationDirection(serverRotation);
      setRotationDirection(serverRotation);
      setSpectators(spectators);

      if (action.type == "playCard") {
        if (action.seat != seat) {
          setPlayedCards((prev) => [
            ...prev,
            {
              id: uuidv4(),
              rotation: action.from,
            },
          ]);
        }
      }
    }

    updateSocket.on("joined", onJoined);
    updateSocket.on("seatTaken", onSeatTaken);
    updateSocket.on("seatLeave", onSeatLeave);
    updateSocket.on("changedColor", onChangedColor);
    updateSocket.on("spectators", onSpectators);
    updateSocket.on("update", onUpdate);
    return () => {
      updateSocket.off("joined", onJoined);
      updateSocket.off("seatTaken", onSeatTaken);
      updateSocket.off("seatLeave", onSeatLeave);
      updateSocket.off("changedColor", onChangedColor);
      updateSocket.off("spectators", onSpectators);
      updateSocket.off("update", onUpdate);
    };
  }, []);

  return (
    <>
      {/* <axesHelper args={[10, 10, 10]} /> */}

      <CameraController
        isDragging={isDragging}
        theta={theta}
        playing={playing}
        particleEffectsActive={particleEffectsActive}
      />

      <ambientLight intensity={1} color={"white"} />
      {seat === -1 && <SpectateText />}

      <VictorianTable position={[0, -3.6, 0]} />
      <Stack cardStack={cardStack} position={[0, -0.0, 0]} />

      {particleEffectsActive && (
        <Particles color={bgColor} setActive={setParticleEffectsActive} />
      )}

      <Deck deckLength={deckLength} position={[1, 0, 1]} drawCard={drawCard} />
      {playing && (
        <Hand
          rotation={[0, theta, 0]}
          cards={cards}
          handleShift={handleShift}
          setIsDragging={setIsDragging}
          playCard={playCard}
          bgColor={bgColor}
          sortCards={sortCards}
          setColorChangerActive={setColorChangerActive}
        />
      )}
      <Background bgColor={bgColor} />
      <TableRotation rotationDirection={rotationDirection} />

      {serverData.map(
        (player) =>
          player.seat !== seat &&
          player.cardsLength > 0 && (
            <OtherHand
              key={player.seat}
              cardsLength={player.cardsLength}
              rotation={[0, (player.seat * (Math.PI * 2)) / maxPlayers, 0]}
            />
          )
      )}
      {playedCards.map(({ id, rotation }) => {
        return (
          <PlayedCard
            key={id}
            id={id}
            rotation={rotation}
            removePlayed={removePlayed}
          />
        );
      })}
      <ColorChanger
        colorChangerActive={colorChangerActive}
        changeBgColor={changeBgColor}
        theta={theta}
      />

      <HudElements
        maxPlayers={maxPlayers}
        seatsTaken={seatsTaken}
        takeSeat={takeSeat}
        handleLeave={handleLeave}
        cardStack={cardStack}
        removeCard={removeCard}
        spectators={spectators}
      />
    </>
  );
};

export default Game;
