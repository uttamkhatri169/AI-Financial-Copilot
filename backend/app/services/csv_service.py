import pandas as pd
from app.database.database import SessionLocal
from app.models.transaction import Transaction


def process_csv(file, user_id: int):

    df = pd.read_csv(file.file)

    db = SessionLocal()

    for _, row in df.iterrows():

        transaction = Transaction(
            user_id=user_id,
            amount=row["amount"],
            category=row["category"],
            description=row["description"],
            payment_method="Bank"
        )

        db.add(transaction)

    db.commit()

    return {"message": "CSV transactions imported"}