from enum import Enum
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.models.game.state import GameState


class GameAction(Enum):
    DRAW_CARD = "draw_card"
    RETURN_CARD = "return_card"
    CARD_HOVER = "card_hover"
    CARD_DRAG_MOVE = "card_drag_move"
    CARD_DRAG_END = "card_drag_end"


class ActionProcessor:
    def __init__(self, game_state: "GameState"):
        self.game = game_state

    def queue_action(self, sid: str, action_type: GameAction, data):
        self.game.action_queue[sid].append((action_type, data))

    async def process(self):
        async with self.game.lock:
            for sid, actions in list(self.game.action_queue.items()):
                while actions:
                    action_type, data = actions.popleft()
                    await self._handle(sid, action_type, data)
            self.game.action_queue.clear()

    async def _handle(self, sid, action_type: GameAction, data: Any):
        if action_type == GameAction.DRAW_CARD:
            self.game.card_mgr.draw_card(sid)
        elif action_type == GameAction.RETURN_CARD:
            self.game.card_mgr.return_card_to_player(sid, data["card_id"])
        elif action_type == GameAction.CARD_DRAG_MOVE:
            self.game.interactions.drag_move(sid, data)
        elif action_type == GameAction.CARD_DRAG_END:
            self.game.interactions.drag_end(sid, data)
        elif action_type == GameAction.CARD_HOVER:
            self.game.interactions.hover_update(sid, data)
