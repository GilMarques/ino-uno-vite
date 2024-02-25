import express from "express";
import http from "http";
import { Server } from "socket.io";

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

const updateNameSpace = io.of("/update");
const connectedSockets = new Map();

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
