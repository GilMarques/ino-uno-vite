import textureMap from "@/lib/texture";

import RoundedBoxFlat from "@/lib/roundedboxflat";

const CARD_WIDTH = 0.4;
const CARD_HEIGHT = 0.6;
const CARD_DEPTH = 0.01;
const CARD_RADIUS = 0.07;
const CARD_SMOOTHNESS = 10;

import * as THREE from "three";

type OthersCardProps = {
  name: string;
};

const OthersCard = ({ name }: OthersCardProps) => {
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
    </mesh>
  );
};

export default OthersCard;
