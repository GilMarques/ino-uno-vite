import { useMemo, useRef } from "react";
import coordsCache from "../../lib/cardFanning";
import { textureMap3D } from "../../lib/loadTextures";
import OpponentCard from "./OpponentCard";

import { useSelector } from "react-redux";
import { Group } from "three";
import type { RootState } from "../../state/store";

const OpponentHand = ({
  id,
  seat,
  max,
}: {
  id: string;
  seat: number;
  max: number;
}) => {
  const groupRef = useRef<Group>(null);

  const rotations: [number, number, number][] = [
    [0, 0, 0],
    [0, 0, Math.PI / 2],
    [0, 0, Math.PI],
    [0, 0, (3 * Math.PI) / 2],
  ];
  const positions: [number, number, number][] = [
    [0, -2, 0],
    [2, 0, 0],
    [0, 2, 0],
    [-2, 0, 0],
  ];

  const allCards = useSelector((state: RootState) => state.game.cards);
  const cards = useMemo(() => {
    return Object.values(allCards).filter((c) => c.owner_id === id);
  }, [allCards]);

  return (
    <group
      ref={groupRef}
      position={positions[seat % 4]}
      rotation={rotations[seat % 4]}
    >
      {cards.map((card) => (
        <OpponentCard
          id={card.id}
          key={card.hand_index}
          src={textureMap3D[allCards[card.id]?.name || "back"]}
          home={{
            x: coordsCache[cards.length][card.hand_index].x / 200,
            y: coordsCache[cards.length][card.hand_index].y / 200,
            angle: coordsCache[cards.length][card.hand_index].angle - Math.PI,
          }}
          offset={{
            x: card.offset_pos[0],
            y: card.offset_pos[1],
            angle: card.offset_angle,
          }}
          isDragging={card.dragging}
          groupRef={groupRef}
          source={card.source}
          source_origin={card.source_origin}
        />
      ))}
    </group>
  );
};

export default OpponentHand;
