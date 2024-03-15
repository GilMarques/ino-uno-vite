import { Billboard, Center, Float, Hud, Text } from "@react-three/drei";

const SpectateText = () => {
  return (
    <Hud renderPriority={4}>
      <Billboard>
        <Center position={[0.5, -2, 0]}>
          <Float speed={10} rotationIntensity={0} floatIntensity={0.5}>
            <Text outlineWidth={0.1}>Spectating</Text>
          </Float>
        </Center>
      </Billboard>
    </Hud>
  );
};

export default SpectateText;
