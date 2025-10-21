from typing import TypedDict


class StackCard(TypedDict):
    id: int
    name: str
    pos: tuple[float, float]
    angle: float
    last_owner: str


class Stack:
    _stack: list[StackCard]

    def get_stack(self) -> list[StackCard]:
        return self._stack

    def __init__(self):
        self._stack = []

    def remove_card(self, id: int) -> StackCard | None:
        for i, card in enumerate(self._stack):
            if card["id"] == id:
                return self._stack.pop(i)
        return None

    def empty(self) -> list[StackCard]:
        res = self._stack[:-1].copy()
        self._stack = [self._stack[-1]]
        return res

    def add_card(self, card: StackCard):
        self._stack.append(card)
