import CardExplosion from "@/models/CardExplosion";
import Fade from "@/models/Fade";
import { Billboard, Environment, Html, Hud, Image } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
const MainMenu = ({ setConnected }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(true);

    const timeout = setTimeout(() => {
      setConnected(true);
    }, 1000);

    return () => clearTimeout(timeout);
  };

  return (
    <>
      <Hud>
        <Html position={[0, 0, 0]} fullscreen={true}>
          <div
            className="min-h-full w-full border-2 border-black"
            onClick={handleClick}
          ></div>
        </Html>
      </Hud>

      <CardExplosion active={active} />

      <Billboard>
        <Image
          url="./src/assets/Hero.png"
          transparent={true}
          scale={10}
          side={THREE.DoubleSide}
          radius={0}
          zoom={0.6}
          rotation={[0, 0, 0]}
        />
      </Billboard>
      <Environment
        files={"./src/assets/kloppenheim_01_puresky_4k.hdr"}
        background={true}
        blur={0.2}
      />

      <Fade active={active} type={true} duration={1000} />
    </>
  );
};

export default MainMenu;
