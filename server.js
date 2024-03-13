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
      color != "black" &&
      value != "reverse" &&
      value != "block" &&
      value != "plus2"
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
let maxSeats = 6;
let serverData = [];
for (let i = 0; i < maxSeats; i++) {
  serverData.push({ seat: i, cards: null });
}

let spectators = 0;
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
  console.log("Socket connected:", socket.id);

  socket.on("join", () => {
    connectedSockets.set(socket, -1);
    spectators++;

    socket.emit("joined", {
      serverData,
      serverColor,
      serverRotation,
      serverStack,
      deckLength: serverDeck.length,
      spectators,
    });

    socket.broadcast.emit("spectators", {
      spectators,
    });
  });

  socket.on("takeSeat", (seat) => {
    if (connectedSockets.get(socket) !== -1) return;

    connectedSockets.set(socket, seat);

    if (serverData[seat].cards === null) {
      const startingHand = serverDeck.splice(0, 7);
      serverData[seat] = {
        seat,
        cards: startingHand,
      };
    }

    spectators--;

    socket.emit("seatTaken", {
      seat,
      serverData,
      serverStack,
      deckLength: serverDeck.length,
      serverColor,
      serverRotation,
      spectators,
    });

    socket.broadcast.emit("update", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
      deckLength: serverDeck.length,
      spectators,
    });
  });

  socket.on("leave", () => {
    const seat = connectedSockets.get(socket);

    if (seat === -1) return;
    serverDeck = [...serverDeck, ...serverData[seat].cards];
    serverData[seat].cards = null;
    connectedSockets.set(socket, -1);
    spectators++;

    socket.emit("left", {
      spectators,
      serverData,
    });

    socket.broadcast.emit("update", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
      deckLength: serverDeck.length,
      spectators,
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected`);
    const seat = connectedSockets.get(socket);
    if (seat === -1) {
      spectators--;
    } else {
      serverDeck = [...serverDeck, ...serverData[seat].cards];
      serverData[seat].cards = null;
    }
    connectedSockets.delete(socket);
    socket.broadcast.emit("update", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
      deckLength: serverDeck.length,
      spectators,
    });
  });

  socket.on("drawCard", () => {
    const seat = connectedSockets.get(socket);
    if (seat === -1) return;
    if (serverDeck.length === 0) return;

    const card = serverDeck.pop();
    if (serverDeck.length === 0 && serverStack.length > 0) {
      serverDeck = [...serverStack];
      serverDeck = shuffleDeck(serverDeck);
      serverStack = [];
    }
    serverData[seat].cards.push(card);

    socket.emit("cardDrawn", {
      serverData,
      serverStack,
      deckLength: serverDeck.length,
    });

    socket.broadcast.emit("update", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
      deckLength: serverDeck.length,
      spectators,
    });
  });

  socket.on("playCard", ({ card }) => {
    const seat = connectedSockets.get(socket);
    if (seat === -1) return;

    if (serverData[seat].cards.filter((c) => c.id === card.name).length !== 0) {
      return;
    }

    const [cardColor, cardValue] = card.name.split("/");
    serverColor = cardColor;
    if (cardValue === "reverse") {
      serverRotation = !serverRotation;
    }

    serverData[seat].cards = serverData[seat].cards.filter(
      (c) => c.id !== card.id
    );

    serverStack.push(card);

    socket.emit("playedCard", {
      serverColor,
      serverStack,
      spectators,
      serverData,
    });

    socket.broadcast.emit("update", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
      deckLength: serverDeck.length,
      spectators,
    });
  });

  socket.on("stackRemove", ({ card }) => {
    const seat = connectedSockets.get(socket);
    if (seat === -1) return;

    serverStack = serverStack.filter((c) => c.id !== card.id);
    serverData[seat].cards.push(card);

    serverColor =
      serverStack.length > 0
        ? serverStack[serverStack.length - 1].name.split("/")[0]
        : "white";
    if (card.name.split("/")[1] === "reverse") {
      serverRotation = !serverRotation;
    }

    socket.emit("removedFromStack", {
      serverColor,
      serverStack,
      spectators,
      serverData,
    });

    socket.broadcast.emit("update", {
      serverData,
      serverStack,
      serverRotation,
      serverColor,
      deckLength: serverDeck.length,
      spectators,
    });
  });

  socket.on("changeColor", (color) => {
    //card stack 0 hs to be black

    serverColor = color;
    updateNameSpace.emit("changedColor", serverColor);
  });
});

setInterval(() => {
  // console.log("Rotation", serverRotation);
  // console.log("Color", serverColor);
  // console.log("deck length", serverDeck.length);
  console.log("serverData", serverData);
  // console.log("nameSpace", updateNameSpace);
  // console.log("ServerStack", serverStack);
  // console.log("connectedSockets", connectedSockets);
}, 5000);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
