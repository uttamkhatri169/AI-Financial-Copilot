from app.database.database import SessionLocal
from app.models.transaction import Transaction


def recommend_budgets(user_id: int):

    db = SessionLocal()
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    category_totals = {}
    category_counts = {}

    for t in transactions:

        if t.category not in category_totals:
            category_totals[t.category] = 0
            category_counts[t.category] = 0

        category_totals[t.category] += t.amount
        category_counts[t.category] += 1

    recommendations = {}

    for category in category_totals:

        avg_spending = category_totals[category] / category_counts[category]

        recommended_budget = avg_spending * 1.2

        recommendations[category] = round(recommended_budget, 2)

    return recommendations