import textureMap from "@/lib/texture";
import * as THREE from "three";
import deck from "../../startingDeck";

import RoundedBoxFlat from "@/lib/roundedboxflat";

import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";

//https://github.com/mrdoob/three.js/blob/master/examples/webgl_instancing_performance.html

var CARD_WIDTH = 0.4;
var CARD_HEIGHT = 0.6;
var CARD_DEPTH = 0.001;
var CARD_RADIUS = 0.07;
var CARD_SMOOTHNESS = 10;

const pointingAway = (function () {
  let x, y, z, w;

  const vFrom = new THREE.Vector3(0, 1, 0);
  const vTo = new THREE.Vector3();

  function randomFromInterval(min, max) {
    return Math.random() * (max - min + 1) + min;
  }

  return (position, quaternion, scale) => {
    const a = 5,
      b = 1;
    x =
      Math.random() > 0.5
        ? randomFromInterval(-a, -b)
        : randomFromInterval(a, b);
    y =
      Math.random() > 0.5
        ? randomFromInterval(-a, -b)
        : randomFromInterval(a, b);
    z =
      Math.random() > 0.5
        ? randomFromInterval(-a, -b)
        : randomFromInterval(a, b);
    position.x = x;
    position.y = y;
    position.z = z;
    w = 2 * Math.random() - 1;
    quaternion
      .setFromUnitVectors(vFrom, vTo.set(x, y, z).normalize())
      .multiply(new THREE.Quaternion(0, Math.sqrt(1 - w * w), 0, w));

    scale.x = scale.y = scale.z = 1;
  };
})();

const Newdeck = [...deck, ...deck];

const CardExplosion = ({ active }) => {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!active) {
      state.events.update();

      easing.damp3(
        ref.current.rotation,
        [-0.5 * state.pointer.y, 0.5 * state.pointer.x, 0],
        0.3,
        delta
      );
    } else {
      ref.current.rotation.y += 0.1;
    }
  });

  return (
    <group ref={ref}>
      {Newdeck.map((card, index) => {
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const rotation = new THREE.Euler();
        const scale = new THREE.Vector3();
        pointingAway(position, quaternion, scale);
        rotation.setFromQuaternion(quaternion);

        return (
          <mesh
            key={index}
            castShadow
            receiveShadow
            geometry={RoundedBoxFlat(
              CARD_WIDTH,
              CARD_HEIGHT,
              CARD_DEPTH,
              CARD_RADIUS,
              CARD_SMOOTHNESS
            )}
            position={position}
            rotation={rotation}
            scale={scale}
          >
            <meshStandardMaterial
              attach="material-0"
              map={textureMap[card.name]}
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
          </mesh>
        );
      })}
    </group>
  );
};

export default CardExplosion;
