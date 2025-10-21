import { createAction } from "@reduxjs/toolkit";

export const joinGame = createAction("socket/joinGame");
export const drawCard = createAction("socket/drawCard");
export const playCard = createAction<{ card_id: number }>("socket/playCard");
export const returnCard = createAction<{ card_id: number }>(
  "socket/returnCard"
);

export const cardHover = createAction<{
  card_id: number;
  hovering: boolean;
}>("socket/cardHover");

export const dragMove = createAction<{
  card_id: number;
  position: [number, number];
  angle: number;
}>("socket/dragMove");
export const dragEnd = createAction<{
  card_id: number;
  position: [number, number];
  angle: number;
}>("socket/dragEnd");
