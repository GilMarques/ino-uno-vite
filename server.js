import express from "express";
import http from "http";
import { Server } from "socket.io";
import deck from "./startingDeck.js";
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

// Update Name Space ----------------------------------------

function coloredNumber(deck) {
  for (let card of deck) {
    let [color, value] = card.name.split("/");
    console.log("color", color, "value", value);
    if (
      color !== "black" &&
      (value !== "reverse" || value !== "block" || value !== "plus2")
    )
      return card;
  }
}

let serverDeck = deck;
let serverColor = "white";
let firstCard = coloredNumber(serverDeck);
console.log("firstCard", firstCard);
let color = firstCard.name.split("/")[0];
serverColor = color;
serverDeck = serverDeck.filter((card) => card.id !== firstCard.id);

let serverStack = [firstCard];
let maxSeats = 4;
let serverData = [];
for (let i = 0; i < maxSeats; i++) {
  serverData.push({ seat: i, cards: [] });
}

let serverRotation = false;
const updateNameSpace = io.of("/update");
const connectedSockets = new Map();

const shuffleDeck = (deck) => {
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const rules = (card) => {
  return true;
};

updateNameSpace.on("connection", (socket) => {
  connectedSockets.set(socket.id, socket);
  console.log("Socket connected:", socket.id);

  socket.on("drawCard", (seat) => {
    const card = serverDeck.pop();

    if (serverDeck.length === 0) {
      serverDeck = [...serverStack];
      serverDeck = shuffleDeck(serverDeck);
      serverStack = [];
    }
    console.log(serverDeck.length);
    serverData[seat].cards.push(card);
    updateNameSpace.emit("cardDrawn", {
      serverData,
      serverStack,
      deckLength: serverDeck.length,
    });
  });

  socket.on("join", (seat) => {
    if (serverData[seat].cards.length === 0) {
      const startingHand = serverDeck.splice(0, 7);
      serverData[seat] = {
        seat,
        cards: startingHand,
      };
    }

    updateNameSpace.emit("playerJoined", {
      serverData,
      serverStack,
      deckLength: serverDeck.length,
      serverColor,
      serverRotation,
    });
  });

  socket.on("playCard", ({ seat, card }) => {
    const [cardColor, cardValue] = card.name.split("/");
    serverColor = cardColor;
    if (cardValue === "reverse") {
      serverRotation = !serverRotation;
    }
    serverData[seat].cards = serverData[seat].cards.filter(
      (c) => c.id !== card.id
    );

    serverStack.push(card);

    updateNameSpace.emit("playedCard", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
    });
  });

  socket.on("stackRemove", ({ seat, card }) => {
    console.log("stackRemove", seat, card);
    serverStack = serverStack.filter((c) => c.id !== card.id);
    serverData[seat].cards.push(card);

    serverColor =
      serverStack.length > 0
        ? serverStack[serverStack.length - 1].name.split("/")[0]
        : "white";
    if (card.name.split("/")[1] === "reverse") {
      serverRotation = !serverRotation;
    }
    updateNameSpace.emit("removedFromStack", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
    });
  });

  socket.on("changeColor", (color) => {
    serverColor = color;
    updateNameSpace.emit("changedColor", serverColor);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected`);
    connectedSockets.delete(socket.id);
    updateNameSpace.emit("removePlayer", socket.id);
  });
});

const interval = setInterval(() => {
  console.log("Rotation", serverRotation);
  console.log("Color", serverColor);
  console.log("deck length", serverDeck.length);
  console.log("serverData", serverData);
  console.log("ServerStack", serverStack);
}, 5000);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
