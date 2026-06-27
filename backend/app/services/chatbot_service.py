from app.database.database import SessionLocal
from app.models.transaction import Transaction

def chatbot_response(question: str, user_id: int):

    db = SessionLocal()
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    question = question.lower()

    # Check for budget questions
    if "budget" in question:
        category = None
        if "food" in question:
            category = "Food"
        elif "travel" in question:
            category = "Travel"
        elif "shopping" in question:
            category = "Shopping"
        elif "entertainment" in question:
            category = "Entertainment"
        
        if category:
            category_transactions = [t for t in transactions if t.category.lower() == category.lower()]
            if not category_transactions:
                return f"You don't have any transactions in {category} yet, so I recommend a default budget of ₹2,000 for next month."
            
            total = sum(t.amount for t in category_transactions)
            avg = total / len(category_transactions)
            recommended = round(avg * 1.2, 2)
            return f"Based on your spending patterns, your recommended {category} budget for next month is ₹{recommended}."
        else:
            return "Please specify a category (Food, Travel, Shopping, or Entertainment) to check your budget."

    if "food" in question:
        total = sum(t.amount for t in transactions if t.category.lower() == "food")
        return f"You spent ₹{total} on food."

    if "travel" in question:
        total = sum(t.amount for t in transactions if t.category.lower() == "travel")
        return f"You spent ₹{total} on travel."

    if "shopping" in question:
        total = sum(t.amount for t in transactions if t.category.lower() == "shopping")
        return f"You spent ₹{total} on shopping."

    if "entertainment" in question:
        total = sum(t.amount for t in transactions if t.category.lower() == "entertainment")
        return f"You spent ₹{total} on entertainment."

    if "highest" in question:
        if not transactions:
            return "You don't have any transactions recorded yet."
            
        category_totals = {}
        for t in transactions:
            if t.category not in category_totals:
                category_totals[t.category] = 0
            category_totals[t.category] += t.amount

        if not category_totals:
            return "You don't have any transactions recorded yet."

        highest = max(category_totals, key=category_totals.get)
        return f"Your highest spending category is {highest}."

    return "Sorry, I couldn't understand the question."