import { Billboard, Center, Float, Hud, Text3D } from "@react-three/drei";

const SpectateText = () => {
  return (
    <Hud>
      <Billboard>
        <Center position={[0, -3, 0]}>
          <Float speed={30} rotationIntensity={0} floatIntensity={0.5}>
            <Text3D font={"/Inter_Bold.json"} height={0.1}>
              Spectating
              <meshBasicMaterial attach={"material-0"} color={"white"} />
              <meshBasicMaterial attach={"material-1"} color={"black"} />
            </Text3D>
          </Float>
        </Center>
      </Billboard>
    </Hud>
  );
};

export default SpectateText;
