import { useMemo, useRef } from "react";

import { useSelector } from "react-redux";
import { Group } from "three";
import coordsCache from "../../lib/cardFanning";
import { textureMap3D } from "../../lib/loadTextures";
import type { RootState } from "../../state/store";
import Card from "./Card";
const PlayerHand = () => {
  const all_cards = useSelector((state: RootState) => {
    return state.game.cards;
  });
  const sid = useSelector((state: RootState) => state.game.sid);

  const cards = useMemo(() => {
    return Object.values(all_cards).filter((c) => c.owner_id === sid);
  }, [all_cards, sid]);

  const groupRef = useRef<Group>(null);
  const position = { x: 0, y: -2, angle: 0 };

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, 0]}
      rotation={[0, 0, position.angle]}
    >
      {cards.map((card) => {
        return (
          <Card
            id={card.id}
            key={card.id}
            src={textureMap3D[card.name]}
            home={{
              x: coordsCache[cards.length][card.hand_index].x / 200,
              y: coordsCache[cards.length][card.hand_index].y / 200,
              angle: coordsCache[cards.length][card.hand_index].angle - Math.PI,
            }}
            groupRef={groupRef}
            source={card.source}
            source_origin={card.source_origin}
          />
        );
      })}
    </group>
  );
};

export default PlayerHand;
