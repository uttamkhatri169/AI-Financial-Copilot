from app.database.database import SessionLocal
from app.models.transaction import Transaction


def chatbot_response(question: str):

    db = SessionLocal()
    transactions = db.query(Transaction).all()

    question = question.lower()

    if "food" in question:
        total = sum(t.amount for t in transactions if t.category.lower() == "food")
        return f"You spent ₹{total} on food."

    if "travel" in question:
        total = sum(t.amount for t in transactions if t.category.lower() == "travel")
        return f"You spent ₹{total} on travel."

    if "shopping" in question:
        total = sum(t.amount for t in transactions if t.category.lower() == "shopping")
        return f"You spent ₹{total} on shopping."

    if "highest" in question:
        category_totals = {}

        for t in transactions:
            if t.category not in category_totals:
                category_totals[t.category] = 0

            category_totals[t.category] += t.amount

        highest = max(category_totals, key=category_totals.get)

        return f"Your highest spending category is {highest}."

    return "Sorry, I couldn't understand the question."