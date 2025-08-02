from fastapi.middleware.cors import CORSMiddleware

from app.api.middleware import auth_middleware
from app.api.v1.endpoints import documents, auth, users
from app.api.v1.endpoints import subscription
from contextlib import asynccontextmanager
import threading
from app.db_polling.stripe_document_meters import send_document_meters_loop
from fastapi import FastAPI
from app.config import settings

from dotenv import load_dotenv
load_dotenv()

# from .db.database import engine
# from .db.model_document import user
# from .db.seed import seed_database

# Create database tables
# user.Base.metadata.create_all(bind=engine)

# Seed the database with dummy data
# seed_database()
EMAIL_INTERVAL_SECONDS = 60
STRIPE_DOCUMENT_METER_INTERVAL_SECONDS = 60
SIGNING_PDF_INTERVAL_SECONDS = 60
PSQL_BACKUP_INTERVAL_SECONDS = 60 * 60 * 12


def start_background_thread():
    # Create and start the daemon thread

    if settings.ACTIVATE_STRIPE_METERING:
        # Create and start the daemon thread
        global strpie_doc_meter_thread
        strpie_doc_meter_thread = threading.Thread(
            target=send_document_meters_loop,
            args=(STRIPE_DOCUMENT_METER_INTERVAL_SECONDS,),
            daemon=True  # Set as daemon thread so it exits when FastAPI exits
        )
        strpie_doc_meter_thread.start()
        print(f"MAIN: Background Stripe document meter thread started. Will send meters every {STRIPE_DOCUMENT_METER_INTERVAL_SECONDS} seconds.")

#    if settings.ACTIVATE_PSQL_BACKUP:
#        # Create and start the daemon thread
#        global psql_backup_thread
#        psql_backup_thread = threading.Thread(
#            target=backup_postgres_db_loop,
#            args=(PSQL_BACKUP_INTERVAL_SECONDS,),
#            daemon=True  # Set as daemon thread so it exits when FastAPI exits
#        )
#        psql_backup_thread.start()
#        print(f"MAIN: Background PSQL Backup thread started. Running in {PSQL_BACKUP_INTERVAL_SECONDS} seconds.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on startup
    print("MAIN: FastAPI app starting up...")


    # Ensure environment variables are loaded if not already loaded by the module import
    start_background_thread()

    yield

    # Code to run on shutdown (optional)
    print("MAIN: FastAPI app shutting down...")
    # No explicit need to stop the daemon thread, it will exit with the main process
    # If it were a non-daemon thread, you'd need a mechanism to signal it to stop here.


app = FastAPI(title="Klippers API", lifespan=lifespan, version="1.0.0")






# Allow multiple specific origins
origins = [
    "http://localhost:3000",  # Add your frontend origin explicitly
    "http://127.0.0.1:3000",
    "*"
]

# OR allow all origins (not recommended for production)
# origins = ["*"]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(auth_middleware)



# Dummy SECRET, use something secure in production
SECRET_KEY = "SECRETKEY"
ALGORITHM = "HS256"





# Include routers
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(documents.router, prefix="/api/v1", tags=["documents"])
app.include_router(subscription.router, prefix="/api/v1", tags=["subscription"])






@app.get("/")
async def root():
    return {"message": "Welcome to QSign API"}
