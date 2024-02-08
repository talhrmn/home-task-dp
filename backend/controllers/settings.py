from dataclasses import dataclass

from backend.controllers.db_controller import DBController
from backend.models.settings import SettingsObj


@dataclass
class SettingsData:
    time_interval: int
    valid_threshold: int
    danger_threshold: int


def format_response(settings_obj: SettingsObj) -> dict:
    if settings_obj:
        return {
            "time_interval": settings_obj.time_interval,
            "valid_threshold": settings_obj.valid_threshold,
            "danger_threshold": settings_obj.danger_threshold,
        }
    return {}


class SettingsController(DBController):

    def init_settings(self):
        try:
            settings = self.get_settings()
            if not settings:
                return self.add_settings(
                    SettingsData(time_interval=10, valid_threshold=150, danger_threshold=300)
                )
        except Exception as e:
            return None

    def get_settings(self) -> dict:
        try:
            with self.get_session() as session:
                settings = session.query(SettingsObj).first()
                return format_response(settings)
        except Exception as e:
            return None

    def add_settings(self, settings_data: SettingsData) -> bool:
        try:
            with self.get_session() as session:
                new_settings_obj = SettingsObj(**settings_data.__dict__)
                session.add(new_settings_obj)
                return True
        except Exception as e:
            return False

    def update_settings(self, settings_data: SettingsData) -> bool:
        try:
            with self.get_session() as session:
                settings_to_update = session.query(SettingsObj).first()
                if settings_to_update:
                    for field, value in settings_data.__dict__.items():
                        setattr(settings_to_update, field, value)

                    return True
        except Exception as e:
            return False
