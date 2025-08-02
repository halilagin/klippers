from datetime import datetime, timedelta
import uuid
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session


from ....core.security import verify_password, get_password_hash, create_access_token
from ....db.database import get_db
from ....db.model_document import User
from ....schemas.schema_user import Token, User as UserSchema
from ....config import settings
from ....core.auth import get_current_active_user
from app.schemas import schema_user



import stripe
import os



stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


router = APIRouter(prefix="/auth")

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print("LOGIN: Starting login process...")
    print(f"LOGIN: Form data username: {form_data.username}")
    print(f"LOGIN: Form data password: {form_data.password}")

    user = db.query(User).filter(User.email == form_data.username).filter(User.is_active == True).first()
    print(form_data.username, form_data.password)
    print(user)
    print(form_data.password)
    # print(user.hashed_password)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "subscription_plan": user.subscription_plan, "email": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schema_user.User)
async def register(
    email: str = Body(...),
    name: str = Body(...),
    password: str = Body(...),
    subscription_plan: str = Body(...),
    db: Session = Depends(get_db)
):
    try:
        db_user = db.query(User).filter(User.email == email.strip()).first()
        if db_user:
            raise HTTPException(status_code=422, detail="Email already registered")

        hashed_password = get_password_hash(password)
        db_user = User(
            username=str(uuid.uuid4()),
            name=name,
            email=email,
            subscription_plan=subscription_plan,
            is_active=True,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.flush()
        db.commit()
        db_user.hashed_password = None
        schmea_user_instance = schema_user.User.model_validate(db_user)
        return schmea_user_instance
    except Exception as e:
        # Assuming 'e' is the exception object caught in an except block
        # First, check if the exception 'e' itself has a status_code of 422
        if hasattr(e, 'status_code') and e.status_code == 422:
            # If e has a 'detail' attribute (like HTTPException), use it, otherwise use str(e)
            detail_message = getattr(e, 'detail', str(e))
            raise HTTPException(status_code=422, detail=detail_message)
        raise HTTPException(status_code=500, detail=str(e))




@router.post("/update-subscription-id", response_model=schema_user.MessageResponse)
async def update_subscription_id(
    body: dict = Body(...),
    db: Session = Depends(get_db)
):
    try:
        email = body.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")

        customers = stripe.Customer.list(email=email, limit=1)

        if customers.data is None or len(customers.data) == 0:
            raise HTTPException(status_code=400, detail="Customer not found")

        customer = customers.data[0]

        db_user = db.query(User).filter(User.email == email.strip()).first()
        if not db_user:
            raise HTTPException(status_code=400, detail="User not found")

        # Get subscription ID from customer's subscriptions
        subscriptions = stripe.Subscription.list(customer=customer.id, limit=1)
        if subscriptions.data:
            db_user.subscription_id = subscriptions.data[0].id
        else:
            db_user.subscription_id = None
        db_user.subscription_updated_at = datetime.now()

        db.commit()
        return {"message": "User updated successfully"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user