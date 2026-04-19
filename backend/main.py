from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, transactions
from app.database.database import engine, Base
from app.models import transaction
from app.models import user
from app.routes import ai_routes
from app.routes import prediction_routes
from app.routes import anomaly_routes
from app.routes import budget_routes
from app.routes import chatbot_routes
from app.routes import auth_routes
from app.routes import csv_routes


app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(health.router)
app.include_router(transactions.router)
app.include_router(ai_routes.router)
app.include_router(prediction_routes.router)
app.include_router(anomaly_routes.router)
app.include_router(budget_routes.router)
app.include_router(chatbot_routes.router)
app.include_router(auth_routes.router)
app.include_router(csv_routes.router)
