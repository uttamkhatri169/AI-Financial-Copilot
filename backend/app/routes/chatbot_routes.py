from fastapi import APIRouter
from app.services.chatbot_service import chatbot_response

router = APIRouter()

@router.get("/chatbot")
def ask_chatbot(question: str):
    response = chatbot_response(question)
    return {"answer": response}