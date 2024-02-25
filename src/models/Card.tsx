// boxGeometry for different card faces
"use client";
import textureMap from "@/lib/texture";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import RoundedBoxFlat from "@/lib/roundedboxflat";
import { animated, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { cardProps } from "../types/Card";

//https://docs.pmnd.rs/react-three-fiber/api/events

const CARD_WIDTH = 0.4;
const CARD_HEIGHT = 0.6;
const CARD_DEPTH = 0.001;
const CARD_RADIUS = 0.07;
const CARD_SMOOTHNESS = 10;

type CardProps = {
  id: string;
  name: string;
  x0: number;
  y0: number;
  rotX0: number;
  rotZ0: number;
  remove: (id: string) => void;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setCardStack: React.Dispatch<React.SetStateAction<cardProps[]>>;
};

const Card = ({
  x0,
  y0,
  id,
  rotX0,
  rotZ0,
  name,
  remove,

  setIsDragging,
  setCardStack,
}: CardProps) => {
  //TODO: make hover global

  const ref = useRef<THREE.Group>();
  const scaling = 200;
  const [relPos, setRelPos] = useState([x0, y0]);
  const z = 0.01;
  const [onTable, setOnTable] = useState(false);
  const [hover, setHover] = useState(false);

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [x0 / scaling, -y0 / scaling, z],
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
      const newX = x / aspect + x0 / scaling;
      const newY = -(y / aspect + y0 / scaling);
      setRelPos([newX, newY]);
      set({
        position: [newX, newY, z],
      });

      setOnTable(newY > 1);
    },
    //place card on stack or reset to original position
    onDragEnd: () => {
      console.log("relPos", relPos);
      const eps = 0.5;
      if (Math.abs(relPos[0]) < eps && Math.abs(relPos[1] - 4) < eps) {
        setCardStack((prev: cardProps[]) => {
          return [...prev, { id: id, name: name }];
        });
        remove(id);
      }
      setOnTable(false);
      set({ position: [x0 / scaling, -y0 / scaling, z] });
    },
    //selection scaling
    onHover: ({ hovering }) =>
      set({
        scale: hovering ? [1.2, 1.2, 1.2] : [1, 1, 1],
        rotation: hovering ? [0, 0, 0] : [0, 0, rotZ0],
      }),
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
      position: [x0 / scaling, -y0 / scaling, z],
      rotation: [0, 0, rotZ0],
    });
  }, [x0, y0, z, rotZ0, set]);

  return (
    <animated.group ref={ref} {...spring2}>
      <animated.group
        name={name}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHover(false);
        }}
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
