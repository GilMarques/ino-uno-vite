import asyncio
import math
import random
from ast import Tuple
from collections import defaultdict, deque
from enum import Enum
from typing import Any, List, TypedDict, Union

from app.models.Card import Card, CardData
from app.models.Deck import Deck, DeckCard
from app.models.FanCoordinates import build_coords_cache
from app.models.Player import Player, PlayerData
from app.models.Stack import Stack, StackCard

coords_cache = build_coords_cache()


class GameStateSnapshot(TypedDict):
    players: dict[str, PlayerData]
    cards: dict[int, CardData]
    deck_size: int
    stack: list[StackCard]
    seat: int
    max_players: int
    spectators: int
    sid: str
    on_table: bool


class GameAction(Enum):
    DRAW_CARD = "draw_card"
    RETURN_CARD = "return_card"
    CARD_HOVER = "card_hover"
    CARD_DRAG_MOVE = "card_drag_move"
    CARD_DRAG_END = "card_drag_end"


class GameState:
    players: dict[str, Player]
    cards: dict[int, Card]
    deck: Deck
    stack: Stack
    spectators: List[str]
    max_players: int = 4

    lock: asyncio.Lock = asyncio.Lock()
    action_queue = defaultdict(deque)

    def __init__(self):
        self.players = {}
        self.cards = {}
        self.stack = Stack()
        self.deck = Deck(self.stack)
        self.spectators = []

    def __str__(self):
        return f"GameState(players={len(self.players)}, deck={len(self.deck)}, stack={len(self.stack._stack)}, spectators={self.spectators})"

    def queue_action(self, sid: str, action_type: GameAction, data: Any):
        self.action_queue[sid].append((action_type, data))

    async def process_queued_actions(self):
        async with self.lock:
            for sid, actions in list(self.action_queue.items()):
                while actions:
                    action_type, data = actions.popleft()
                    await self.handle_action(sid, action_type, data)
            self.action_queue.clear()

    async def handle_action(self, sid: str, action_type: GameAction, data: Any):
        if action_type == GameAction.DRAW_CARD:
            self.draw_card(sid)
        elif action_type == GameAction.RETURN_CARD:
            self.return_card_to_player(sid, data["card_id"])
        elif action_type == GameAction.CARD_DRAG_MOVE:
            self.card_drag_update(
                sid,
                data["card_id"],
                data["position"],
                data["angle"],
                True,
            )
        elif action_type == GameAction.CARD_DRAG_END:
            self.card_drag_end(
                sid,
                data["card_id"],
            )
        elif action_type == GameAction.CARD_HOVER:
            self.card_hover_update(
                sid,
                data["card_id"],
                data["hovered"],
            )
        return

    def draw_card(self, sid: str) -> None:
        player = self.players.get(sid)
        if not player:
            return

        deck_card = self.deck.draw_card()

        card = Card(deck_card["id"], deck_card["name"], sid, player.cards)
        player.cards += 1
        self.cards[card.id] = card

    def return_card_to_player(self, sid: str, card_id: int) -> None:
        player = self.players.get(sid)
        if not player:
            return

        stack_card = self.stack.remove_card(card_id)
        if not stack_card:
            return

        card = Card(
            stack_card["id"],
            stack_card["name"],
            sid,
            player.cards,
            source="stack",
            source_origin=self._to_local_space(
                stack_card["pos"], player.pos, player.angle
            ),
        )
        player.cards += 1

        self.cards[card.id] = card

    def return_stack_cards(self):
        self.deck.refill()

    def shuffle_deck(self):
        self.deck.shuffle()

    def add_spectator(self, sid: str):
        self.spectators.append(sid)

    def remove_spectator(self, sid: str):
        self.spectators.remove(sid)

    def player_join(self, sid: str):
        if len(self.players) >= self.max_players:
            return
        self.spectators.remove(sid)
        deck_cards = self.deck.draw_multiple(7)
        cards = [
            Card(deck_card["id"], deck_card["name"], sid, i)
            for i, deck_card in enumerate(deck_cards)
        ]

        player = Player(sid, seat=random.randint(0, 3), cards=7)
        self.players[sid] = player
        self.cards.update({card.id: card for card in cards})

    def player_leave(self, sid: str):
        return_cards = []

        to_remove = [
            card_id for card_id, card in self.cards.items() if card.owner_id == sid
        ]

        return_cards = [self.cards[card_id] for card_id in to_remove]

        for card_id in to_remove:
            del self.cards[card_id]

        deck_return_cards: List[DeckCard] = [
            {"id": card.id, "name": card.name} for card in return_cards
        ]
        self.deck.return_cards(deck_return_cards)

        if sid in self.players:
            del self.players[sid]

        return return_cards

    def _to_world_space(
        self,
        local_pos: tuple[float, float],
        player_pos: tuple[float, float],
        player_angle: float,
    ):
        x, y = local_pos
        px, py = player_pos
        cos_a = math.cos(player_angle)
        sin_a = math.sin(player_angle)

        # Rotate + translate
        world_x = px + (x * cos_a - y * sin_a)
        world_y = py + (x * sin_a + y * cos_a)

        return (world_x, world_y)

    def _to_local_space(
        self,
        world_pos: tuple[float, float],
        player_pos: tuple[float, float],
        player_angle: float,
    ):
        wx, wy = world_pos
        px, py = player_pos
        cos_a = math.cos(-player_angle)
        sin_a = math.sin(-player_angle)

        # Translate - rotate
        local_x = (wx - px) * cos_a - (wy - py) * sin_a
        local_y = (wx - px) * sin_a + (wy - py) * cos_a

        return (local_x, local_y)

    def _play_card(
        self, sid: str, card: Card, pos: tuple[float, float], player: Player
    ):
        self.stack.add_card(
            {
                "id": card.id,
                "name": card.name,
                "pos": self._to_world_space(pos, player.pos, player.angle),
                "angle": player.angle + card.offset_angle,
                "last_owner": sid,
            }
        )
        for key in self.cards:
            if (
                self.cards[key].owner_id == sid
                and self.cards[key].hand_index > card.hand_index
            ):
                self.cards[key].hand_index -= 1
        del self.cards[card.id]
        player.cards -= 1
        pass

    def card_drag_end(
        self,
        sid: str,
        card_id: int,
    ):
        player = self.players.get(sid)
        if not player:
            return

        card = self.cards.get(card_id)
        if not card or card.owner_id != sid:
            return

        local_pos = (
            card.offset[0],
            card.offset[1],
        )

        if -1 <= local_pos[0] <= 1 and -1 <= local_pos[1] - 2 <= 1:
            self._play_card(sid, card, local_pos, player)
        else:
            card.update(local_pos, (0, 0), 0, False)

    def card_drag_update(
        self,
        sid: str,
        card_id: int,
        new_offset: tuple[float, float],
        new_angle: float,
        dragging: bool,
    ):
        player = self.players.get(sid)
        if not player:
            return
        card = self.cards.get(card_id)
        if not card or card.owner_id != sid:
            return
        index = card.hand_index
        # TODO: Fix divide by 200
        pos = (
            player.pos[0] + coords_cache[player.cards][index].x / 200 + new_offset[0],
            player.pos[1] + coords_cache[player.cards][index].y / 200 + new_offset[1],
        )

        card.update(pos, new_offset, new_angle, dragging)

    def card_hover_update(
        self,
        sid: str,
        card_id: int,
        hovered: bool,
    ):
        player = self.players.get(sid)
        if not player:
            return
        card = self.cards.get(card_id)
        if not card or card.owner_id != sid:
            return
        card.hovered = hovered

    def get_snapshot(self, sid) -> GameStateSnapshot:
        player = self.players.get(sid)
        seat = -1
        if player:
            seat = player.seat
        snapshot: GameStateSnapshot = {
            "players": {pid: p.to_dict() for pid, p in self.players.items()},
            "cards": {
                card_id: card.get_data(sid == card.owner_id)
                for card_id, card in self.cards.items()
            },
            "deck_size": len(self.deck),
            "stack": self.stack.get_stack(),
            "spectators": len(self.spectators),
            "seat": seat,
            "max_players": self.max_players,
            "sid": sid,
            "on_table": sid in self.players,
        }

        return snapshot
