import { usePlane } from "@react-three/cannon";
import { useRef } from "react";

const Plane = (props) => {
  const [ref] = usePlane(
    () => ({
      ...props,
    }),
    useRef(null)
  );
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial color="#171717" />
    </mesh>
  );
};

const Ground = () => {
  return <Plane rotation={[-Math.PI / 2, 0, 0]} />;
};

export default Ground;
