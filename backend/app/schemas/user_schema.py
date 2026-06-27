from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str
    name: str


class UserLogin(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    name: str
    email: str
    status: str | None = None
    financial_range: str | None = None
    currency: str | None = "INR"