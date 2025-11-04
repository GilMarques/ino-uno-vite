import os
from contextlib import asynccontextmanager

import uvicorn
from app.controllers.sockets import sio_app, start_game_loop
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_game_loop()
    yield


app = FastAPI(lifespan=lifespan)
app.mount("/", app=sio_app)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
