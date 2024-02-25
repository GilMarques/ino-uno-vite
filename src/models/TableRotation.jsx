import { animated, useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
const texture = new THREE.TextureLoader().load(
  "src/assets/arrows_clockwise.png"
);

const TableRotation = ({ rotationDirection }) => {
  const ref = useRef();
  const [rotY, setRotY] = useState(0);
  const [spring, setSpring] = useSpring(() => ({
    color: "rgb(255, 255, 255)",

    config: { duration: 500 },
  }));

  const [spring2, setSpring2] = useSpring(() => ({
    scale: [1, 1, 1],
    config: { tension: 170, friction: 26 },
  }));

  useFrame(() => {
    ref.current.rotation.z -= 0.01;
  });

  useEffect(() => {
    console.log("rotationDirection", rotationDirection);
    setSpring2.start({
      // from: {
      //   scale: [1, 1, 1],
      //   rotation: rotationDirection
      //     ? [-Math.PI / 2, Math.PI, ref.current.rotation.z]
      //     : [-Math.PI / 2, 0, ref.current.rotation.z],
      // },
      to: [
        {
          scale: [0, 0, 1],
          rotation: rotationDirection
            ? [
                -Math.PI / 2,
                Math.PI,
                ref.current.rotation.z + 10 * Math.PI * -1,
              ]
            : [-Math.PI / 2, 0, ref.current.rotation.z + 10 * Math.PI * -1],
        },
        {
          scale: [1, 1, 1],
          rotation: rotationDirection
            ? [
                -Math.PI / 2,
                Math.PI,
                ref.current.rotation.z + 20 * Math.PI * -1,
              ]
            : [-Math.PI / 2, 0, ref.current.rotation.z + 20 * Math.PI * -1],
        },
      ],
      config: { immediate: true, tension: 170, friction: 26 },
    });
    // rotationDirection ? setRotY(Math.PI) : setRotY(0);
  }, [rotationDirection]);

  return (
    <group dispose={null} renderOrder={-1}>
      <animated.spotLight position={[0, 5, 0]} intensity={10} {...spring} />
      <ambientLight intensity={1} color={"white"} />
      <animated.mesh
        ref={ref}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        {...spring2}
      >
        <planeGeometry args={[1, 1]} />

        <meshLambertMaterial
          map={texture}
          transparent={true}
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.5}
        />
      </animated.mesh>
    </group>
  );
};

export default TableRotation;
