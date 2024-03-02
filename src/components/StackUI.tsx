import { cardProps } from "@/types/Card";

type StackUIProps = {
  cardStack: cardProps[];
  removeCard: (card: cardProps) => void;
};

const StackUI = ({ cardStack, removeCard }: StackUIProps) => {
  return (
    <div className="absolute right-10 top-10 border-2 border-black bg-white">
      <div className="w-32 flex-col border-2 border-black">
        <h1 className="text-center">Cards</h1>

        {cardStack
          .toReversed()
          .slice(0, 5)
          .map((card) => (
            <div
              key={card.id}
              className="my-5 flex items-center justify-center"
            >
              <img
                className="rounded-[8px] border-2 border-black"
                src={`/src/assets/cards/${card.name}.png`}
                width={50}
                height={100}
                alt={`${card.name}`}
                onClick={() => removeCard(card)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default StackUI;
