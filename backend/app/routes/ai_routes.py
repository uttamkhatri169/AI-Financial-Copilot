from fastapi import APIRouter
from app.services.categorization_service import predict_category

router = APIRouter()

@router.get("/predict-category")
def get_category(description: str):
    category = predict_category(description)
    return {"category": category}