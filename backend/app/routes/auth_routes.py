from fastapi import APIRouter
from app.schemas.user_schema import UserCreate, UserLogin
from app.services.auth_service import hash_password, verify_password, create_token
from app.database.database import SessionLocal
from app.models.user import User

router = APIRouter()


@router.post("/signup")
def signup(user: UserCreate):

    db = SessionLocal()

    hashed = hash_password(user.password)

    new_user = User(
        email=user.email,
        password=hashed
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

    return {"token": token}