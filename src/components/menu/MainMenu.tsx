import { Billboard, Environment, Html, Hud, Image } from "@react-three/drei";
import * as THREE from "three";
import { hero } from "../../assets/index";
import CardExplosion from "./CardExplosion.js";
const MainMenu = ({
  rotate,
  onClick,
}: {
  rotate: boolean;
  onClick: () => void;
}) => {
  return (
    <>
      <Hud>
        <Html position={[0, 0, 0]} fullscreen={true}>
          <div
            className="min-h-full w-full border-2 border-black"
            onClick={onClick}
          ></div>
        </Html>
      </Hud>

      <CardExplosion rotate={rotate} />

      <Billboard>
        <Image
          url={hero}
          transparent={true}
          scale={5}
          side={THREE.DoubleSide}
          radius={0}
          zoom={0.6}
          rotation={[0, 0, 0]}
        />
      </Billboard>
      <Environment preset="forest" background={true} blur={0.4} />
    </>
  );
};

export default MainMenu;
