from fastapi import APIRouter, Depends
from app.services.chatbot_service import chatbot_response
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/chatbot")
def ask_chatbot(question: str, user_id: int = Depends(get_current_user)):
    response = chatbot_response(question, user_id)
    return {"answer": response}