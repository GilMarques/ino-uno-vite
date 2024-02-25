import textureMap from "@/lib/texture";

import RoundedBoxFlat from "@/lib/roundedboxflat";

const CARD_WIDTH = 0.4;
const CARD_HEIGHT = 0.6;
const CARD_DEPTH = 0.01;
const CARD_RADIUS = 0.07;
const CARD_SMOOTHNESS = 10;

import * as THREE from "three";

type BaseCardProps = {
  name: string;
  position0: [number, number, number];
  rotation0: [number, number, number];
  rotation1: [number, number, number];
  position1: [number, number, number];
  rotation2: [number, number, number];
};

const BaseCard = ({
  name,
  rotation0,
  rotation1,
  position0,
  position1,
  rotation2,
}: BaseCardProps) => {
  return (
    <group rotation={rotation0}>
      <group position={position0} rotation={rotation1}>
        <group position={position1} rotation={rotation2}>
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
        </group>
      </group>
    </group>
  );
};

export default BaseCard;
