import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type UseCardPhysicsOptions = {
  home: { x: number; y: number; angle: number };
  getTarget?: () => { x: number; y: number; angle?: number };
  isDragging?: () => boolean;
  rotationConfig?: {
    speed?: number;
    maxRotation?: number;
  };
  physicsConfig?: {
    damping?: number;
    stiffness?: number;
    homeDamping?: number;
    homeStiffness?: number;
  };
  groupRef: React.RefObject<THREE.Group | null>;
};

export const useCardPhysics = ({
  home,
  getTarget,
  isDragging = () => false,
  rotationConfig,
  physicsConfig,
  groupRef,
}: UseCardPhysicsOptions) => {
  const ref = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();

  const target = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const targetRotation = useRef(home.angle);
  const currentRotation = useRef(home.angle);

  const damping = physicsConfig?.damping ?? 0.5;
  const stiffness = physicsConfig?.stiffness ?? 0.5;
  const homeDamping = physicsConfig?.homeDamping ?? 0.3;
  const homeStiffness = physicsConfig?.homeStiffness ?? 0.05;

  const rotationSpeed = rotationConfig?.speed ?? 0.1;
  const maxRotation = rotationConfig?.maxRotation ?? Math.PI / 4;

  useFrame(() => {
    if (!ref.current || !groupRef.current) return;

    const dragging = isDragging();
    const currentTarget = getTarget
      ? getTarget()
      : dragging
      ? {
          x:
            pointer.x * (viewport.width / 2) - groupRef.current.position.x || 0,
          y:
            pointer.y * (viewport.height / 2) - groupRef.current.position.y ||
            0,
        }
      : home;

    target.current.set(currentTarget.x, currentTarget.y, 0);

    ref.current.position.z = dragging ? 0.1 : 0;

    const currentStiffness = dragging ? stiffness : homeStiffness;
    const currentDamping = dragging ? damping : homeDamping;

    velocity.current.x +=
      (target.current.x - ref.current.position.x) * currentStiffness;
    velocity.current.y +=
      (target.current.y - ref.current.position.y) * currentStiffness;
    velocity.current.multiplyScalar(1 - currentDamping);
    ref.current.position.add(velocity.current);

    // rotation spring
    const baseAngle = dragging ? 0 : home.angle;
    const velocityMagnitude = velocity.current.length();
    const rotationIntensity = Math.min(velocityMagnitude * 5, 1);

    if (velocityMagnitude > 0.001) {
      const horizontalVelocity = velocity.current.x;
      targetRotation.current =
        baseAngle * rotationIntensity -
        (horizontalVelocity / velocityMagnitude) *
          rotationIntensity *
          maxRotation;
    } else {
      targetRotation.current += (baseAngle - targetRotation.current) * 0.05;
    }

    currentRotation.current +=
      (targetRotation.current - currentRotation.current) * rotationSpeed;
    ref.current.rotation.z = currentRotation.current;
  });

  return ref;
};
