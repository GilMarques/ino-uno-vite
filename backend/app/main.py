import uvicorn
from app.controllers.sockets import sio_app, start_game_loop
from fastapi import FastAPI

app = FastAPI()


app.mount("/", app=sio_app)


@app.get("/")
async def home():
    return {"message": "Hello, World!"}


@app.on_event("startup")
async def startup_event():
    # Start the game loop when FastAPI starts
    start_game_loop()


if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=True)
