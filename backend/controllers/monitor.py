import time
from dataclasses import dataclass
from typing import List, Union, Tuple

import requests
from sqlalchemy.util.compat import contextmanager

from db import db_engine, SessionLocal
from models.monitor import MonitorObj


async def latency_check(site_url: str) -> Union[float, None]:
    try:
        start_time = time.time()
        site_response = requests.get(site_url)
        end_time = time.time()
        total_time = (end_time - start_time) * 1000
        return total_time if site_response.status_code == 200 else -1
    except Exception as e:
        return -1


@dataclass
class MonitorData:
    site_name: str
    site_url: str


def format_response(monitor_object: MonitorObj) -> dict:
    if monitor_object:
        return {
            "monitor_id": monitor_object.monitor_id,
            "site_name": monitor_object.site_name,
            "site_url": monitor_object.site_url,
            "latency": monitor_object.latency,
        }
    return {}


class MonitorController:
    def __init__(self):
        self.monitor_engine = db_engine

    @contextmanager
    def get_session(self):
        session = SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def get_monitor(self, monitor_id: int) -> Tuple[bool, Union[dict, None]]:
        with self.get_session() as session:
            monitor = session.query(MonitorObj).get(monitor_id)
            return bool(monitor), format_response(monitor)

    def get_all_monitors(self) -> List[dict]:
        with self.get_session() as session:
            all_monitors = session.query(MonitorObj).all()
            return [format_response(monitor) for monitor in all_monitors]

    async def add_monitor(self, monitor_data: MonitorData) -> Tuple[bool, dict]:
        try:
            with self.get_session() as session:
                site_latency = await latency_check(monitor_data.site_url)
                new_monitor_obj = MonitorObj(**monitor_data.__dict__, latency=site_latency)
                session.add(new_monitor_obj)
                session.commit()
                return True, format_response(new_monitor_obj)
        except Exception as e:
            return False, {}

    def remove_monitor(self, monitor_id: int) -> Tuple[bool, dict]:
        with self.get_session() as session:
            monitor_to_remove = session.query(MonitorObj).get(monitor_id)
            if monitor_to_remove:
                session.delete(monitor_to_remove)
                session.commit()
                return True, format_response(monitor_to_remove)
            return False, {}

    async def update_monitor(self, monitor_id: int, monitor_data: MonitorData) -> Tuple[bool, dict]:
        with self.get_session() as session:
            monitor_to_update = session.query(MonitorObj).get(monitor_id)
            if monitor_to_update:
                for field, value in monitor_data.__dict__.items():
                    setattr(monitor_to_update, field, value)
                site_latency = await latency_check(monitor_data.site_url)
                setattr(monitor_to_update, "latency", site_latency)
                session.commit()
                return True, format_response(monitor_to_update)
            return False, {}
