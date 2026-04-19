import sys
sys.path.append('.')
from app.database.database import SessionLocal
from app.models.transaction import Transaction
import traceback

try:
    db = SessionLocal()
    transactions = db.query(Transaction).all()
    print("SUCCESS")
    print(transactions)
except Exception as e:
    traceback.print_exc()
