"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initDeck() {
  const deck = [];
  const colors = ["red", "green", "blue", "yellow"];
  const values = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "plus2",
    "reverse",
    "block",
  ];

  deck.push(
    { color: "special", value: "plus4" },
    { color: "special", value: "plus4" },
    { color: "special", value: "plus4" },
    { color: "special", value: "plus4" },
    { color: "special", value: "changecolor" },
    { color: "special", value: "changecolor" },
    { color: "special", value: "changecolor" },
    { color: "special", value: "changecolor" }
  );

  colors.forEach((color) => {
    values.forEach((value) => {
      deck.push({ color, value });
    });
  });

  return deck;
}

const Deck = () => {
  const [deck, setDeck] = useState(initDeck());

  const shuffle = () => {
    const shuffledDeck = shuffleDeck([...deck]);
    console.log("Shuffled:", shuffledDeck);
    setDeck(shuffledDeck);
  };

  const handleDraw = () => {
    console.log("Drawing:", deck.pop());
  };

  useEffect(() => {
    shuffle();
  }, []);

  return (
    <div className="absolute flex h-full w-8/12 items-center justify-center border-2 border-red-600">
      <div className="border-2 border-black" onClick={handleDraw}>
        Deck
        <Image src={"/assets/cards/back.png"} alt="" width={100} height={100} />
      </div>
    </div>
  );
};

export default Deck;
