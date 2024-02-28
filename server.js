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
let cardStack = [deck.pop()];
let maxSeats = 4;
let serverData = [];

let bgColor = "white";
let rotationDirection = false;
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

  socket.on("drawCard", () => {});

  socket.on("join", () => {});

  socket.on("playCard", (card) => {});
  socket.on("removeCard", (card) => {});

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
