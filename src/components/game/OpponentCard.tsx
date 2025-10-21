import RoundedBoxFlat from "../../lib/roundedBoxFlat";

import { textureMap3D } from "../../lib/loadTextures";

import { useEffect } from "react";
import * as THREE from "three";
import { Card_Dimensions } from "./Game";
import { useCardPhysics } from "./usePhysics";

const OpponentCard = ({
  id,
  home,
  offset = { x: 0, y: 0, angle: 0 },
  groupRef,
  isDragging,
  src,
  source,
  source_origin,
  animate = true,
}: {
  id: number;
  home: { x: number; y: number; angle: number };
  offset?: { x: number; y: number; angle: number };
  isDragging: boolean;
  groupRef: React.RefObject<THREE.Group | null>;
  src: THREE.Texture;
  source?: "deck" | "stack";
  source_origin?: [number, number];
  animate?: boolean;
}) => {
  const ref = useCardPhysics({
    home,
    getTarget: () => ({
      x: home.x + offset.x,
      y: home.y + offset.y,
      angle: home.angle + offset.angle,
    }),
    isDragging: () => isDragging,
    groupRef,
  });

  useEffect(() => {
    if (!ref.current || !animate) return;

    let start: [number, number, number] = [0, 0, 0];
    if (source_origin) {
      start = [source_origin[0], source_origin[1], 0];
    }

    ref.current.position.set(...start);
  }, []);

  return (
    <group
      key={id}
      ref={ref}
      position={[home.x, home.y, 0]}
      rotation={[0, 0, home.angle]}
    >
      <mesh
        receiveShadow
        geometry={RoundedBoxFlat(
          Card_Dimensions.WIDTH,
          Card_Dimensions.HEIGHT,
          Card_Dimensions.DEPTH,
          Card_Dimensions.RADIUS,
          Card_Dimensions.SMOOTHNESS
        )}
      >
        <meshStandardMaterial
          attach="material-0"
          map={src}
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
    </group>
  );
};

export default OpponentCard;
