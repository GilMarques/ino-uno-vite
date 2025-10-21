import * as THREE from "three";
import { textureMap3D } from "../../lib/loadTextures.js";

import RoundedBoxFlat from "../../lib/roundedBoxFlat.ts";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import deck from "../../lib/startingDeck.ts";
import { Card_Dimensions } from "../game/Game.tsx";

//https://github.com/mrdoob/three.js/blob/master/examples/webgl_instancing_performance.html

const pointingAway = (
  position: THREE.Vector3,
  quaternion: THREE.Quaternion,
  scale: THREE.Vector3
) => {
  let r, theta, phi, w;

  const vFrom = new THREE.Vector3(0, 1, 0);
  const vTo = new THREE.Vector3();

  function randomFromInterval(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
  }

  const a = 2,
    b = 5;

  r = randomFromInterval(a, b);
  theta = 2 * Math.PI * Math.random();
  phi = 2 * Math.PI * Math.random();

  position.setFromSphericalCoords(r, theta, phi);
  w = 2 * Math.random() - 1;
  quaternion
    .setFromUnitVectors(vFrom, vTo.copy(position).normalize())
    .multiply(new THREE.Quaternion(0, Math.sqrt(1 - w * w), 0, w));

  scale.x = scale.y = scale.z = 1;

  return { position, quaternion, scale };
};

function damp3(
  current: THREE.Euler | THREE.Vector3,
  target: [number, number, number],
  lambda: number,
  delta: number
) {
  current.x = THREE.MathUtils.lerp(
    current.x,
    target[0],
    1 - Math.exp(-lambda * delta)
  );
  current.y = THREE.MathUtils.lerp(
    current.y,
    target[1],
    1 - Math.exp(-lambda * delta)
  );
  current.z = THREE.MathUtils.lerp(
    current.z,
    target[2],
    1 - Math.exp(-lambda * delta)
  );
}

const Newdeck = [...deck, ...deck];
const cardArray: any[] = [];
for (let i = 0; i < Newdeck.length; i++) {
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const rotation = new THREE.Euler();
  const scale = new THREE.Vector3();
  const {
    position: newPosition,
    quaternion: newQuaternion,
    scale: newScale,
  } = pointingAway(position, quaternion, scale);
  rotation.setFromQuaternion(newQuaternion);
  cardArray.push({
    name: Newdeck[i].name,
    position: newPosition,
    rotation,
    scale: newScale,
  });
}
const CardExplosion = ({ rotate }: { rotate: boolean }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!rotate) {
      state.events?.update?.();
      damp3(
        ref.current!.rotation,
        [-0.4 * state.pointer.y, 0.4 * state.pointer.x, 0],
        0.3,
        delta
      );
    } else {
      ref.current!.rotation.y += 0.1;
    }
  });

  return (
    <group ref={ref}>
      {cardArray.map(({ name, position, rotation, scale }, index) => {
        return (
          <mesh
            key={index}
            castShadow
            receiveShadow
            geometry={RoundedBoxFlat(
              Card_Dimensions.WIDTH,
              Card_Dimensions.HEIGHT,
              Card_Dimensions.DEPTH,
              Card_Dimensions.RADIUS,
              Card_Dimensions.SMOOTHNESS
            )}
            position={position}
            rotation={rotation}
            scale={scale}
          >
            <meshStandardMaterial
              attach="material-0"
              map={textureMap3D[name]}
              side={THREE.DoubleSide}
            />
            <meshStandardMaterial
              attach="material-1"
              map={textureMap3D["back"]}
              side={THREE.DoubleSide}
            />
            <meshStandardMaterial
              attach="material-2"
              color={"black"}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default CardExplosion;
