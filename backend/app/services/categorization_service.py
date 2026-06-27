from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Training dataset grouped by category for easy maintenance and 100% list-length alignment
training_data = {
    "Food": [
        "pizza", "burger", "restaurant", "lunch", "coffee", "cafe", "zomato", "swiggy", "grocery", "food",
        "starbucks", "mcdonalds", "kfc", "subway", "dinner", "breakfast", "groceries", "supermarket",
        "tea", "chai", "bakery", "deli", "pub", "bar", "food delivery", "dominos", "pizza hut",
        "dunkin", "blinkit", "instamart", "zepto", "organic", "fruits", "vegetables", "milk", "bread",
        "snack", "candy", "chocolate", "soda", "coke", "drink", "dining", "eats", "eatery"
    ],
    "Travel": [
        "uber", "taxi", "bus ticket", "train ticket", "flight", "petrol", "gas", "ola", "metro",
        "cab", "auto", "rapido", "irctc", "indigo", "gasoline", "diesel", "parking", "toll", "airline",
        "commute", "train", "bus", "railway", "ticket", "subway ride", "locomotive", "airplane",
        "car rental", "hertz", "avis", "zoomcar", "indrive", "rideshare", "roadtrip", "fuel", "gas station",
        "filling station", "shell", "bp", "chevron", "expressway", "highway", "commuter"
    ],
    "Shopping": [
        "amazon order", "shopping mall", "clothes", "flipkart", "myntra", "cloths", "shoes", "electronics",
        "superdry", "zara", "hm", "nike", "adidas", "shopping", "gift", "watch", "perfume", "makeup",
        "laptop", "phone", "gadget", "appliances", "department store", "boutique", "fashion", "jeans",
        "t-shirt", "jacket", "sneakers", "boots", "accessories", "jewelry", "bag", "handbag", "purse",
        "target", "walmart", "best buy", "apple store", "hardware", "furniture", "ikea", "decor"
    ],
    "Entertainment": [
        "movie ticket", "netflix subscription", "spotify", "prime video", "cinema", "concert", "gaming",
        "steam", "ps5", "xbox", "theatre", "club", "party", "drinks", "show", "bookmyshow",
        "hotstar", "youtube premium", "ticketnew", "pvr", "inox", "amc", "imax", "museum", "art gallery",
        "theme park", "amusement park", "zoo", "aquarium", "bowling", "arcade", "karaoke", "festival",
        "gig", "play", "nintendo", "twitch", "subscription", "audible", "kindle", "audiobook"
    ]
}

descriptions = []
categories = []
for category, items in training_data.items():
    for item in items:
        descriptions.append(item)
        categories.append(category)

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