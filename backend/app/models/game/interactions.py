from typing import TYPE_CHECKING, TypedDict

from app.models.core.FanCoordinates import build_coords_cache

coords_cache = build_coords_cache()


if TYPE_CHECKING:
    from app.models.game.state import GameState


class DragMoveData(TypedDict):
    card_id: int
    position: tuple[float, float]
    angle: float


class DragEndData(TypedDict):
    card_id: int
    position: tuple[float, float]
    angle: float


class CardInteractionManager:
    def __init__(self, game_state: "GameState"):
        self.game = game_state

    def drag_move(self, sid: str, data: DragMoveData):
        player = self.game.players.get(sid)
        if not player:
            return
        card = self.game.cards.get(data["card_id"])
        if not card or card.owner_id != sid:
            return
        index = card.hand_index
        pos = (
            data["position"][0],
            data["position"][1],
        )

        card_show = False

        if pos[1] + coords_cache[player.cards][index].y / 200 >= 0.3:
            card_show = True

        card.update(data["position"], data["angle"], True, card_show)

    def drag_end(self, sid: str, data: DragEndData):
        player = self.game.players.get(sid)
        if not player:
            return
        card = self.game.cards.get(data["card_id"])
        if not card or card.owner_id != sid:
            return
        local_pos = (
            card.offset[0] + coords_cache[player.cards][card.hand_index].x / 200,
            card.offset[1] + coords_cache[player.cards][card.hand_index].y / 200,
        )
        world_pos = self.game.geometry.to_world_space(
            local_pos, player.pos, player.angle
        )
        print("local_pos:", local_pos)
        print("player.pos:", player.pos)
        print("player.angle:", player.angle)
        print("world_pos:", world_pos)
        if -1 <= world_pos[0] <= 1 and -1 <= world_pos[1] <= 1:
            self.game.card_mgr.play_card(sid, card, world_pos, player)
        else:
            card.update((0, 0), 0, False, False)

    def hover_update(self, sid, data):
        player = self.game.players.get(sid)
        if not player:
            return
        card = self.game.cards.get(data["card_id"])
        if not card or card.owner_id != sid:
            return
        card.hovered = data["hovered"]
