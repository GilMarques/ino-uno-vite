import math
from typing import TypedDict

facing_angle = [0, math.pi / 2, math.pi, 3 * math.pi / 2]
positions = [
    (0, -2),
    (2, 0),
    (0, 2),
    (-2, 0),
]


class PlayerData(TypedDict):
    sid: str
    seat: int
    pos: tuple[float, float]
    angle: float
    cards: int


class Player:
    sid: str
    seat: int
    pos: tuple[float, float]
    angle: float
    cards: int

    def __init__(
        self,
        sid,
        seat,
        max_seats: int = 4,
        cards: int = 0,
    ):
        self.sid = sid
        self.seat = seat
        self.angle = facing_angle[seat % max_seats]
        self.pos = positions[seat % max_seats]
        self.cards = cards
        print(seat, self.angle)

    def to_dict(self) -> PlayerData:
        return {
            "sid": self.sid,
            "seat": self.seat,
            "pos": self.pos,
            "angle": self.angle,
            "cards": self.cards,
        }
