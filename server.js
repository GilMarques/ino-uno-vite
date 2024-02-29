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
let serverDeck = deck;
let serverStack = [deck.pop()];
let maxSeats = 4;
let serverData = [];
for (let i = 0; i < maxSeats; i++) {
  serverData.push({ seat: i, cards: [] });
}

let serverColor = "white";
let serverRotation = false;
const updateNameSpace = io.of("/update");
const connectedSockets = new Map();

const shuffleDeck = (deck) => {
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

const rules = (card) => {
  return true;
};

updateNameSpace.on("connection", (socket) => {
  connectedSockets.set(socket.id, socket);
  console.log("Socket connected:", socket.id);

  socket.on("drawCard", (seat) => {
    const card = serverDeck.pop();
    console.log("seat", seat);
    console.log("serverdata", serverData);
    serverData[seat].cards.push(card);
    updateNameSpace.emit("cardDrawn", {
      serverData,
      deckLength: serverDeck.length,
    });
  });

  socket.on("join", (seat) => {
    const startingHand = serverDeck.splice(0, 7);
    serverData[seat] = {
      seat,
      cards: startingHand,
    };

    updateNameSpace.emit("playerJoined", {
      serverData,
      serverStack,
      deckLength: serverDeck.length,
      serverColor,
      serverRotation,
    });
  });

  socket.on("playCard", ({ seat, card }) => {
    serverStack.push(card);
    updateNameSpace.emit("playedCard", {});
  });

  socket.on("removeCard", ({ seat, card }) => {
    serverStack = serverStack.filter((c) => c.id !== card.id);
    serverData[seat].cards.push(card);
    updateNameSpace.emit("stackRemove", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
    });
  });

  // socket.on("hoverCard", () => {});

  socket.on("shuffleBack", () => {});

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected`);
    connectedSockets.delete(socket.id);
    updateNameSpace.emit("removePlayer", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
