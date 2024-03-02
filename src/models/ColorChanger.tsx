import { animated, useSpring } from "@react-spring/three";
import { useEffect, useState } from "react";
import * as THREE from "three";

const colorsInit = ["red", "blue", "green", "yellow"].sort(
  () => Math.random() - 0.5
);

const emissiveIntensity = {
  red: 1,
  blue: 1.1,
  green: 2,
  yellow: 0.2,
};
const args = [1, 1, 2, 20, 2, false, 0, Math.PI / 2];

const ColorChanger = ({ colorChangerActive, changeBgColor, theta }) => {
  const [spring, setSpring] = useSpring(() => ({
    scale: [1, 0, 1],
    config: { tension: 180, friction: 10 },
  }));
  const [colors, setColors] = useState(colorsInit);

  useEffect(() => {
    // setColors(colorsInit.sort(() => Math.random() - 0.5));
    if (colorChangerActive) {
      setSpring({
        scale: [1, 0.5, 1],
        config: { tension: 180, friction: 10 },
      });
    } else {
      setSpring({
        scale: [1, 0, 1],
        config: { duration: 300 },
      });
    }
  }, [colorChangerActive]);

  const handleOnClick = (e, c) => {
    e.stopPropagation();

    if (colorChangerActive) {
      changeBgColor(c);
    }
  };

  return (
    <animated.group
      position={[0, -0.1, 0]}
      rotation={[0, theta, 0]}
      {...spring}
    >
      <mesh
        position={[0, 0, 0]}
        rotation={[0, -Math.PI / 4, 0]}
        onClick={(e) => handleOnClick(e, colors[0])}
      >
        <cylinderGeometry args={args} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          color={colors[0]}
          emissive={colors[0]}
          emissiveIntensity={emissiveIntensity[colors[0]]}
        />
      </mesh>

      <mesh
        position={[0, 0, 0]}
        rotation={[0, (-5 * Math.PI) / 4, 0]}
        onClick={(e) => handleOnClick(e, colors[1])}
      >
        <cylinderGeometry args={args} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          color={colors[1]}
          emissive={colors[1]}
          emissiveIntensity={emissiveIntensity[colors[1]]}
        />
      </mesh>

      <mesh
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 4, 0]}
        onClick={(e) => handleOnClick(e, colors[2])}
      >
        <cylinderGeometry args={args} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          color={colors[2]}
          emissive={colors[2]}
          emissiveIntensity={emissiveIntensity[colors[2]]}
        />
      </mesh>

      <mesh
        position={[0, 0, 0]}
        rotation={[0, (-3 * Math.PI) / 4, 0]}
        onClick={(e) => handleOnClick(e, colors[3])}
      >
        <cylinderGeometry args={args} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          color={colors[3]}
          emissive={colors[3]}
          emissiveIntensity={emissiveIntensity[colors[3]]}
        />
      </mesh>
    </animated.group>
  );
};

export default ColorChanger;
