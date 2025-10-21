from dataclasses import dataclass
from typing import Literal, Tuple, TypedDict

table_width = 1
table_height = 1


class CardData(TypedDict):
    id: int
    name: str
    owner_id: str
    hand_index: int
    offset_pos: Tuple[float, float]
    offset_angle: float
    shown: bool
    hovered: bool
    dragging: bool
    source: Literal["deck", "stack"]
    source_origin: Tuple[float, float]


@dataclass(slots=True)
class Card:
    id: int
    name: str
    owner_id: str
    hand_index: int
    offset: Tuple[float, float] = (0.0, 0.0)
    offset_angle: float = 0
    shown: bool = False
    hovered: bool = False
    dragging: bool = False

    source: Literal["deck", "stack"] = "deck"
    source_origin: Tuple[float, float] = (0.0, 0.0)

    def update(
        self,
        new_offset: Tuple[float, float],  # relative position
        new_angle: float,
        dragging: bool,
        shown: bool,
    ):
        self.offset = new_offset
        self.offset_angle = new_angle
        self.dragging = dragging
        self.shown = shown

    def get_data(self, full: bool = True) -> CardData:
        if full:
            return {
                "id": self.id,
                "name": self.name,
                "owner_id": self.owner_id,
                "offset_pos": self.offset,
                "offset_angle": self.offset_angle,
                "shown": self.shown,
                "hovered": self.hovered,
                "hand_index": self.hand_index,
                "dragging": self.dragging,
                "source": self.source,
                "source_origin": self.source_origin,
            }
        else:
            return {
                "id": self.id,
                "name": self.name if self.shown else "back",
                "owner_id": self.owner_id,
                "offset_pos": self.offset,
                "offset_angle": self.offset_angle,
                "shown": self.shown,
                "hovered": self.hovered,
                "hand_index": self.hand_index,
                "dragging": self.dragging,
                "source": self.source,
                "source_origin": self.source_origin,
            }
