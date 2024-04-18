import newCardCoords from "@/lib/coordsCache";

import OtherCard from "@/models/OtherCard";
import { handProps } from "@/types/types";
import { useEffect, useState } from "react";

type OtherHandProps = {
  cardsLength: number;

  rotation: [number, number, number];
};

const OtherHand = ({ cardsLength, rotation }: OtherHandProps) => {
  const [hand, setHand] = useState<handProps[]>([]);

  useEffect(() => {
    const newHand: handProps[] = [];
    const newCoords = newCardCoords(cardsLength);

    for (let i = 0; i < cardsLength; i++) {
      newHand.push({
        id: "",
        name: "",
        x: newCoords[i].x,
        y: newCoords[i].y,
        rotation: 2 * Math.PI - newCoords[i].angle,
      });
    }
    setHand(newHand);
  }, [cardsLength]);

  return (
    <group rotation={rotation}>
      {hand.map((card, index) => (
        <OtherCard
          key={index}
          name={card.name}
          position={{ x: card.x, y: card.y }}
          rotZ0={card.rotation}
        />
      ))}
    </group>
  );
};

export default OtherHand;
