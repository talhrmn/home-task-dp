from sqlalchemy import Column, Integer, String, Float

from models.base import Base


class MonitorObj(Base):
    __tablename__ = "Monitors"

    monitor_id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String, index=True)
    site_url = Column(String)
    latency = Column(Float, default=0.0)
