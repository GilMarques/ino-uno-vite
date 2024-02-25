"use client";

import deck from "@/lib/startingDeck";
import Background from "@/models/Background";
import Deck from "@/models/Deck";
import Hand from "@/models/Hand";
import Stack from "@/models/Stack";
import TableRotation from "@/models/TableRotation";
import VictorianTable from "@/models/VictorianTable";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Loader from "./components/Loader";

// import io from 'socket.io-client'
// let socket;

const startingCards = [];
for (let i = 0; i < 7; i++) {
  startingCards.push({
    id: deck[i].id,
    name: deck[i].name,
  });
}
const startingDeck = deck;

export default function App() {
  // const [deck, setDeck] = useState(deck);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cards, setCards] = useState(startingCards);
  const [cardStack, setCardStack] = useState([]);
  const [deck, setDeck] = useState(startingDeck);

  const [bgColor, setBgColor] = useState("blue");
  const [rotationDirection, setRotationDirection] = useState(true);

  const shuffleDeck = (d) => {
    // Fisher-Yates shuffle
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j], d[i]];
    }
    setDeck(deck);
  };

  useEffect(() => {
    if (cardStack.length > 0) {
      let [color, value] = cardStack[cardStack.length - 1].name.split("/");
      setBgColor(color);
      if (value === "reverse") {
        setRotationDirection((prev) => !prev);
      }
    } else {
      setBgColor("white");
      setRotationDirection(true);
    }
  }, [cardStack]);

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

          <VictorianTable position={[0, -3.7, 0]} />
          <Stack cardStack={cardStack} position={[0, 1.8, 0]} />
          <Deck
            deck={deck}
            setDeck={setDeck}
            position={[1, 0, 0]}
            setCards={setCards}
            setCardStack={setCardStack}
          />

          <Hand
            cards={cards}
            setCards={setCards}
            setIsHovering={setIsHovering}
            setIsDragging={setIsDragging}
            isDragging={isDragging}
            setCardStack={setCardStack}
          />
          <Background bgColor={bgColor} />
          <TableRotation rotationDirection={rotationDirection} />
          {/* <CardExplosion /> */}
          <OrbitControls enableZoom={true} enabled={!isDragging} />
          {/* <OrbitControls enableZoom={false} enablePan={false} enabled={!isDragging} maxAzimuthAngle minAzimuthAngle minPolarAngle maxPolarAngle /> */}
        </Suspense>
      </Canvas>
      {/* <StackUI cardStack={cardStack} setCardStack={setCardStack} /> */}
    </div>
  );
}
