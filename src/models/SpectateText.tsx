import { Billboard, Center, Hud, Text3D } from "@react-three/drei";
import { useRef } from "react";

const SpectateText = () => {
  const ref = useRef();

  return (
    <Hud>
      <Billboard>
        <Center position={[0, 3, 0]}>
          <Text3D font={"./Inter_Bold.json"} height={0.1} ref={ref}>
            Spectating
            <meshBasicMaterial
              attach={"material-0"}
              color={"white"}
              opacity={0}
            />
            <meshBasicMaterial
              attach={"material-1"}
              color={"black"}
              transparent={true}
            />
          </Text3D>
        </Center>
      </Billboard>
    </Hud>
  );
};

export default SpectateText;
