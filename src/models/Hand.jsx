import calculateCoords from "@/lib/card_fanning";
import { useEffect, useState } from "react";
import Card from "./Card";

const coordsCache = {
  0: [],
};

const newCardCoords = (n) => {
  if (coordsCache[n]) return coordsCache[n];
  const coords = calculateCoords(n, 800, 200, 300, "N", 0.4);
  let m = Math.floor(n / 2);
  console.log("m:", m, "n:", n);
  let centerx;
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
  console.log("coordsCache", coordsCache);
  return coords;
};

const Hand = ({
  cards,
  setCards,
  position,
  isDragging,
  setIsDragging,
  setCardStack,
}) => {
  const [hand, setHand] = useState([]);

  const removeCard = (id) =>
    setCards((prev) => prev.filter((card) => card.id !== id));

  useEffect(() => {
    const newHand = [];
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
    <group rotation={[0, Math.PI / 4, 0]}>
      {hand.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          x0={card.x}
          y0={card.y}
          rotX0={-Math.PI / 4}
          rotZ0={card.rotation}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          setCardStack={setCardStack}
          remove={removeCard}
        />
      ))}
    </group>
  );
};

export default Hand;
