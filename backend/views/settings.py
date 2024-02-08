from typing import Optional
from fastapi import Depends, APIRouter
from pydantic import BaseModel

from backend.controllers.settings import SettingsController, SettingsData
from backend.services.scheduler import scheduler_controller

settings_router = APIRouter()


class SettingsResponse(BaseModel):
    status: bool
    response: Optional[str] = ''
    data: dict = {}


def get_settings_controller():
    return SettingsController()


@settings_router.get("/settings", response_model=SettingsResponse)
async def create_settings(
        settings_controller: SettingsController = Depends(get_settings_controller)) -> SettingsResponse:
    settings = settings_controller.get_settings()
    return SettingsResponse(status=True, data=settings)


@settings_router.put("/settings", response_model=SettingsResponse)
async def update_settings(settings_data: SettingsData,
                          settings_controller: SettingsController = Depends(
                              get_settings_controller)) -> SettingsResponse:
    update_response = settings_controller.update_settings(settings_data)
    scheduler_controller.set_interval(settings_data.time_interval)
    return SettingsResponse(status=update_response)
