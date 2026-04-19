from fastapi import APIRouter, Depends
from app.services.anomaly_service import detect_anomalies
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/detect-anomalies")
def get_anomalies(user_id: int = Depends(get_current_user)):
    result = detect_anomalies(user_id)
    return result