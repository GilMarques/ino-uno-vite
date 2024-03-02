import newCardCoords from "@/lib/coordsCache";
import { handProps } from "@/types/Hand";
import { cardProps } from "@/types/types";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SRGBColorSpace } from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Card from "./Card";
type HandProps = {
  playerID: number;
  cards: cardProps[];
  setCards: React.Dispatch<React.SetStateAction<cardProps[]>>;
  rotation: [number, number, number];
  isDragging: boolean;
  hoverCard: (id: string) => void;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  playCard: (id: string, name: string) => void;
  setColorChangerActive;
};
const texture = new TextureLoader().load(`src/assets/arrow.png`);
texture.colorSpace = SRGBColorSpace;

const RotateButton = ({ position, flip, shift }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const scaleMod = useRef(1);

  const handleClick = () => {
    scaleMod.current = 2.5;
    shift(flip);
  };

  useFrame((state, delta) => {
    if (scaleMod.current > 1) {
      scaleMod.current -= 0.3;
    }
    if (ref.current) {
      easing.damp3(
        ref.current.scale,
        hovered
          ? [
              flip * 1.5 * scaleMod.current,
              1.5 * scaleMod.current,
              1.5 * scaleMod.current,
            ]
          : [
              flip * scaleMod.current,
              1 * scaleMod.current,
              1 * scaleMod.current,
            ],
        0.1,
        delta
      );
    }
  });
  return (
    <group
      onPointerDown={(event) => {
        event.stopPropagation();
        handleClick();
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
    >
      <mesh ref={ref} position={position} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.1]} />

        <meshBasicMaterial
          attach={"material-1"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-3"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-4"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-5"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-0"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-2"}
          map={texture}
          // transparent={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const Hand = ({
  cards,
  setCards,
  rotation,
  hoverCard,
  playCard,
  bgColor,
  setIsDragging,

  setColorChangerActive,
}: HandProps) => {
  const removeFromHand = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const [hand, setHand] = useState<handProps[]>([]);
  const ref = useRef();
  const [shift, setShift] = useState(0);

  const handleShift = (shiftValue) => {
    const newArray = [...cards]; // Copy the array
    const length = newArray.length;
    if (length === 0) return; // No need to shift for an empty array

    const normalizedShift = shiftValue % length; // Normalize shift value

    if (normalizedShift !== 0) {
      let shiftedArray;
      if (normalizedShift > 0) {
        shiftedArray = [
          ...newArray.slice(length - normalizedShift),
          ...newArray.slice(0, length - normalizedShift),
        ];
      } else {
        shiftedArray = [
          ...newArray.slice(-normalizedShift),
          ...newArray.slice(0, -normalizedShift),
        ];
      }
      console.log(shiftedArray);

      setCards(shiftedArray); // Update the state with the shifted array
    }
  };

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
      <RotateButton position={[-0.2, 3.5, 4.5]} flip={-1} shift={handleShift} />
      <RotateButton position={[0.2, 3.5, 4.5]} flip={1} shift={handleShift} />
      <group ref={ref}>
        {hand.map((card) => {
          // console.log(card);
          return (
            <Card
              key={card.id}
              hoverCard={hoverCard}
              id={card.id}
              name={card.name}
              position={{ x: card.x, y: card.y }}
              rotZ0={card.rotation}
              setIsDragging={setIsDragging}
              playCard={playCard}
              removeFromHand={removeFromHand}
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
