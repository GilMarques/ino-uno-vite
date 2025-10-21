import asyncio
from collections import defaultdict, deque

from app.models.core.Card import Card
from app.models.core.Deck import Deck
from app.models.core.Player import Player
from app.models.core.Stack import Stack
from app.models.game.geometry import CoordinateHelper

from .actions import ActionProcessor
from .cards import CardManager
from .interactions import CardInteractionManager
from .players import PlayerManager
from .snapshot import SnapshotBuilder


class GameState:
    def __init__(self, max_players=4):
        self.players: dict[str, Player] = {}
        self.cards: dict[int, Card] = {}
        self.stack = Stack()
        self.deck = Deck(self.stack)
        self.spectators = []
        self.max_players = max_players

        self.lock = asyncio.Lock()
        self.action_queue = defaultdict(deque)

        # Managers
        self.player_mgr = PlayerManager(self)
        self.card_mgr = CardManager(self)
        self.interactions = CardInteractionManager(self)
        self.actions = ActionProcessor(self)
        self.snapshot = SnapshotBuilder(self)
        self.geometry = CoordinateHelper()
