import { useDispatch, useSelector } from "react-redux";
import { card_back } from "../assets";
import { drawCard } from "../state/game/gameActions";
import { type RootState } from "../state/store";

const DeckUI = () => {
  const cardWidth = "w-[20vw] sm:w-[150px]"; // 20% of viewport width on small screens
  const cardHeight = "h-[28vw] sm:h-[210px]"; // adjust height proportionally

  const size = useSelector((state: RootState) => state.game.deckSize);
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(drawCard());
  };

  return (
    <div className="absolute right-10 bottom-10  select-none rounded-2xl">
      <div className="relative inline-block" onClick={onClick}>
        {size >= 10 && (
          <>
            <div
              className={`absolute top-[4px] left-[2px] ${cardWidth} ${cardHeight} bg-black rounded-[8px] border-2 border-black z-0`}
            ></div>
            <div
              className={`absolute top-[8px] left-[4px] ${cardWidth} ${cardHeight} bg-black rounded-[8px] border-2 border-black z-0`}
            ></div>
          </>
        )}
        {size < 10 && size >= 5 && (
          <>
            <div
              className={`absolute top-[6px] left-[4px] ${cardWidth} ${cardHeight} bg-black rounded-[8px] z-0`}
            ></div>
          </>
        )}

        {size > 0 && (
          <img
            className={`relative z-10 rounded-[8px] ${cardWidth} ${cardHeight} border-2 border-black`}
            src={card_back}
            width={150}
            height={210}
            alt="deck"
          />
        )}
      </div>
    </div>
  );
};

export default DeckUI;
