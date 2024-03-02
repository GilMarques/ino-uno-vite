import { Billboard } from "@react-three/drei";
import { useEffect, useRef } from "react";

const Transition = () => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.material);
    }
  });

  return (
    <Billboard>
      <mesh ref={ref} position={[0, 0, 7]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color={"white"} transparent={true} opacity={0} />
      </mesh>
    </Billboard>
  );
};

export default Transition;
