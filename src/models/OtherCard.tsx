import textureMap from "@/lib/texture";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import RoundedBoxFlat from "@/lib/roundedboxflat";
import { animated, useSpring } from "@react-spring/three";

//https://docs.pmnd.rs/react-three-fiber/api/events

const CARD_WIDTH = 0.4;
const CARD_HEIGHT = 0.6;
const CARD_DEPTH = 0.001;
const CARD_RADIUS = 0.07;
const CARD_SMOOTHNESS = 10;

type OtherCardProps = {
  name: string;
  position: { x: number; y: number };
  rotZ0: number;
};

const OtherCard = ({ position, rotZ0 }: OtherCardProps) => {
  const ref = useRef<THREE.Group>(null);
  const ref2 = useRef<THREE.Group>(null);
  const scaling = 200;
  const z = 0.01;

  const [spring, set] = useSpring(() => ({
    scale: [1, 1, 1],
    position: [position.x / scaling, -position.y / scaling, z],
    rotation: [0, 0, rotZ0],
    config: { friction: 15 },
  }));

  const [spring2, set2] = useSpring(() => ({
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],

    config: { tension: 170, friction: 26 },
  }));

  const [spring3, set3] = useSpring(() => ({
    opacity: 0,
  }));

  useEffect(() => {
    // set2({ position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] });
    set2({ position: [0, 4, 4], rotation: [-Math.PI / 4, 0, 0] });
    set3({ opacity: 1 });
  }, []);

  useEffect(() => {
    set({
      scale: [1, 1, 1],
      position: [position.x / scaling, -position.y / scaling, z],
      rotation: [0, 0, rotZ0],
    });
  }, [position, z, rotZ0, set]);

  useEffect(() => {});

  return (
    //   @ts-expect-error ts-migrate(2322)
    <animated.group ref={ref} {...spring2}>
      {/*  @ts-expect-error ts-migrate(2322) */}
      <animated.group ref={ref2} {...spring}>
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
          <animated.meshStandardMaterial
            attach="material-0"
            // map={textureMap[name]}
            side={THREE.DoubleSide}
            transparent={true}
            {...spring3}
          />
          <animated.meshStandardMaterial
            attach="material-1"
            map={textureMap["back"]}
            side={THREE.DoubleSide}
            transparent={true}
            {...spring3}
          />
          <animated.meshStandardMaterial
            attach="material-2"
            color={"black"}
            side={THREE.DoubleSide}
            transparent={true}
            {...spring3}
          />
        </animated.mesh>
      </animated.group>
    </animated.group>
  );
};

export default OtherCard;
