import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { GameState, GameStateUpdate } from "../model";

const initialState: GameState = {
  sid: null,
  players: {},
  cards: {},
  stack: [],
  deckSize: 0,
  spectators: 0,
  seat: -1,
  onTable: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setState(state, action: PayloadAction<GameStateUpdate>) {
      const newState = action.payload;
      state.players = newState.players;
      state.cards = newState.cards;
      state.stack = newState.stack;
      state.deckSize = newState.deck_size;
      state.spectators = newState.spectators;
      state.seat = newState.seat;
      state.sid = newState.sid;
      state.onTable = newState.on_table;
    },
    setSid(state, action: PayloadAction<string>) {
      state.sid = action.payload;
    },
  },
});

export const { setState, setSid } = gameSlice.actions;
export default gameSlice.reducer;
