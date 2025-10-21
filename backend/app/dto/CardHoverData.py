from typing import TypedDict


class CardHoverData(TypedDict):
    type: str
    hovered: bool
    card_id: int
    position: tuple[float, float]
    angle: float
    timestamp: int
