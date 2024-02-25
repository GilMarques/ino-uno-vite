import RoundedBoxFlat from "@/lib/roundedboxflat";
import textureMap from "@/lib/texture";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// https://github.com/pmndrs/use-cannon/blob/master/packages/react-three-cannon-examples/src/demos/demo-CubeHeap.tsx

var CARD_WIDTH = 0.4;
var CARD_HEIGHT = 0.6;
var CARD_DEPTH = 0.01;
var CARD_RADIUS = 0.07;
var CARD_SMOOTHNESS = 10;

const cardTextures = textureMap;

const Plane = (props) => {
  const [ref] = usePlane(
    () => ({
      ...props,
    }),
    useRef(null)
  );
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial color="#171717" />
    </mesh>
  );
};

const FallingCard = ({ face, index, shake }) => {
  const args = [CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH];

  const [ref, api] = useBox(
    () => ({
      args,
      mass: 1,
      position: [
        0.1 * (Math.random() - 0.5),
        index * 5 * CARD_DEPTH,
        0.1 * (Math.random() - 0.5),
      ],
      rotation: [-Math.PI / 2, 0, 2 * Math.PI * Math.random()],

      sleepSpeedLimit: 0, // removes wobble
    }),
    useRef(null)
  );

  //Wobble cards on remove/add
  useEffect(() => {
    api.wakeUp();
  }, [shake]);

  return (
    <mesh
      ref={ref}
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
        map={cardTextures[face]}
        side={THREE.DoubleSide}
      />
      <meshStandardMaterial
        attach="material-1"
        map={cardTextures["back"]}
        side={THREE.DoubleSide}
      />
      <meshStandardMaterial
        attach="material-2"
        color={"black"}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Stack = ({ cardStack, position }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    console.log("cardStack", cardStack);
    setShake(true);
    const timeout = setTimeout(() => setShake(false), 1000);
    return () => clearTimeout(timeout);
  }, [cardStack]);

  return (
    <Physics allowSleep={true}>
      <Plane rotation={[-Math.PI / 2, 0, 0]} />

      {cardStack.map(({ id, name }, index) => (
        <FallingCard
          key={id}
          face={name}
          index={cardStack.length - index}
          shake={shake}
        />
      ))}
    </Physics>
  );
};

export default Stack;
