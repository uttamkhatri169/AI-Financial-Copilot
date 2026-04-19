from fastapi import APIRouter, Depends
from app.services.prediction_service import predict_spending
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/predict-spending")
def get_prediction(user_id: int = Depends(get_current_user)):
    result = predict_spending(user_id)
    return result