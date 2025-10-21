from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.game.state import GameState


class SnapshotBuilder:
    def __init__(self, game_state: "GameState"):
        self.game = game_state

    def build(self, sid: str):
        player = self.game.players.get(sid)
        seat = player.seat if player else -1
        return {
            "players": {pid: p.to_dict() for pid, p in self.game.players.items()},
            "cards": {
                cid: c.get_data(sid == c.owner_id) for cid, c in self.game.cards.items()
            },
            "deck_size": len(self.game.deck),
            "stack": self.game.stack.get_stack(),
            "spectators": len(self.game.spectators),
            "seat": seat,
            "max_players": self.game.max_players,
            "sid": sid,
            "on_table": sid in self.game.players,
        }
