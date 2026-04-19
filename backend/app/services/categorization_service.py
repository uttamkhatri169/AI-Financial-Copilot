from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Training data
descriptions = [
    # Food
    "pizza", "burger", "restaurant", "lunch", "coffee", "cafe", "zomato", "swiggy", "grocery", "food",
    # Travel
    "uber", "taxi", "bus ticket", "train ticket", "flight", "petrol", "gas", "ola", "metro",
    # Shopping
    "amazon order", "shopping mall", "clothes", "flipkart", "myntra", "cloths", "shoes", "electronics",
    # Entertainment
    "movie ticket", "netflix subscription", "spotify", "prime video", "cinema", "concert", "gaming"
]

categories = [
    # Food
    "Food", "Food", "Food", "Food", "Food", "Food", "Food", "Food", "Food", "Food",
    # Travel
    "Travel", "Travel", "Travel", "Travel", "Travel", "Travel", "Travel", "Travel", "Travel",
    # Shopping
    "Shopping", "Shopping", "Shopping", "Shopping", "Shopping", "Shopping", "Shopping", "Shopping",
    # Entertainment
    "Entertainment", "Entertainment", "Entertainment", "Entertainment", "Entertainment", "Entertainment", "Entertainment"
]

# Train model
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(descriptions)

model = MultinomialNB()
model.fit(X, categories)


def predict_category(text: str):
    X_test = vectorizer.transform([text.lower()])
    if X_test.nnz == 0:
        return "Others"
    prediction = model.predict(X_test)
    return prediction[0]