from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from controllers.settings import SettingsDB
from views.monitor import monitor_router
from views.settings import settings_router
from services.scheduler import scheduler_controller
import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(monitor_router)
app.include_router(settings_router)

SettingsDB().init_settings()

scheduler_controller.start()
