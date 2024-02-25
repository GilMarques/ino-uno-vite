"use client";
import deck from "@/lib/startingDeck";
import textureMap from "@/lib/texture";
import * as THREE from "three";

import RoundedBoxFlat from "@/lib/roundedboxflat";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

//https://github.com/mrdoob/three.js/blob/master/examples/webgl_instancing_performance.html

var CARD_WIDTH = 0.4;
var CARD_HEIGHT = 0.6;
var CARD_DEPTH = 0.001;
var CARD_RADIUS = 0.07;
var CARD_SMOOTHNESS = 10;

// Function to generate a random number following a standard normal distribution
function randn_bm() {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Function to generate a random number with a specified mean and standard deviation
function randn(mean, stdev) {
  return mean + stdev * randn_bm();
}

// Example usage

const pointingAway = (function () {
  let x, y, z, w, randomNumber;

  const vFrom = new THREE.Vector3(0, 1, 0);
  const vTo = new THREE.Vector3();
  const euler = new THREE.Euler();
  const mean = 0; // Mean of the distribution
  const stdev = 10; // Standard deviation of the distribution

  return (position, quaternion, scale) => {
    randomNumber = randn(mean, stdev);
    x = Math.random() * 10 - 5;
    y = Math.random() * 10 - 5;
    z = Math.random() * 10 - 5;
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

const CardExplosion = () => {
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.y += 0.0005;
  });

  return (
    <group ref={ref}>
      {deck.map((card) => {
        // const matrix = new THREE.Matrix4();

        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const rotation = new THREE.Euler();
        const scale = new THREE.Vector3();
        pointingAway(position, quaternion, scale);
        rotation.setFromQuaternion(quaternion);

        return (
          <mesh
            key={card.id}
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
