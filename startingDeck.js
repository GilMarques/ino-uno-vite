import { v4 as uuidv4 } from "uuid";

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
  { id: uuidv4(), name: "black/plus4" },
  { id: uuidv4(), name: "black/plus4" },
  { id: uuidv4(), name: "black/plus4" },
  { id: uuidv4(), name: "black/plus4" },
  { id: uuidv4(), name: "black/changecolor" },
  { id: uuidv4(), name: "black/changecolor" },
  { id: uuidv4(), name: "black/changecolor" },
  { id: uuidv4(), name: "black/changecolor" }
);

colors.forEach((color) => {
  values.forEach((value) => {
    deck.push({ id: uuidv4(), name: `${color}/${value}` });
  });
});

// Fisher-Yates shuffle
for (let i = deck.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [deck[i], deck[j]] = [deck[j], deck[i]];
}

export default deck;
