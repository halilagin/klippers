from fastapi.responses import JSONResponse
from typing import Callable
import jwt
from fastapi import Request, status

# from app.main import app
from app.config import settings


public_urls = [
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/documents/docs_with_pdf_and_signatures",
    "/api/v1/documents/pdf-files/update-all-signatures-with-signed",
    "/api/v1/subscription/create-payment-intent",
    "/api/v1/documents/public/pdf-files",
    "/api/v1/documents/public/signed-pdf-file",
]

async def auth_middleware(request: Request, call_next: Callable):
    """
    Middleware that extracts the user ID from a JWT provided in the Authorization header
    and sets it on request.state for all subsequent endpoint handlers.
    """

    # Bypass authentication for auth-related endpoints
    in_public_url = any([request.url.path.startswith(url) for url in public_urls])
    if in_public_url:
        request.state.user_id = None
        response = await call_next(request)
        return response

    # Extract the 'Authorization' header if present
    authorization: str = request.headers.get("Authorization")


    if authorization:
        # Typically the header is in the format: 'Bearer <token>'
        scheme, _, token = authorization.partition(" ")

        # Do a simple check for Bearer scheme
        if scheme.lower() != "bearer":
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid authentication scheme."},
            )

        try:
            # Decode the JWT
            # decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

            # Extract user information - assume the JWT has 'sub' as user ID
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            request.state.user_id = decoded_token.get("user_id")
            request.state.user_email = decoded_token.get("email")
            request.state.subscription_plan = decoded_token.get("subscription_plan") or "PAY_AS_YOU_GO"

        except jwt.ExpiredSignatureError:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Token has expired."},
            )
        except jwt.InvalidTokenError:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid token provided."},
            )
    else:
        request.state.user_id = None

    # Continue processing the request
    response = await call_next(request)
    return response
