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

updateNameSpace.on("connection", (socket) => {
  socket.userData = {
    index: 0,
  };

  connectedSockets.set(socket.id, socket);
  console.log(`${socket.id} has connected to update namespace`);

  socket.on("setID", () => {
    updateNameSpace.emit("setID", socket.id);

    socket.on("disconnect", () => {
      console.log(`${socket.id} has disconnected`);
      connectedSockets.delete(socket.id);
      updateNameSpace.emit("removePlayer", socket.id);
    });
  });

  setInterval(() => {
    const playerData = [];
    for (const socket of connectedSockets.values()) {
      if (socket.userData.name !== "" && socket.userData.avatarSkin !== "") {
        playerData.push({});
      }
    }
    console.log(playerData);

    // if (socket.userData.name === "" || socket.userData.avatarSkin === "") {
    //   return;
    // } else {
    //   updateNameSpace.emit("playerData", playerData);
    // }
  }, 20);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
