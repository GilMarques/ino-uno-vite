import calculateCoords from "@/lib/card_fanning";
import { coordProps, handProps } from "@/types/Hand";
import { cardProps } from "@/types/types";
import { useEffect, useState } from "react";

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
  playerID: number;
  cards: cardProps[];
  setCards: React.Dispatch<React.SetStateAction<cardProps[]>>;
  rotation: [number, number, number];
  isDragging: boolean;
  hoverCard: (id: string) => void;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  playCard: (id: string, name: string) => void;
};

const Hand = ({
  cards,
  setCards,
  rotation,
  hoverCard,
  playCard,

  setIsDragging,
}: HandProps) => {
  const removeFromHand = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const [hand, setHand] = useState<handProps[]>([]);

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
    setHand(newHand);
  }, [cards]);

  return (
    <group rotation={rotation}>
      {hand.map((card) => (
        <Card
          hoverCard={hoverCard}
          key={card.id}
          id={card.id}
          name={card.name}
          position={{ x: card.x, y: card.y }}
          rotZ0={card.rotation}
          setIsDragging={setIsDragging}
          playCard={playCard}
          removeFromHand={removeFromHand}
        />
      ))}
    </group>
  );
};

export default Hand;
