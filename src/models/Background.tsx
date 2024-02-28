import { animated, useSpring } from "@react-spring/three";
import { useEffect } from "react";
import * as THREE from "three";

const Background = ({ bgColor }: { bgColor: string }) => {
  const [spring, setSpring] = useSpring(() => ({
    color: "rgb(255, 255, 255)",
    config: { duration: 500 },
  }));

  useEffect(() => {
    switch (bgColor) {
      case "red":
        setSpring({
          color: "rgb(255, 85, 85)",
        });
        break;
      case "blue":
        setSpring.start({
          color: "rgb(85, 85, 255)",
        });
        break;
      case "green":
        setSpring.start({
          color: "rgb(85, 170, 85)",
        });
        break;
      case "yellow":
        setSpring.start({
          color: "rgb(255, 170, 0)",
        });
        break;

      default:
        setSpring.start({
          color: "rgb(255, 255, 255)",
        });
        break;
    }
  }, [bgColor, setSpring]);

  return (
    <group dispose={null} name={"background"} renderOrder={-1}>
      <mesh>
        <sphereGeometry args={[200, 64, 64]} />
        <animated.meshBasicMaterial {...spring} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default Background;
