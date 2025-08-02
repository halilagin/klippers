from app.core.security import get_password_hash
from app.db.model_document import User
from app.schemas import schema_user
from app.schemas.schema_user import UserCreate
import stripe
import os
# from datetime import datetime
# import time

from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.database import get_db
from fastapi.responses import JSONResponse




# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


router = APIRouter(
    prefix="/subscription",
    tags=["subscription"],
    responses={404: {"description": "Not found"}},
)

def handle_pay_as_you_go(price, currency, product_id):
    """Handle one-time payment for pay-as-you-go plan"""
    intent = stripe.PaymentIntent.create(
        amount=os.getenv('STRIPE_PAY_AS_YOU_GO_PRICE'),
        currency=currency,
        metadata={
            'plan_id': product_id,
            'plan_type': 'one-time'
        }
    )
    return JSONResponse({
        'clientSecret': intent.client_secret
    })

def get_or_create_customer(email, name):
    """Get existing customer or create a new one"""
    customers = stripe.Customer.list(email=email, limit=1)
    if customers.data:
        return customers.data[0]
    else:
        return stripe.Customer.create(
            email=email,
            name=name
        )

def handle_monthly_payment(email, name, product_id):
    """Handle subscription payment for monthly plan"""
    customer = get_or_create_customer(email, name)

    prices = stripe.Price.list(
        product=product_id
    )

    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[
            {
                'price': prices.data[0].id,
            },
        ],
        payment_behavior='default_incomplete',
        expand=['latest_invoice.payment_intent'],
    )

    return JSONResponse({
        'clientSecret': subscription.latest_invoice.payment_intent.client_secret,
        'subscriptionId': subscription.id
    })

def handle_volume_based_payment(email, name, product_id):
    """Handle subscription payment for volume-based plan"""
    customer = get_or_create_customer(email, name)

    prices = stripe.Price.list(
        product=product_id
    )

    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[
            {
                'price': prices.data[0].id,
            },
        ],
        payment_settings={
            'payment_method_types': ['card'],
            'save_default_payment_method': 'on_subscription'
        },
        expand=['latest_invoice.payment_intent'],
        collection_method='charge_automatically'
    )

    return JSONResponse({
        'subscriptionId': subscription.id,
        # 'clientSecret': subscription.latest_invoice.payment_intent.client_secret,
        'status': subscription.status
    })










def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise Exception(detail="Email already registered")

        db_user = User(
            email=user.email,
            username=user.username,
            hashed_password=get_password_hash(user.password)
        )
        db.add(db_user)
        return schema_user.MessageResponse(message="User created successfully")
    except Exception as e:
        print(e)
        raise Exception(detail=str(e))




@router.post("/create-payment-intent",
             summary="Create payment intent",
             description="Create a payment intent for a given plan")
def create_payment_intent(planId: str = Body(...),
                          email: str = Body(...),
                          name: str = Body(...),
                          db: Session = Depends(get_db)):
    try:
        # register_user(UserCreate(email=email, username=str(uuid.uuid4()), password=str(uuid.uuid4())), db)

        pay_as_you_go_product_id = os.getenv('STRIPE_PAY_AS_YOU_GO_PRODUCT_ID')
        metered_product_id = os.getenv('STRIPE_METERED_PRODUCT_ID')
        monthly_product_id = os.getenv('STRIPE_MONTHLY_PRODUCT_ID')
        pay_as_you_go_price = os.getenv('STRIPE_PAY_AS_YOU_GO_PRICE')
        currency = os.getenv('STRIPE_DEFAULT_CURRENCY')

        result = None
        # Handle different plan types based on plan_id
        if planId == 'PAY_AS_YOU_GO':
            result = handle_pay_as_you_go(pay_as_you_go_price, currency, pay_as_you_go_product_id)
        elif planId == 'MONTHLY_PAYMENT':
            result = handle_monthly_payment(email, name, monthly_product_id)
        elif planId == 'VOLUME_BASED_PAYMENT':
            result = handle_volume_based_payment(email, name, metered_product_id)
        else:
            raise HTTPException(status_code=400, detail="Invalid plan ID")

        print("halil:debug:result:", result)
        # db.commit()
        return result
    except Exception as e:
        print(e)
        # db.rollback()
        return JSONResponse({'error': "An error occurred"}, status_code=400)
