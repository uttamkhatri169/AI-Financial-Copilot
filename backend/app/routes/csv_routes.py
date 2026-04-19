from fastapi import APIRouter, UploadFile, Depends
from app.services.csv_service import process_csv
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/upload-csv")
def upload_csv(file: UploadFile, user_id: int = Depends(get_current_user)):

    result = process_csv(file, user_id)

    return result