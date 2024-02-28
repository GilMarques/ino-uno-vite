import textureMap from "@/lib/texture";
import * as THREE from "three";

import RoundedBoxFlat from "@/lib/roundedboxflat";

import { animated, useSpring } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";

const CARD_WIDTH = 0.4;
const CARD_HEIGHT = 0.6;
const CARD_DEPTH = 0.01;
const CARD_RADIUS = 0.07;
const CARD_SMOOTHNESS = 10;

type DeckProps = {
  deckLength: number;
  position: [number, number, number];
  drawCard: () => void;
};

const Deck = ({ deckLength, drawCard, position }: DeckProps) => {
  const [spring, set] = useSpring(() => ({ scale: [1, 1, 1] }));
  const bind = useGesture({
    onHover: ({ hovering }) =>
      set.start({
        scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1],
      }),
  });

  return (
    <group name={"deck"} rotation={[Math.PI / 2, 0, 0]} position={position}>
      <animated.mesh
        visible={deckLength > 0}
        onClick={drawCard}
        {...spring}
        {...bind()}
        castShadow
        receiveShadow
        geometry={RoundedBoxFlat(
          CARD_WIDTH,
          CARD_HEIGHT,
          CARD_DEPTH * deckLength,
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
