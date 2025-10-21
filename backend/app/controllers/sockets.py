import socketio
from app.dto import (
    CardDragEndData,
    CardDragMoveData,
    CardDrawData,
    CardHoverData,
    CardReturnData,
)
from app.models.game.actions import GameAction
from app.models.game.engine import GameEngine
from app.models.game.state import GameState

sio_server = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:5173"],
)

sio_app = socketio.ASGIApp(socketio_server=sio_server, socketio_path="sockets")


# TODO: Ask for shuffle
# @sio_server.event
# async def shuffle(sid, data):
#     pass


@sio_server.event
async def connect(sid, environ):
    state.player_mgr.add_spectator(sid)
    return {
        "status": "ok",
        "sid": sid,
    }


@sio_server.event
async def join_game(sid, data):
    print(f"Player joining game: {sid}")
    state.player_mgr.player_join(sid)

    return {
        "status": "ok",
        "sid": sid,
        "message": "Joined game successfully",
    }


@sio_server.event
async def disconnect(sid):
    state.player_mgr.player_leave(sid)
    print(f"Client disconnected: {sid}")


@sio_server.event
async def card_hover(sid, data: CardHoverData):
    state.actions.queue_action(sid, GameAction.CARD_HOVER, data)


@sio_server.event
async def card_drag_move(sid, data: CardDragMoveData):
    state.actions.queue_action(sid, GameAction.CARD_DRAG_MOVE, data)


@sio_server.event
async def card_drag_end(sid, data: CardDragEndData):
    state.actions.queue_action(sid, GameAction.CARD_DRAG_END, data)
    pass


@sio_server.event
async def draw_card(sid, data: CardDrawData):
    state.actions.queue_action(sid, GameAction.DRAW_CARD, data)


@sio_server.event
async def return_card(sid, data: CardReturnData):
    state.actions.queue_action(sid, GameAction.RETURN_CARD, data)


async def broadcaster(sid, snapshot):
    await sio_server.emit("game_state", snapshot, to=sid)


state = GameState()
engine = GameEngine(state, tick_rate=32, broadcaster=broadcaster)


def start_game_loop():
    engine.start()
