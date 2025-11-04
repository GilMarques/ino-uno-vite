import type { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { setState } from "../game/gameSlice";
import type { GameStateUpdate } from "../model";
import { connected, disconnected, error as socketError } from "./socketSlice";
let socket: Socket | null = null;
// const url = "http://127.0.0.1:8000";
const url = "https://ino-uno.onrender.com";

export const socketMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    if (action.type === "socket/connect") {
      if (socket && socket.connected) {
        // Already connected; ignore repeated connect actions
        return next(action);
      }

      if (socket) {
        // Clean up previous socket if it exists but was disconnected
        socket.removeAllListeners();
        socket.disconnect();
      }

      socket = io(url, { path: "/sockets", autoConnect: false });

      socket.on("connect", () => storeAPI.dispatch(connected()));
      socket.on("connect_error", (err) =>
        storeAPI.dispatch(socketError(err.message))
      );
      socket.on("disconnect", () => storeAPI.dispatch(disconnected()));
      socket.on("game_state", (data: GameStateUpdate) =>
        storeAPI.dispatch(setState(data))
      );

      socket.connect();
    }

    if (action.type === "socket/disconnect" && socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }

    return next(action);
  };

export const getSocket = () => socket;
