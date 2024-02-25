import calculateCoords from "@/lib/card_fanning";
import { coordProps, handProps } from "@/types/Hand";
import { useEffect, useState } from "react";
import { cardProps } from "../types/Card";
import Card from "./Card";

type coordsCacheProps = {
  [key: number]: coordProps[];
};

const coordsCache: coordsCacheProps = {
  0: [],
};

const newCardCoords = (n: number) => {
  if (coordsCache[n]) return coordsCache[n];
  const coords = calculateCoords(n, 1500, 200, 400, "N", 0.4);
  const m = Math.floor(n / 2);
  let centerx: number;
  if (n % 2 == 0) {
    centerx = (coords[m - 1].x + coords[m].x) / 2;
    for (let i = 0; i < n; i++) {
      coords[i].x = coords[i].x - centerx;
    }
  } else {
    centerx = coords[m].x;
    for (let i = 0; i < n; i++) {
      coords[i].x = coords[i].x - centerx;
    }
  }
  coordsCache[n] = coords;

  return coords;
};

type HandProps = {
  cards: cardProps[];
  setCards: React.Dispatch<React.SetStateAction<cardProps[]>>;
  // rotation: [number, number, number];
  isDragging: boolean;
  setIsHovering: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setCardStack: React.Dispatch<React.SetStateAction<cardProps[]>>;
};

const Hand = ({
  cards,
  setCards,
  // position,
  isDragging,
  setIsDragging,
  setCardStack,
}: HandProps) => {
  const [hand, setHand] = useState<handProps[]>([]);

  const removeCard = (id: string) =>
    setCards((prev) => prev.filter((card: cardProps) => card.id !== id));

  useEffect(() => {
    const newHand: handProps[] = [];
    const newCoords = newCardCoords(cards.length);

    for (let i = 0; i < cards.length; i++) {
      newHand.push({
        id: cards[i].id,
        name: cards[i].name,
        x: newCoords[i].x,
        y: newCoords[i].y,
        rotation: 2 * Math.PI - newCoords[i].angle,
      });
    }
    console.log("newHand:", newHand);
    setHand(newHand);
  }, [cards]);

  return (
    <group rotation={[0, 0, 0]}>
      {hand.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          x0={card.x}
          y0={card.y}
          rotZ0={card.rotation}
          setIsDragging={setIsDragging}
          setCardStack={setCardStack}
          remove={removeCard}
        />
      ))}
    </group>
  );
};

export default Hand;
