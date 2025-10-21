import { configureStore } from "@reduxjs/toolkit";
import { gameMiddleware } from "./game/gameMiddleware";
import gameReducer from "./game/gameSlice";
import { socketMiddleware } from "./socket/socketMiddleware";
import socketReducer from "./socket/socketSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    socket: socketReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(socketMiddleware, gameMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
