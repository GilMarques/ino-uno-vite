import React from "react";

var CARD_WIDTH = 0.4;
var CARD_HEIGHT = 0.6;
var CARD_DEPTH = 0.01;
var CARD_RADIUS = 0.07;
var CARD_SMOOTHNESS = 10;

import * as THREE from "three";

const BaseCard = (face) => {
  return (
    <mesh
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

export default BaseCard;
