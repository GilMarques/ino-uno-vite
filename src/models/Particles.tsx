import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
const texture = new THREE.TextureLoader().load("src/assets/star.png");

const emissiveIntensity = {
  red: 1,
  blue: 1,
  green: 2,
  yellow: 0.2,
  black: 1,
};

const StarParticle = ({ color, position, index }) => {
  const ref = useRef();
  const l = ((Math.random() + 1) / 2) * 0.25;
  const xDir = index % 2 ? -1 : 1;
  const vy0 = ((Math.random() + 1) / 2) * 0.008;
  let t = 0;
  useFrame((state, delta) => {
    t += delta * 10;
    ref.current.rotation.z += 0.05;
    ref.current.position.y += -0.001 * t * t + vy0 * t;
    ref.current.position.x += xDir * 0.0013 * t;
    ref.current.scale.x -= 0.001 * t;
    ref.current.scale.y -= 0.001 * t;
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[l, l]} />
      <meshPhongMaterial
        map={texture}
        color={color}
        transparent={true}
        emissive={color}
        emissiveIntensity={emissiveIntensity[color]}
      />
    </mesh>
  );
};

const Particles = ({ color, setActive }) => {
  const n = 5;

  const stars = [];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(false);
    }, 750);
    return () => clearInterval(interval);
  }, []);

  for (let i = 0; i < n; i++) {
    stars.push(
      <StarParticle key={i} index={i} color={color} position={[0, 0.01, 0]} />
    );
  }

  return <Billboard>{stars.map((s) => s)}</Billboard>;
};

export default Particles;