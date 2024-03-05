import { cardProps } from "@/types/Card";
import { animated, useTransition } from "react-spring";
type StackUIProps = {
  cardStack: cardProps[];
  removeCard: (card: cardProps) => void;
};

// .toReversed()
//           .slice(0, 5)
const StackUI = ({ cardStack, removeCard }: StackUIProps) => {
  // console.log("stackUI", reversedStack);
  const reversedStack = cardStack.slice().reverse().slice(0, 5);
  const transCards = useTransition(reversedStack, {
    keys: (card) => card.id,
    from: { opacity: 0, maxHeight: "0px" },
    enter: { opacity: 1, transform: "translateX(0px)", maxHeight: "80px" },
    leave: {
      opacity: 0,
      transform: "translateX(-100px)",
      maxHeight: "0px",
    },

    config: {
      duration: 400,
    },
  });

  return (
    // <animated.div className="rounded-xl border-2 border-black bg-white">
    <div className="absolute right-10 top-10 max-h-[500px] w-32 select-none flex-col rounded-2xl bg-white bg-opacity-80 text-xl">
      <div>
        <h1 className="text-center font-bold">Stack</h1>

        {transCards((style, card) => {
          return (
            <animated.div
              className="my-5 flex items-center justify-center"
              style={style}
            >
              <img
                className="rounded-[8px] border-2 border-black"
                src={`/src/assets/cards/${card.name}.png`}
                width={50}
                height={50}
                alt={`${card.name}`}
                onClick={() => removeCard(card)}
              />
            </animated.div>
          );
        })}
      </div>
    </div>
    // </animated.div>
  );
};

export default StackUI;
