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
          .slice(0, 5)
          .reverse()
          .map(({ id, name }) => (
            <div key={id} className="my-5 flex items-center justify-center">
              <img
                className="rounded-[8px] border-2 border-black"
                src={`/src/assets/cards/${name}.png`}
                width={50}
                height={100}
                alt={`${name}`}
                onClick={() => removeCard({ id, name })}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default StackUI;
