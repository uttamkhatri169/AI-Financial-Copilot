from fastapi import APIRouter, Depends
from app.schemas.user_schema import UserCreate, UserLogin, ProfileUpdate
from app.services.auth_service import hash_password, verify_password, create_token, get_current_user
from app.database.database import SessionLocal
from app.models.user import User

router = APIRouter()


@router.post("/signup")
def signup(user: UserCreate):

    db = SessionLocal()

    hashed = hash_password(user.password)

    new_user = User(
        email=user.email,
        password=hashed,
        name=user.name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created"}


@router.post("/login")
def login(user: UserLogin):

    db = SessionLocal()

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        return {"error": "User not found"}

    if not verify_password(user.password, db_user.password):
        return {"error": "Incorrect password"}

    token = create_token(db_user.id)

    return {
        "token": token,
        "name": db_user.name
    }


@router.get("/profile")
def get_profile(user_id: int = Depends(get_current_user)):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return {
        "name": user.name,
        "email": user.email,
        "status": user.status,
        "financial_range": user.financial_range,
        "currency": user.currency or "INR"
    }


@router.put("/profile")
def update_profile(profile: ProfileUpdate, user_id: int = Depends(get_current_user)):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    # Check if email is already taken by another user
    if profile.email != user.email:
        existing = db.query(User).filter(User.email == profile.email).first()
        if existing:
            return {"error": "Email is already in use"}

    user.name = profile.name
    user.email = profile.email
    user.status = profile.status
    user.financial_range = profile.financial_range
    user.currency = profile.currency
    db.commit()
    return {"message": "Profile updated successfully"}