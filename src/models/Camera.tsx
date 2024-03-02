import { useSpring } from "@react-spring/three";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";

const Camera = (near, far, position) => {
  const ref = useRef();
  const [spring, set] = useSpring(() => ({}));

  return (
    <PerspectiveCamera
      ref={ref}
      position={position}
      near={near}
      far={far}
      {...spring}
    />
  );
};

export default Camera;
