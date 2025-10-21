from typing import TypedDict


class CardReturnData(TypedDict):
    type: str
    card_id: int
    position: tuple[float, float]
    angle: float
    timestamp: int
