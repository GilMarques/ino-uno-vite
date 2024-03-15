import { animated, easings, useSpring } from "@react-spring/three";
import { Billboard, Hud } from "@react-three/drei";
import { useEffect, useRef } from "react";
const Fade = ({ active, type, duration = 500, onRest = () => {} }) => {
  const ref = useRef<THREE.MeshBasicMaterial>(null);
  const [spring, api] = useSpring(() => ({
    opacity: type ? 0 : 1,
    config: { duration: duration, easing: easings.easeInOutCubic },
  }));

  useEffect(() => {
    if (active) {
      api.start({
        opacity: type ? 1 : 0,
        onRest: () => {
          onRest();
        },
      });
    }
  }, [api, active, onRest, type]);

  return (
    <Hud renderPriority={2}>
      <Billboard>
        <animated.mesh>
          <planeGeometry args={[100, 100]} />
          <animated.meshBasicMaterial
            {...spring}
            ref={ref}
            color={"white"}
            transparent={true}
          />
        </animated.mesh>
      </Billboard>
    </Hud>
  );
};

export default Fade;
