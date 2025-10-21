import asyncio
from typing import Callable

from .state import GameState


class GameEngine:
    def __init__(self, state: GameState, tick_rate: float, broadcaster: Callable):
        self.state = state
        self.tick_rate = tick_rate
        self.broadcaster = broadcaster

        self._task: asyncio.Task | None = None
        self._running = False

    async def tick(self):
        await self.state.actions.process()
        if self.broadcaster:
            recipients = set(self.state.players.keys()) | set(self.state.spectators)
            for sid in recipients:
                snapshot = self.state.snapshot.build(sid)
                await self.broadcaster(sid, snapshot)

    async def _run_loop(self):
        while self._running:
            await self.tick()
            await asyncio.sleep(1 / self.tick_rate)

    def start(self):
        """Start the game loop as an asyncio task."""
        if not self._running:
            self._running = True
            self._task = asyncio.create_task(self._run_loop())

    def stop(self):
        """Stop the game loop."""
        self._running = False
        if self._task:
            self._task.cancel()
            self._task = None
