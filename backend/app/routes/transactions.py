from fastapi import APIRouter, Depends
from app.schemas.transaction_schema import TransactionCreate
from app.database.database import SessionLocal
from app.models.transaction import Transaction
from datetime import date
from app.services.auth_service import get_current_user

router = APIRouter()


@router.post("/transactions")
def add_transaction(transaction: TransactionCreate, user_id: int = Depends(get_current_user)):

    db = SessionLocal()

    new_transaction = Transaction(
        user_id=user_id,
        amount=transaction.amount,
        category=transaction.category,
        description=transaction.description,
        date=date.today(),
        payment_method=transaction.payment_method
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return {"message": "Transaction added successfully"}


@router.get("/transactions")
def get_transactions(user_id: int = Depends(get_current_user)):

    db = SessionLocal()

    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    return [{
        "id": t.id,
        "user_id": t.user_id,
        "amount": t.amount,
        "category": t.category,
        "description": t.description,
        "date": str(t.date) if t.date else None,
        "payment_method": t.payment_method
    } for t in transactions]


@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, user_id: int = Depends(get_current_user)):

    db = SessionLocal()

    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == user_id).first()

    if transaction is None:
        return {"error": "Transaction not found"}

    db.delete(transaction)
    db.commit()

    return {"message": "Transaction deleted successfully"}