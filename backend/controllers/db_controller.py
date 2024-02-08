from sqlalchemy.util.compat import contextmanager

from backend.db import db_engine, SessionLocal


class DBController:
    def __init__(self):
        self.engine = db_engine

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
