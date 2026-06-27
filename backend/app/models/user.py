from sqlalchemy import Column, Integer, String
from app.database.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)
    name = Column(String, nullable=True)
    status = Column(String, nullable=True)
    financial_range = Column(String, nullable=True)
    currency = Column(String, default="INR", nullable=True)