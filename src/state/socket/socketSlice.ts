import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type SocketState = {
  connected: boolean;
  error: string | null;
};

const initialState: SocketState = {
  connected: false,
  error: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connected(state) {
      state.connected = true;
      state.error = null;
    },
    disconnected(state) {
      state.connected = false;
    },
    error(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { connected, disconnected, error } = socketSlice.actions;
export default socketSlice.reducer;
