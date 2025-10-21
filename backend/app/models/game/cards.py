from typing import TYPE_CHECKING

from app.models.core.Card import Card
from app.models.core.Player import Player

if TYPE_CHECKING:
    from app.models.game.state import GameState


class CardManager:
    def __init__(self, game_state: "GameState"):
        self.game = game_state

    def draw_card(self, sid: str):
        player = self.game.players.get(sid)
        if not player:
            return

        deck_card = self.game.deck.draw_card()
        card = Card(deck_card["id"], deck_card["name"], sid, player.cards)
        player.cards += 1
        self.game.cards[card.id] = card

    def return_card_to_player(self, sid: str, card_id: int):
        player = self.game.players.get(sid)
        if not player:
            return

        stack_card = self.game.stack.remove_card(card_id)
        if not stack_card:
            return

        local_pos = self.game.geometry.to_local_space(
            stack_card["pos"], player.pos, player.angle
        )
        card = Card(
            stack_card["id"],
            stack_card["name"],
            sid,
            player.cards,
            source="stack",
            source_origin=local_pos,
        )
        player.cards += 1
        self.game.cards[card.id] = card

    def play_card(
        self, sid: str, card: "Card", world_pos: tuple[float, float], player: Player
    ):
        self.game.stack.add_card(
            {
                "id": card.id,
                "name": card.name,
                "pos": world_pos,
                "angle": card.offset_angle,
                "last_owner": sid,
            }
        )

        # Shift other cards in the hand
        for key, c in self.game.cards.items():
            if c.owner_id == sid and c.hand_index > card.hand_index:
                c.hand_index -= 1

        # Remove card from player
        del self.game.cards[card.id]
        player.cards -= 1

    def shuffle(self):
        self.game.deck.shuffle()

    def return_stack_cards(self):
        self.game.deck.refill()
