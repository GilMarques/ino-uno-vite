import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SRGBColorSpace, TextureLoader } from "three";
import { sort } from "../assets";

const texture = new TextureLoader().load(sort);
texture.colorSpace = SRGBColorSpace;

const SortButton = ({ position, sortCards }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const scaleMod = useRef<number>(1);

  const handleClick = () => {
    scaleMod.current = 3;
    sortCards();
  };

  useFrame((_state, delta) => {
    if (scaleMod.current > 1) {
      scaleMod.current -= 0.3;
    }
    if (ref.current) {
      easing.damp3(
        ref.current.scale,
        hovered
          ? [
              1.5 * scaleMod.current,
              1.5 * scaleMod.current,
              1.5 * scaleMod.current,
            ]
          : [1 * scaleMod.current, 1 * scaleMod.current, 1 * scaleMod.current],
        0.1,
        delta
      );
    }
  });

  return (
    <group
      onPointerDown={(event) => {
        event.stopPropagation();
        handleClick();
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(event) => {
        event.stopPropagation();
        setHovered(false);
      }}
    >
      <mesh ref={ref} position={position} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />

        <meshBasicMaterial
          attach={"material-1"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-3"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-4"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-5"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-0"}
          color={"#d6e4ff"}
          side={THREE.DoubleSide}
        />

        <meshBasicMaterial
          attach={"material-2"}
          map={texture}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default SortButton;
