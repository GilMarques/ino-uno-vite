import { CameraControls, CameraShake } from "@react-three/drei";
import { useEffect, useRef } from "react";

const CameraController = ({
  playing,
  isDragging,
  theta,
  particleEffectsActive,
}) => {
  // console.log(props);
  const ref = useRef();

  // const  = props;
  useEffect(() => {
    ref.current?.setLookAt(
      //position
      4 * Math.sin(theta),
      6,
      4 * Math.cos(theta),
      // focus
      0,
      0,
      0,
      //transition
      true
    );
  }, [theta]);

  return (
    <>
      <CameraControls
        ref={ref}
        makeDefault
        enabled={!isDragging}
        minPolarAngle={playing ? Math.PI / 6 : -Infinity}
        maxPolarAngle={playing ? Math.PI / 3 : Infinity}
        minAzimuthAngle={playing ? theta - Math.PI / 6 : -Infinity}
        maxAzimuthAngle={playing ? theta + Math.PI / 6 : Infinity}
        azimuthRotateSpeed={0.2}
        polarRotateSpeed={0.2}
        maxSpeed={1}
        mouseButtons={{
          left: 1,
          middle: 0,
          right: 0,
          wheel: 0,
        }}
      />
      {particleEffectsActive && (
        <CameraShake
          controls={ref}
          maxPitch={0.03}
          maxRoll={0.03}
          maxYaw={0.03}
          yawFrequency={3}
          pitchFrequency={3}
          rollFrequency={3}
          intensity={0.5}
        />
      )}
    </>
  );
};

export default CameraController;
