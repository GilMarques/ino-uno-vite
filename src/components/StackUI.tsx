import { useDispatch, useSelector } from "react-redux";
import { cards } from "../assets";
import { joinGame, returnCard } from "../state/game/gameActions";
import type { RootState } from "../state/store";

// const seatColors = ["red", "blue", "green", "yellow"];

const StackUI = () => {
  const top5 = useSelector((state: RootState) =>
    state.game.stack.slice().reverse().slice(0, 5)
  );
  const numberOnTable = useSelector(
    (state: RootState) => Object.keys(state.game.players).length
  );

  const onTable = useSelector((state: RootState) => state.game.onTable);
  const dispatch = useDispatch();

  const returnToHand = (id: number) => {
    dispatch(returnCard({ card_id: id }));
  };
  const join = () => {
    dispatch(joinGame());
  };

  const fromName = (name: string) => {
    const [color, number] = name.split("/");
    return { name, color: color, number: number };
  };

  return (
    <div className="absolute left-10 top-10 md:w-32 p-4 select-none flex flex-col items-center bg-white bg-opacity-80 text-xl">
      {!onTable && (
        <button
          onClick={join}
          className={`press-start-2p-regular bg-slate-500 p-2 ${
            numberOnTable >= 4
              ? "text-red-500"
              : "text-white hover:bg-slate-600"
          }   `}
          disabled={numberOnTable >= 4}
        >
          {numberOnTable >= 4 ? "FULL" : "Join"}
        </button>
      )}
      <h1 className="text-center font-bold press-start-2p-regular">Table</h1>

      <div className="flex  md:flex-col items-center justify-center gap-5">
        {top5.map((card) => {
          return (
            <div
              key={card.id}
              className="relative flex items-center justify-center"
            >
              <img
                className="rounded-[8px] w-[50px]   border-2 border-black"
                src={
                  //@ts-ignore
                  cards[fromName(card.name).color][fromName(card.name).number]
                }
                width={50}
                draggable={false}
                alt={card.name}
                onClick={() => returnToHand(card.id)}
              />
              {/* TODO: Add player indicator */}
              {/* <div
                className="absolute -top-2 -right-2   border-2 border-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: seatColors[card.ownerId % seatColors.length],
                }}
              ></div> */}
            </div>
          );
        })}
      </div>
      {/* <div className="flex flex-col  md:flex-row items-center justify-center ml-[40px] mt-5">
        {rest.map((card) => {
          return (
            <div className="ml-[-20px] flex items-center justify-center">
              <img
                className="rounded-[8px] w-[20px] border-2 border-black"
                src={
                  //@ts-ignore
                  cards[fromName(card.name).color][fromName(card.name).number]
                }
                width={10}
                alt={card.name}
                onClick={() => removeCard(card)}
              />
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default StackUI;
