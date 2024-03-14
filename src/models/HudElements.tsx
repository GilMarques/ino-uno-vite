import { Html, Hud } from "@react-three/drei";
import Seats from "../components/Seats";
import StackUI from "../components/StackUI";
const HudElements = ({
  maxPlayers,
  seatsTaken,
  takeSeat,
  handleLeave,
  cardStack,
  removeCard,
  spectators,
}) => {
  return (
    <Hud renderPriority={3}>
      <Html fullscreen={true}>
        <Seats
          sides={maxPlayers}
          takenSeats={seatsTaken}
          spectators={spectators}
          takeSeat={takeSeat}
          handleLeave={handleLeave}
        />
        <StackUI cardStack={cardStack} removeCard={removeCard} />
      </Html>
    </Hud>
  );
};

export default HudElements;
