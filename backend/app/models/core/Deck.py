import random
from typing import List, TypedDict

from app.models.core.Stack import Stack


class DeckCard(TypedDict):
    id: int
    name: str


class Deck:
    deck: List[DeckCard]
    stack: Stack
    colors: List[str] = ["red", "green", "blue", "yellow"]
    values: List[str] = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "plus2",
        "reverse",
        "block",
    ]

    def __init__(self, stack: Stack):
        self.deck: List[DeckCard] = []
        self.__create_deck()
        self.stack = stack

    def __len__(self):
        return len(self.deck)

    def __create_deck(self):
        # Add black cards
        self.deck.extend(
            [
                {"id": 1, "name": "black/plus4"},
                {"id": 2, "name": "black/plus4"},
                {"id": 3, "name": "black/plus4"},
                {"id": 4, "name": "black/plus4"},
                {"id": 5, "name": "black/changecolor"},
                {"id": 6, "name": "black/changecolor"},
                {"id": 7, "name": "black/changecolor"},
                {"id": 8, "name": "black/changecolor"},
            ]
        )

        # Add colored cards
        for k in range(2):
            for i, color in enumerate(self.colors):
                for j, value in enumerate(self.values):
                    self.deck.append(
                        {
                            "id": 9
                            + k * len(self.colors) * len(self.values)
                            + i * len(self.values)
                            + j,
                            "name": f"{color}/{value}",
                        }
                    )
        self.shuffle()

    def shuffle(self):
        for i in range(len(self.deck) - 1, 0, -1):
            j = random.randint(0, i)
            self.deck[i], self.deck[j] = self.deck[j], self.deck[i]

    def refill(self):
        cards_to_shuffle = self.stack.empty()
        cards_simple: list[DeckCard] = [
            {"id": card["id"], "name": card["name"]} for card in cards_to_shuffle
        ]
        self.deck.extend(cards_simple)
        self.shuffle()

    def draw_card(self) -> DeckCard:
        if len(self.deck) == 1:
            self.refill()
        return self.deck.pop()

    def draw_multiple(self, count: int) -> List[DeckCard]:
        drawn_cards = []
        for _ in range(count):
            card = self.draw_card()
            drawn_cards.append(card)
        return drawn_cards

    def return_cards(self, cards: List[DeckCard]):
        self.deck.extend(cards)
        self.shuffle()
