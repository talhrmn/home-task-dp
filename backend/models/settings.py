from sqlalchemy import Column, Integer

from models.base import Base


class SettingsObj(Base):
    __tablename__ = "Settings"

    settings_id = Column(Integer, primary_key=True, index=True)
    time_interval = Column(Integer, index=True)
    valid_threshold = Column(Integer)
    warning_threshold = Column(Integer)
    danger_threshold = Column(Integer)
