from typing import Optional, Union, List

from fastapi import Depends, APIRouter
from pydantic import BaseModel

from backend.controllers.monitor import MonitorController, MonitorData

monitor_router = APIRouter()


class MonitorResponse(BaseModel):
    status: bool
    response: Optional[str] = ''
    data: Optional[Union[dict, List[dict]]] = []


def get_monitor_controller():
    return MonitorController()


@monitor_router.post("/monitor/create", response_model=MonitorResponse)
async def create_monitor(monitor_data: MonitorData, monitor_controller: MonitorController = Depends(get_monitor_controller)) -> MonitorResponse:
    created_status, created_monitor = await monitor_controller.add_monitor(monitor_data)
    return MonitorResponse(status=created_status, data=created_monitor)


@monitor_router.delete("/monitor/remove/{monitor_id}", response_model=MonitorResponse)
async def remove_monitor(monitor_id: int, monitor_controller: MonitorController = Depends(get_monitor_controller)) -> MonitorResponse:
    remove_response, removed_monitor = monitor_controller.remove_monitor(monitor_id)
    return MonitorResponse(status=remove_response, data=removed_monitor)


@monitor_router.put("/monitor/update/{monitor_id}", response_model=MonitorResponse)
async def update_monitor(monitor_id: int, monitor_data: MonitorData,
                         monitor_controller: MonitorController = Depends(get_monitor_controller)) -> MonitorResponse:
    update_response, updated_monitor = await monitor_controller.update_monitor(monitor_id, monitor_data)
    return MonitorResponse(status=update_response, data=updated_monitor)


@monitor_router.get("/monitor", response_model=MonitorResponse)
async def get_all_monitors(monitor_controller: MonitorController = Depends(get_monitor_controller)) -> MonitorResponse:
    all_monitors = monitor_controller.get_all_monitors()
    return MonitorResponse(status=True, data=all_monitors)
