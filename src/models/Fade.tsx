import { animated, easings, useSpring } from "@react-spring/three";
import { Billboard, Hud } from "@react-three/drei";
import { useEffect, useRef } from "react";
const Fade = () => {
  const ref = useRef();
  const [spring, api] = useSpring(() => ({
    opacity: 1,
    config: { easing: easings.easeOutCubic },
  }));

  useEffect(() => {
    api.start({
      opacity: 0,
    });
  }, [api]);

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
