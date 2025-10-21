import { createAction } from "@reduxjs/toolkit";

export const connectSocket = createAction("socket/connect");
export const disconnectSocket = createAction("socket/disconnect");
export const socketError = createAction<string>("socket/error");
export const socketConnected = createAction("socket/connected");
export const socketDisconnected = createAction("socket/disconnected");
