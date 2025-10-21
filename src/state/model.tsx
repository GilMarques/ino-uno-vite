export type Player = {
  sid: string;
  seat: number;
  hand: string[];
};

export type CardState = {
  id: number;
  name: string;
  owner_id: string;
  hand_index: number;
  offset_pos: [number, number];
  offset_angle: number;
  shown: boolean;
  hovered: boolean;
  dragging: boolean;
  source: "deck" | "stack";
  source_origin?: [number, number];
};

export type StackCard = {
  id: number;
  name: string;
  ownerId: string | null;
  pos: [number, number];
  angle: number;
};

export type GameStateUpdate = {
  players: Record<Player["sid"], Player>;
  cards: Record<CardState["id"], CardState>;
  stack: StackCard[];
  spectators: number;
  deck_size: number;
  seat: number; // -1 if spectator
  maxPlayers: number;
  sid: string;
  on_table: boolean;
};

export type GameState = {
  sid: string | null;
  players: Record<Player["sid"], Player>;
  cards: Record<CardState["id"], CardState>;
  stack: StackCard[]; //needs order
  deckSize: number;
  spectators: number;
  onTable: boolean;
  seat: number;
};
