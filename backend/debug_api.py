import sys
sys.path.append('.')
import traceback
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

try:
    response = client.get("/transactions")
    print("GET /transactions Status Code:", response.status_code)
    try:
        print(response.json())
    except:
        print(response.text)
        
    response2 = client.post("/transactions", json={
        "user_id": 1, 
        "amount": 5.0,
        "category": "Food",
        "description": "Test",
        "payment_method": "UPI"
    })
    print("POST /transactions Status Code:", response2.status_code)
    try:
        print(response2.json())
    except:
        print(response2.text)

except Exception as e:
    traceback.print_exc()
