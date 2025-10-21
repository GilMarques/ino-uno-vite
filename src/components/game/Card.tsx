import { useEffect, useRef } from "react";

import { textureMap3D } from "../../lib/loadTextures";

import { useThree, type Viewport } from "@react-three/fiber";
import { useDispatch } from "react-redux";
import * as THREE from "three";
import RoundedBoxFlat from "../../lib/roundedBoxFlat";
import { cardHover, dragEnd, dragMove } from "../../state/game/gameActions";
import { Card_Dimensions } from "./Game";
import { useCardPhysics } from "./usePhysics";

const Card = ({
  id,
  src,
  home,
  groupRef,
  interactable = true,
  source,
  source_origin,
}: {
  id: number;
  src: THREE.Texture;
  home: { x: number; y: number; angle: number };
  groupRef: React.RefObject<THREE.Group | null>;
  interactable?: boolean;
  source: "deck" | "stack";
  source_origin?: [number, number];
}) => {
  const isDragging = useRef(false);
  const dispatch = useDispatch();

  const { viewport } = useThree();

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;

    if (!ref.current || !isDragging.current) return;
    dispatch(
      dragMove({
        card_id: id,
        position: [
          ref.current.position.x - home.x,
          ref.current.position.y - home.y,
        ],
        angle: ref.current.rotation.z,
      })
    );
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();

    if (!ref.current || !isDragging.current) return;
    isDragging.current = false;

    dispatch(
      dragEnd({
        card_id: id,
        position: [
          ref.current.position.x - home.x,
          ref.current.position.y - home.y,
        ],
        angle: ref.current.rotation.z,
      })
    );
  };

  const handlePointerMove = (e: any) => {
    e.stopPropagation();

    if (!ref.current || !isDragging.current) return;

    dispatch(
      dragMove({
        card_id: id,
        position: [
          ref.current.position.x - home.x,
          ref.current.position.y - home.y,
        ],
        angle: ref.current.rotation.z,
      })
    );
  };

  const handlePointerEnter = (e: any) => {
    e.stopPropagation();
    dispatch(
      cardHover({
        card_id: id,
        hovering: true,
      })
    );
  };

  const handlePointerLeave = (e: any) => {
    e.stopPropagation();
    dispatch(
      cardHover({
        card_id: id,
        hovering: false,
      })
    );
  };

  const ref = useCardPhysics({
    home,
    isDragging: () => isDragging.current,
    groupRef,
  });

  useEffect(() => {
    // Set pointer up here because we want to capture pointer ups even when not over the card
    if (!interactable) return;
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [interactable]);

  const start = (
    viewport: Viewport,
    source: "deck" | "stack",
    source_origin?: [number, number]
  ): [number, number, number] => {
    if (source === "stack" && source_origin) {
      console.log("Starting from stack at", source_origin);
      return [source_origin[0], source_origin[1], 0];
    }
    return [viewport.width / 2, -viewport.height / 2, 5];
  };

  useEffect(() => {
    if (!ref.current) return;

    ref.current.position.set(...start(viewport, source, source_origin));
  }, []);

  return (
    <group
      ref={ref}
      position={[home.x, home.y, 0]}
      rotation={[0, 0, home.angle]}
      onPointerEnter={interactable ? handlePointerEnter : undefined}
      onPointerLeave={interactable ? handlePointerLeave : undefined}
      onPointerDown={interactable ? handlePointerDown : undefined}
      onPointerMove={interactable ? handlePointerMove : undefined}
    >
      <mesh
        receiveShadow
        geometry={RoundedBoxFlat(
          Card_Dimensions.WIDTH,
          Card_Dimensions.HEIGHT,
          Card_Dimensions.DEPTH,
          Card_Dimensions.RADIUS,
          Card_Dimensions.SMOOTHNESS
        )}
      >
        <meshStandardMaterial
          attach="material-0"
          map={src}
          side={THREE.DoubleSide}
        />
        <meshStandardMaterial
          attach="material-1"
          map={textureMap3D["back"]}
          side={THREE.DoubleSide}
        />
        <meshStandardMaterial
          attach="material-2"
          color={"black"}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default Card;
