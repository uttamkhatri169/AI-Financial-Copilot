from sklearn.ensemble import IsolationForest
import numpy as np
from app.database.database import SessionLocal
from app.models.transaction import Transaction


def detect_anomalies(user_id: int):

    db = SessionLocal()
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    if not transactions:
        return []

    amounts = np.array([t.amount for t in transactions]).reshape(-1, 1)

    model = IsolationForest(contamination=0.1)

    model.fit(amounts)

    predictions = model.predict(amounts)

    anomalies = []

    for i, pred in enumerate(predictions):

        if pred == -1:
            anomalies.append({
                "id": transactions[i].id,
                "amount": transactions[i].amount,
                "category": transactions[i].category,
                "description": transactions[i].description
            })

    return anomalies