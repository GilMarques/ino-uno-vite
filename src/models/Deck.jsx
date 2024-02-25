import textureMap from "@/lib/texture";
import * as THREE from "three";

import RoundedBoxFlat from "@/lib/roundedboxflat";

import { animated, useSpring } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";

var CARD_WIDTH = 0.4;
var CARD_HEIGHT = 0.6;
var CARD_DEPTH = 0.01;
var CARD_RADIUS = 0.07;
var CARD_SMOOTHNESS = 10;

const cardTextures = textureMap;

const Deck = ({ deck, setDeck, position, setCards, setCardStack }) => {
  const [spring, set] = useSpring(() => ({ scale: [1, 1, 1] }));
  const bind = useGesture({
    onHover: ({ hovering }) =>
      set({
        scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1],
      }),
  });

  const handleClick = () => {
    const newCard = deck.pop();
    console.log("newCard", newCard);
    setDeck(deck);
    setCards((prev) => [...prev, newCard]);
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
          CARD_DEPTH * 30,
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
          map={cardTextures["back"]}
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
