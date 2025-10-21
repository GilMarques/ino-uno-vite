import random
from typing import TYPE_CHECKING

from app.models.core.Card import Card
from app.models.core.Player import Player

if TYPE_CHECKING:
    from app.models.game.state import GameState


class PlayerManager:
    def __init__(self, game_state: "GameState"):
        self.game = game_state

    def add_spectator(self, sid: str):
        self.game.spectators.append(sid)

    def remove_spectator(self, sid: str):
        if sid in self.game.spectators:
            self.game.spectators.remove(sid)

    def player_join(self, sid: str):
        if len(self.game.players) >= self.game.max_players:
            return

        if sid in self.game.spectators:
            self.game.spectators.remove(sid)

        deck_cards = self.game.deck.draw_multiple(7)
        cards = [Card(dc["id"], dc["name"], sid, i) for i, dc in enumerate(deck_cards)]
        player = Player(sid, seat=random.randint(0, 3), cards=7)

        self.game.players[sid] = player
        self.game.cards.update({card.id: card for card in cards})

    def player_leave(self, sid: str):
        cards = [c for c in self.game.cards.values() if c.owner_id == sid]
        for c in cards:
            del self.game.cards[c.id]

        self.game.deck.return_cards([{"id": c.id, "name": c.name} for c in cards])
        self.game.players.pop(sid, None)
        return cards
