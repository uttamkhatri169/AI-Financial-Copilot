from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    user_id: Optional[int] = None
    amount: float
    category: str
    description: str
    payment_method: str