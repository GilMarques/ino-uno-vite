const StackUI = ({ cardStack, setCardStack }) => {
  const handleOnClick = (card) => {
    setCardStack((prev) => {
      return prev.filter((c) => c.name !== card);
    });
  };

  return (
    <div className="absolute right-10 top-10 border-2 border-black bg-white">
      <div className="w-32 flex-col border-2 border-black">
        <h1 className="text-center">Cards</h1>

        {cardStack
          .slice(0, 5)
          .reverse()
          .map(({ id, name }, index) => (
            <div key={id} className="my-5 flex items-center justify-center">
              <img
                className="rounded-[8px] border-2 border-black"
                src={`/assets/cards/${name}.png`}
                width={50}
                height={100}
                alt={`${name}`}
                onClick={() => handleOnClick(name)}
                priority
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default StackUI;
