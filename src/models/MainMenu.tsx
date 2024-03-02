import CardExplosion from "@/models/CardExplosion";
import {
  Billboard,
  Center,
  Hud,
  Image,
  OrbitControls,
  Text3D,
} from "@react-three/drei";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Transition from "./Transition";

const MainMenu = () => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const ref = useRef();

  useEffect(() => {
    console.log(ref.current);
  });
  return (
    <>
      {/* <axesHelper args={[10]} /> */}
      <Billboard>
        <OrbitControls />

        <Image
          url="/Hero.png"
          transparent={true}
          scale={10}
          side={THREE.DoubleSide}
          radius={0}
          zoom={0.6}
          rotation={[0, 0, 0]}
        />
      </Billboard>

      <ambientLight intensity={2} />
      <Hud>
        <Billboard>
          <Center position={[0, -3, 0]}>
            <Text3D
              ref={ref}
              font={"/Inter_Bold.json"}
              bevelEnabled={true}
              height={0.01}
            >
              {"Press any key"}
              <meshBasicMaterial attach={"material-0"} color={"white"} />
              <meshBasicMaterial attach={"material-1"} color={"black"} />
            </Text3D>
          </Center>
        </Billboard>
      </Hud>

      <CardExplosion active={false} />
      <Transition />
    </>
  );
};

export default MainMenu;
