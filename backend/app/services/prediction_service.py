from sklearn.linear_model import LinearRegression
import numpy as np
from app.database.database import SessionLocal
from app.models.transaction import Transaction


def predict_spending(user_id: int):

    db = SessionLocal()
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    category_data = {}

    for t in transactions:
        if t.category not in category_data:
            category_data[t.category] = []

        category_data[t.category].append(t.amount)

    predictions = {}

    for category, amounts in category_data.items():

        X = np.array(range(len(amounts))).reshape(-1, 1)
        y = np.array(amounts)

        if len(amounts) < 2:
            predictions[category] = sum(amounts)
            continue

        model = LinearRegression()
        model.fit(X, y)

        next_month = model.predict([[len(amounts)]])[0]

        predictions[category] = round(float(next_month), 2)

    return predictions