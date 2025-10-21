import type { Middleware } from "@reduxjs/toolkit";
import { throttle } from "lodash";
import type { Socket } from "socket.io-client";
import { getSocket } from "../socket/socketMiddleware";

const update_rate = 32;
const throttle_duration = 1000 / update_rate;

const clientEmitter = throttle(
  (eventName: string, data: any, socket: Socket) => {
    socket.emit(eventName, { ...data, timestamp: Date.now() });
  },
  throttle_duration,
  { leading: true, trailing: true }
);

export const gameMiddleware: Middleware = () => (next) => (action: any) => {
  const socket = getSocket();

  if (!socket) return next(action);

  switch (action.type) {
    case "socket/joinGame":
      socket.emit(
        "join_game",
        { type: "join_game" },
        (res: { sid: string; status: string; message: string }) => {
          action.asyncDispatch?.({ type: "game/setSid", payload: res.sid });
        }
      );
      break;
    case "socket/drawCard":
      clientEmitter("draw_card", { type: "draw_card" }, socket);
      break;
    case "socket/playCard":
      clientEmitter("play_card", action.payload, socket);
      break;
    case "socket/returnCard":
      clientEmitter("return_card", action.payload, socket);
      break;
    case "socket/dragStart":
      clientEmitter("card_drag_start", action.payload, socket);
      break;
    case "socket/dragMove":
      clientEmitter("card_drag_move", action.payload, socket);
      break;
    case "socket/dragEnd":
      clientEmitter("card_drag_end", action.payload, socket);
      break;
  }

  return next(action);
};
