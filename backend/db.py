from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import Base

DATABASE_URL = "sqlite:///data/app.db"

db_engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

Base.metadata.create_all(bind=db_engine)
