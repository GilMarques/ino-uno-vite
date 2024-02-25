import Hand from "./Hand";

const Player = ({ playerID, z, theta, cards }) => {
  return (
    <Hand cards={cards} setIsDragging={setIsDragging} isDragging={isDragging} />
  );
};

export default Player;
