from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from backend.controllers.settings import SettingsController
from backend.views.monitor import monitor_router
from backend.views.settings import settings_router
from backend.services.scheduler import scheduler_controller
import backend.db

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

SettingsController().init_settings()

scheduler_controller.start()
