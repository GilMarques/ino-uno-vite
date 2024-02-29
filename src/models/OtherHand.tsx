import newCardCoords from "@/lib/coordsCache";
import { handProps } from "@/types/Hand";
import { cardProps } from "@/types/types";
import { useEffect, useState } from "react";
import OtherCard from "./OtherCard";

type OtherHandProps = {
  cards: cardProps[];

  rotation: [number, number, number];
};

const OtherHand = ({ cards, setCards, rotation }: OtherHandProps) => {
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
        <OtherCard
          key={card.id}
          id={card.id}
          name={card.name}
          position={{ x: card.x, y: card.y }}
          rotZ0={card.rotation}
        />
      ))}
    </group>
  );
};

export default OtherHand;
