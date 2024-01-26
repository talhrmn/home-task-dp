from typing import Optional, Union, List

from fastapi import Depends, APIRouter
from pydantic import BaseModel

from controllers.settings import SettingsDB, SettingsData
from services.scheduler import scheduler_controller

settings_router = APIRouter()


class SettingsResponse(BaseModel):
    status: bool
    response: Optional[str] = ''
    data: dict = {}


def get_settings_db():
    return SettingsDB()


@settings_router.get("/settings", response_model=SettingsResponse)
async def create_settings(settings_db: SettingsDB = Depends(get_settings_db)) -> SettingsResponse:
    settings = settings_db.get_settings()
    return SettingsResponse(status=True, data=settings)


@settings_router.put("/settings", response_model=SettingsResponse)
async def update_settings(settings_data: SettingsData,
                         settings_db: SettingsDB = Depends(get_settings_db)) -> SettingsResponse:
    update_response = settings_db.update_settings(settings_data)
    scheduler_controller.set_interval(settings_data.time_interval)
    return SettingsResponse(status=update_response)
