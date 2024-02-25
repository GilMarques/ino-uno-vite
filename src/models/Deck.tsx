import textureMap from "@/lib/texture";
import * as THREE from "three";

import RoundedBoxFlat from "@/lib/roundedboxflat";

import { cardProps } from "@/types/Card";
import { animated, useSpring } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";

const CARD_WIDTH = 0.4;
const CARD_HEIGHT = 0.6;
const CARD_DEPTH = 0.01;
const CARD_RADIUS = 0.07;
const CARD_SMOOTHNESS = 10;

type DeckProps = {
  deck: cardProps[];
  setDeck: React.Dispatch<React.SetStateAction<cardProps[]>>;
  position: [number, number, number];
  setCards: React.Dispatch<React.SetStateAction<cardProps[]>>;
  setCardStack: React.Dispatch<React.SetStateAction<cardProps[]>>;
};

const Deck = ({
  deck,
  setDeck,
  position,
  setCards,
  setCardStack,
}: DeckProps) => {
  const [spring, set] = useSpring(() => ({ scale: [1, 1, 1] }));
  const bind = useGesture({
    onHover: ({ hovering }) =>
      set.start({
        scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1],
      }),
  });

  const handleClick = () => {
    if (deck.length === 0) {
      return;
    }
    const newCard = deck.pop();
    setDeck(deck);
    setCards((prev) => [...prev, newCard!]);
  };

  return (
    <group name={"deck"} rotation={[Math.PI / 2, 0, 0]} position={position}>
      <animated.mesh
        onClick={handleClick}
        {...spring}
        {...bind()}
        castShadow
        receiveShadow
        geometry={RoundedBoxFlat(
          CARD_WIDTH,
          CARD_HEIGHT,
          CARD_DEPTH * deck.length,
          CARD_RADIUS,
          CARD_SMOOTHNESS
        )}
      >
        <meshStandardMaterial
          attach="material-0"
          color={"white"}
          side={THREE.DoubleSide}
        />
        <meshPhongMaterial
          attach="material-1"
          map={textureMap["back"]}
          side={THREE.DoubleSide}
        />
        <meshPhongMaterial
          attach="material-2"
          color={"white"}
          side={THREE.DoubleSide}
        />
      </animated.mesh>
    </group>
  );
};

export default Deck;
