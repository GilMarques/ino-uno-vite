import { Environment } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";

import { useSelector } from "react-redux";
import type { RootState } from "../../state/store";
import OpponentHand from "./OpponentHand";
import PlayerHand from "./PlayerHand";
import Table from "./Table";

import * as THREE from "three";

const rotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

export const Card_Dimensions = {
  WIDTH: 0.4,
  HEIGHT: 0.6,
  DEPTH: 0.001,
  RADIUS: 0.07,
  SMOOTHNESS: 4,
};

const Game = ({}) => {
  const sid = useSelector((state: RootState) => state.game.sid);
  const players = useSelector((state: RootState) => state.game.players);
  const seat = useSelector((state: RootState) => state.game.seat);

  const opponents = useMemo(
    () => Object.values(players).filter((p) => p.sid !== sid),
    [players, sid]
  );

  const worldRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!worldRef.current || seat == -1) return;

    worldRef.current.rotation.z = -rotations[seat % 4];
  }, [seat]);

  return (
    <>
      <group ref={worldRef}>
        <axesHelper scale={5} />
        <ambientLight intensity={0.7} />
        <Table />
        <Environment
          preset="forest"
          background={true}
          backgroundRotation={[Math.PI / 2, 0, 0]}
          blur={0.4}
        />
        {opponents.map((player) => {
          return (
            <OpponentHand id={player.sid} key={player.sid} seat={player.seat} />
          );
        })}
      </group>
      (
      <PlayerHand />)
    </>
  );
};

export default Game;
