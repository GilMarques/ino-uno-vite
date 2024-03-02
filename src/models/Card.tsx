// boxGeometry for different card faces
"use client";
import textureMap from "@/lib/texture";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import RoundedBoxFlat from "@/lib/roundedboxflat";
import { cardProps } from "@/types/types";
import { animated, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";

//https://docs.pmnd.rs/react-three-fiber/api/events

const CARD_WIDTH = 0.4;
const CARD_HEIGHT = 0.6;
const CARD_DEPTH = 0.001;
const CARD_RADIUS = 0.07;
const CARD_SMOOTHNESS = 10;

type CardProps = {
  id: string;
  name: string;
  position: { x: number; y: number };
  rotZ0: number;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  hoverCard: (id: string) => void;
  playCard: (card: cardProps) => void;
  removeFromHand: (id: string) => void;
};

const emissiveIntensity = {
  red: 1,
  blue: 2.5,
  green: 2,
  yellow: 0.2,
  black: 1,
};

const Card = ({
  position,
  id,
  name,
  playCard,
  removeFromHand,
  rotZ0,
  hoverCard,
  setIsDragging,
  bgColor,
  setColorChangerActive,
}: CardProps) => {
  const color = name.split("/")[0];
  const ref = useRef<THREE.Group>();
  const ref2 = useRef<THREE.Group>();
  const scaling = 200;
  const z = 0.01;
  const [cardPos, setCardPos] = useState(position);

  const [onTable, setOnTable] = useState(false);

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [position.x / scaling, -position.y / scaling, z],
    rotation: [0, 0, rotZ0],
    config: { friction: 15 },
  }));

  const [spring2, set2] = useSpring(() => ({
    position: [0, 4, 4],
    rotation: [-Math.PI / 4, 0, 0],
    config: { tension: 170, friction: 26 },
  }));

  const bind = useGesture({
    //move card
    onDrag: ({ active, movement: [x, y] }) => {
      setIsDragging(active);
      const newX = x / aspect + position.x / scaling;
      const newY = -(y / aspect + position.y / scaling);
      setCardPos({ x: newX, y: newY });
      set({
        position: [newX, newY, z],
      });
      setOnTable(newY > 1);
    },
    //place card on stack or reset to original position
    onDragEnd: () => {
      if (Math.abs(cardPos.x) < 0.5 && Math.abs(cardPos.y - 4) < 0.5) {
        playCard({ id, name });
        if (name.split("/")[0] === "black") {
          setColorChangerActive(true);
        }
        removeFromHand(id);
      }
      setOnTable(false);
      set({ position: [position.x / scaling, -position.y / scaling, z] });
    },
    //selection scaling
    onHover: ({ hovering }) => {
      hoverCard(id);
      set({
        scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1],
        rotation: hovering ? [0, 0, 0] : [0, 0, rotZ0],
      });
    },
  });

  useEffect(() => {
    if (onTable) {
      set2({ position: [0, 0, 4], rotation: [-Math.PI / 2, 0, 0] });
    } else {
      set2({ position: [0, 4, 4], rotation: [-Math.PI / 4, 0, 0] });
    }
  }, [onTable, set2]);

  useEffect(() => {
    set({
      scale: [1, 1, 1],
      position: [position.x / scaling, -position.y / scaling, z],
      rotation: [0, 0, rotZ0],
    });
  }, [position, z, rotZ0, set]);

  return (
    <animated.group ref={ref} {...spring2}>
      <animated.group
        ref={ref2}
        onClick={(event) => {
          event.stopPropagation();
        }}
        //   onPointerEnter={() => setShiny(true)}
        // onPointerLeave={() => setShiny(false)}
        {...spring}
        {...bind()}
      >
        <animated.mesh
          castShadow
          receiveShadow
          geometry={RoundedBoxFlat(
            CARD_WIDTH,
            CARD_HEIGHT,
            CARD_DEPTH,
            CARD_RADIUS,
            CARD_SMOOTHNESS
          )}
        >
          <meshStandardMaterial
            attach="material-0"
            map={textureMap[name]}
            side={THREE.DoubleSide}
            emissive={color === bgColor ? new THREE.Color(bgColor) : "black"}
            emissiveIntensity={emissiveIntensity[color]}
          />
          <meshStandardMaterial
            attach="material-1"
            map={textureMap["back"]}
            side={THREE.DoubleSide}
          />
          <meshStandardMaterial
            attach="material-2"
            color={"black"}
            side={THREE.DoubleSide}
          />
        </animated.mesh>
      </animated.group>
    </animated.group>
  );
};

export default Card;
