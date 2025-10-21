import { useRef } from "react";
import { useSelector } from "react-redux";
import { textureMap3D } from "../../lib/loadTextures";
import RoundedBoxFlat from "../../lib/roundedBoxFlat";
import type { RootState } from "../../state/store";

import * as THREE from "three";
import OpponentCard from "./OpponentCard";

const Table = () => {
  const stackCards = useSelector((state: RootState) => state.game.stack);
  const groupRef = useRef<THREE.Group>(null);
  return (
    <group ref={groupRef}>
      {stackCards.map((card) => (
        <OpponentCard
          id={card.id}
          key={card.id}
          src={textureMap3D[card.name]}
          home={{
            x: card.pos[0],
            y: card.pos[1],
            angle: card.angle,
          }}
          groupRef={groupRef}
          isDragging={false}
          animate={false}
        />
      ))}
      <mesh receiveShadow geometry={RoundedBoxFlat(2, 2, 0, 0.3, 4)}>
        <meshStandardMaterial color={"brown"} />
      </mesh>
    </group>
  );
};

export default Table;
