from fastapi.testclient import TestClient
import pytest
import hashlib
import base64
from datetime import datetime, timedelta, timezone

from fastapi import UploadFile
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from io import BytesIO
from app.dao.document_dao import DocumentDAO
from app.db.model_document import Base, Document, PDFFile, SigningSession, User
import uuid
from PIL import Image, ImageDraw
from app.main import app
from app.db.database import get_db

@pytest.fixture(scope="function")
def engine():
    return create_engine('sqlite:///:memory:')

@pytest.fixture(scope="function")
def tables(engine):
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)

@pytest.fixture(scope="function")
def db_session(engine, tables):
    """Returns a SQLAlchemy session, and after the test tears down everything properly."""
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(autouse=True, scope="function")
def document_dao(db_session):
    """Fixture to create DocumentDAO with mocked db"""
    DocumentDAO.db = db_session
    # return DocumentDAO

# @pytest.fixture(scope="function")
# def new_document():
#     document = Document(
#         id=str(uuid.uuid4()),
#         title="Test Document",
#         created_by="admin@example.com",
#         status="draft",
#         pdf_path="/path/to/pdf"
#     )
#     return document

@pytest.fixture(scope="function")
def sample_user():
    user = User(
        id="8c8ef5c7-f30e-44c4-a370-2011b837988d",
        email="halil.agin+test@gmail.com",
        username="halilagintest",
        hashed_password="123456",
        is_active=True,
        subscription_id="sub_1RVEu3Gg0tCTvsYGY9Kh23RF",
        subscription_plan="VOLUME_BASED_PAYMENT",
        subscription_created_at=datetime.now(timezone.utc),
        subscription_updated_at=datetime.now(timezone.utc),
        subscription_expires_at=datetime.now(timezone.utc) + timedelta(days=365),
    )
    return user



@pytest.fixture(scope="function")
def sample_document(sample_user):
    document = Document(
        id=str(uuid.uuid4()),
        title="Test Document",
        created_by="halil.agin+test@gmail.com",
        status="draft",
        pdf_path="/path/to/pdf",
        user_id=sample_user.id
    )
    return document


@pytest.fixture(scope="function")
def sample_pdf_from_file():
    """Fixture that reads a real PDF file from the filesystem"""
    try:
        with open("pdfs/sample-contract.pdf", "rb") as f:
            pdf_content = f.read()
        # Calculate MD5 hash
        md5_hash = hashlib.md5(pdf_content).hexdigest()
        # Create and return the PDFFile instance
        return PDFFile(
            document_id=None,
            file_data=pdf_content,
            file_size=len(pdf_content),
            version=1,
            md5_hash=md5_hash,
            meta_data={}
        )
    except FileNotFoundError:
        raise Exception("PDF file not found at pdfs/sample-contact.pdf")
        # pytest.skip("PDF file not found at pdfs/sample-contact.pdf")




@pytest.fixture(scope="function")
def sample_uploaded_pdf():
    """Fixture for a real PDF file using UploadFile"""
    pdf_content = b"fake pdf content"
    file_like = BytesIO(pdf_content)

    return UploadFile(
        file=file_like,
        filename="test.pdf",
        size=len(pdf_content),
        headers={"content-type": "application/pdf"}
    )

@pytest.fixture(scope="function")
def sample_signing_session():
    """Fixture for a signing session"""
    return SigningSession(
        id="session123",
        document_id="doc123",
        signing_session_id="session123",
        signer_email="signer@example.com",
        action="SIGNED",
        timestamp=datetime.now(timezone.utc),
        ip_address="127.0.0.1",
        user_agent="Mozilla/5.0",
        created_at=datetime.now(timezone.utc)
    )

@pytest.fixture(scope="function")
def sample_pdf_file(sample_document):
    pdf_file = PDFFile(
        id="pdf123",
        document_id=sample_document.id,
        file_data=b"fake pdf content",
        file_size=16,
        md5_hash="abc123hash",
        meta_data={}
    )
    return pdf_file




@pytest.fixture(scope="function")
def true_pdf_sample() -> bytes:
    """Fixture for a real PDF file using UploadFile"""
    pdf_content = None
    with open("pdfs/sample-contract.pdf", "rb") as f:
        pdf_content = f.read()
    return pdf_content
    # """Create a simple PDF file for testing."""
    # buffer = BytesIO()
    # c = canvas.Canvas(buffer, pagesize=(300, 300))
    # c.drawString(100, 150, "Test PDF")
    # c.showPage()
    # c.save()
    # buffer.seek(0)
    # return buffer.read()

@pytest.fixture(scope="function")
def true_signature_image() -> bytes:
    """Create a simple image for testing."""
    buffer = BytesIO()
    image = Image.new('RGB', (100, 20), color='red')
    # Add text "signature" to the image
    draw = ImageDraw.Draw(image)
    # Use default font
    draw.text((10, 5), "signature", fill="white")
    image.save(buffer, format='PNG')
    buffer.seek(0)
    base64_image = base64.b64encode(buffer.read()).decode('utf-8')
    return base64_image



@pytest.fixture
def client():
    return TestClient(app)

# @pytest.fixture(autouse=True)
# def setup_database():
#     # Drop all tables first to ensure clean state
#     Base.metadata.drop_all(bind=engine)
#     # Create all tables
#     Base.metadata.create_all(bind=engine)
#     # Seed the database
#     seed_database()
#     yield
#     # Clean up after tests
#     Base.metadata.drop_all(bind=engine)

@pytest.fixture
def auth_headers():
    # Login to get access token
    client = TestClient(app)
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "halil.agin+test@gmail.com", "password": "123456"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

# # This is a placeholder for DocumentDAO.
# # In your actual conftest.py, you should import your real DocumentDAO class.
# # If DocumentDAO is already imported or available, you might not need this placeholder.
# class DocumentDAO:
#     db = None
#     # ... other methods and attributes of DocumentDAO


@pytest.fixture(scope="function", autouse=True)
def setup_document_dao_db():
    """
    Pytest fixture to automatically initialize DocumentDAO.db with a new database
    session for each test function.
    """
    db_generator = get_db()  # get_db returns a generator
    db_session = next(db_generator)

    # Store the original DocumentDAO.db attribute, if any, to restore it after the test
    original_dao_db = getattr(DocumentDAO, 'db', None)

    # Set the DocumentDAO.db attribute to the new session
    # This assumes DocumentDAO.db is a class attribute.
    DocumentDAO.db = db_session
    # You can add a print statement here for debugging if needed:
    # print(f"DEBUG: DocumentDAO.db set to {db_session} for test")

    yield db_session  # Test runs here. The session can also be injected into tests if needed.

    # Teardown code (runs after the test is complete)
    # Restore the original DocumentDAO.db attribute
    DocumentDAO.db = original_dao_db

    try:
        # This ensures the 'finally' block in your get_db() generator is executed,
        # which should close the database session.
        next(db_generator)
    except StopIteration:
        # This is expected as the generator should be exhausted.
        pass
    # You can add a print statement here for debugging if needed:
    # print(f"DEBUG: DocumentDAO.db restored and session closed for test")