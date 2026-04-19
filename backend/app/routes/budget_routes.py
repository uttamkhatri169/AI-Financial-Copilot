from fastapi import APIRouter, Depends
from app.services.budget_service import recommend_budgets
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/recommend-budgets")
def get_budget_recommendations(user_id: int = Depends(get_current_user)):
    result = recommend_budgets(user_id)
    return result