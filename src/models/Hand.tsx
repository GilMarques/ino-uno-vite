import newCardCoords from "@/lib/coordsCache";

import { useEffect, useRef, useState } from "react";
import RotateButton from "./RotateButton";

import { handProps } from "@/types/types";
import { Group } from "three";
import Card from "./Card";
import SortButton from "./SortButton";

const Hand = ({
  cards,
  rotation,
  playCard,
  bgColor,
  setIsDragging,
  setColorChangerActive,
  sortCards,
  handleShift,
}) => {
  const [hand, setHand] = useState<handProps[]>([]);
  const ref = useRef<Group>(null);

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
      <SortButton position={[0, 3.5, 4.5]} sortCards={sortCards} />
      <RotateButton position={[-0.2, 3.5, 4.5]} flip={-1} shift={handleShift} />
      <RotateButton position={[0.2, 3.5, 4.5]} flip={1} shift={handleShift} />
      <group ref={ref}>
        {hand.map((card) => {
          // console.log(card);
          return (
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              position={{ x: card.x, y: card.y }}
              rotZ0={card.rotation}
              setIsDragging={setIsDragging}
              playCard={playCard}
              bgColor={bgColor}
              setColorChangerActive={setColorChangerActive}
            />
          );
        })}
      </group>
    </group>
  );
};

export default Hand;
