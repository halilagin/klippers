
import pytest
from datetime import datetime, timedelta
from unittest.mock import patch
from sqlalchemy.orm import sessionmaker
from app.dao.document_dao import DocumentDAO
from app.db.model_document import Document, PDFFile, SignatureInPDF
import copy
import uuid



@pytest.mark.asyncio
async def test_create_pdf_file(sample_document, sample_pdf_file, sample_user, sample_uploaded_pdf):
    """Test creating and associating a PDF file with a document"""
    doc = await test_create_document(sample_document, sample_uploaded_pdf, sample_user)
    pdf_file = await DocumentDAO.create_pdf_file(
        document_id=doc.id,
        file_data=sample_pdf_file.file_data,
        file_size=sample_pdf_file.file_size,
        version=sample_pdf_file.version,
        meta_data=sample_pdf_file.meta_data
    )

    # assert pdf_file.id == sample_pdf_file.id
    assert pdf_file.document_id == doc.id
    assert pdf_file.file_data == sample_pdf_file.file_data
    assert pdf_file.file_size == sample_pdf_file.file_size
    assert pdf_file.meta_data == sample_pdf_file.meta_data
    # schema_pdf_file = schema_document.PDFFile.model_validate(pdf_file)


@pytest.mark.asyncio
async def test_create_document(sample_document, sample_uploaded_pdf, sample_user):
    """Test creating a new document with PDF file"""
    # Mock the _store_pdf_file method
    stored_pdf_path = "/stored/path/test.pdf"
    with patch.object(DocumentDAO, '_store_pdf_file', return_value=stored_pdf_path):
        doc = await DocumentDAO.create_document(
            title=sample_document.title,
            # pdf_file=sample_uploaded_pdf,
            created_by=sample_document.created_by,
            status=sample_document.status,
            user_id=sample_user.id,
            user_email=sample_user.email
        )

        # Assert document properties
        assert doc.id is not None
        assert doc.title == sample_document.title
        assert doc.created_by == sample_document.created_by
        assert doc.status == sample_document.status
        # assert doc.pdf_path == stored_pdf_path
        assert isinstance(doc.created_at, datetime)


    documents = DocumentDAO.get_documents(user_id=sample_user.id)
    assert len(documents) > 0
    assert all(isinstance(doc, Document) for doc in documents)
    assert all(doc.user_id == sample_user.id for doc in documents)
    return doc

@pytest.mark.asyncio
async def test_get_document(sample_document, sample_uploaded_pdf, sample_user):
    """Test retrieving a document by ID"""
    document = await test_create_document(sample_document, sample_uploaded_pdf, sample_user)

    # Execute
    result = DocumentDAO.get_document(document.id)

    # Assert
    assert result is not None
    assert result.id == document.id
    assert result.title == sample_document.title
    assert result.created_by == sample_document.created_by
    assert result.status == sample_document.status

@pytest.mark.asyncio
async def test_get_documents(sample_document, sample_user):
    """Test retrieving a list of documents"""
    doc1_instance = copy.deepcopy(sample_document)
    doc1_instance.id = str(uuid.uuid4())

    doc2_instance = copy.deepcopy(sample_document)
    doc2_instance.id = str(uuid.uuid4())

    doc1 = await DocumentDAO.add_document(doc1_instance)
    doc2 = await DocumentDAO.add_document(doc2_instance)
    documents = DocumentDAO.get_documents(user_id=sample_user.id, limit=1000)

    print("halil:docs:id:", doc1.id, doc2.id)
    print("halil:docs:len:", len(documents))
    # Assert
    # assert len(documents) == 2
    assert any(doc.id == doc1.id for doc in documents)
    assert any(doc.id == doc2.id for doc in documents)
    assert all(isinstance(doc, Document) for doc in documents)

@pytest.mark.asyncio
async def test_update_document(sample_document, sample_uploaded_pdf, sample_user):
    """Test updating an existing document"""
    # First create a document
    document = await test_create_document(sample_document, sample_uploaded_pdf, sample_user)

    # Updated document data
    updated_title = "Updated Test Document"
    updated_status = "published"

    # Mock the _store_pdf_file method for update
    updated_doc = await DocumentDAO.update_document(
        document_id=document.id,
        title=updated_title,
        status=updated_status,
        meta_data={}
    )

    # Assert document properties
    assert updated_doc.id == document.id
    assert updated_doc.title == updated_title
    assert updated_doc.status == updated_status
    assert isinstance(updated_doc.updated_at, datetime)
    assert updated_doc.created_by == sample_document.created_by  # Should remain unchanged

@pytest.mark.asyncio
async def test_add_signer(sample_document):
    """Test adding a signer to a document"""
    # First create the document in the database
    await DocumentDAO.add_document(sample_document)

    # Execute
    signer = await DocumentDAO.create_signer(
        document_id=sample_document.id,
        email="signer@example.com",
        name="Test Signer",
        signer_order=1
    )

    # Assert
    assert signer is not None
    assert signer.document_id == sample_document.id
    assert signer.email == "signer@example.com"
    assert signer.name == "Test Signer"
    assert signer.signer_order == 1
    assert isinstance(signer.created_at, datetime)

@pytest.mark.asyncio
async def test_create_signing_session(sample_document):
    """Test creating a signing session"""
    # First create the document in the database

    await DocumentDAO.add_document(sample_document)
    # signer = await DocumentDAO.add_signer(sample_document.id, "signer@example.com", "Test Signer", 1)
    # Setup test data
    expires_at = datetime.utcnow() + timedelta(days=7)


    # Execute
    signing_session = await DocumentDAO.create_signing_session(
        document_id=sample_document.id,
        expires_at=expires_at,
        signer_email="signer@example.com",
        status="ACTIVE"
    )

    # Assert
    assert signing_session is not None
    assert signing_session.document_id == sample_document.id
    assert signing_session.expires_at == expires_at
    assert signing_session.status == "ACTIVE"
    assert isinstance(signing_session.created_at, datetime)
    assert signing_session.completed_at is None

@pytest.mark.asyncio
async def test_create_signature_audit(sample_document):
    """Test creating a signature audit record"""
    doc = await DocumentDAO.add_document(sample_document)
    signer = await DocumentDAO.create_signer(
        document_id=doc.id,
        email="signer@example.com",
        name="Test Signer",
        signer_order=1
    )
    # Execute
    audit = await DocumentDAO.create_signature_audit(
        document_id=doc.id,
        signer_id=signer.id,
        signer_email="signer@example.com",
        signer_name="Test Signer",
        action="SIGNED",
        ip_address="127.0.0.1",
        user_agent="Mozilla/5.0"
    )

    # Assert
    assert audit is not None
    assert audit.action == "SIGNED"
    assert isinstance(audit.timestamp, datetime)




@pytest.mark.asyncio
async def test_get_document_pdf_files(sample_document):
    """Test retrieving PDF files for a document"""
    # First add the document and PDF file to the database
    doc = await DocumentDAO.add_document(sample_document)

    # Create a second PDF file for the same document
    pdf_files = [
        PDFFile(
            id=str(uuid.uuid4()),
            document_id=doc.id,
            file_data=b"updated pdf content",
            file_size=20,
            md5_hash="def456hash",
            version=1,
            meta_data={"updated": True}
        ),
        PDFFile(
            id=str(uuid.uuid4()),
            document_id=doc.id,
            file_data=b"updated pdf content",
            file_size=20,
            md5_hash="def456hash",
            version=2,
            meta_data={"updated": True}
        )
    ]
    for pdf_file in pdf_files:
        await DocumentDAO.add_pdf_file(pdf_file)

    # Execute
    results = await DocumentDAO.get_document_pdf_files(sample_document.id)
    ids = [pdf.id for pdf in results]
    # Assert
    assert len(results) == 2
    assert all(isinstance(pdf, PDFFile) for pdf in results)
    assert any(pdf.id == ids[0] for pdf in results)
    assert any(pdf.id == ids[1] for pdf in results)
    assert all(pdf.document_id == sample_document.id for pdf in results)
    assert any(pdf.version == 2 for pdf in results)
    assert any(pdf.version == 2 for pdf in results)



@pytest.mark.asyncio
async def test_cid_commit(engine, sample_document):
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()
    DocumentDAO.db = session
    """Test retrieving PDF files for a document"""
    # First add the document and PDF file to the database
    await DocumentDAO.add_document(sample_document, commit=False)

    # Create a second PDF file for the same document
    pdf_files = [
        PDFFile(
            id="pdf456",
            document_id=sample_document.id,
            file_data=b"updated pdf content",
            file_size=20,
            md5_hash="def456hash",
            version=1,
            meta_data={"updated": True}
        ),
        PDFFile(
            id="pdf457",
            document_id=sample_document.id,
            file_data=b"updated pdf content",
            file_size=20,
            md5_hash="def456hash",
            version=2,
            meta_data={"updated": True}
        )
    ]
    for pdf_file in pdf_files:
        await DocumentDAO.add_pdf_file(pdf_file, commit=False)
    DocumentDAO.db.commit()

    # Execute
    results = await DocumentDAO.get_document_pdf_files(sample_document.id)

    session.close()
    transaction.rollback()
    connection.close()

    ids = [pdf.id for pdf in results]
    # Assert
    assert len(results) == 2
    assert all(isinstance(pdf, PDFFile) for pdf in results)
    assert any(pdf.id == ids[0] for pdf in results)
    assert any(pdf.id == ids[1] for pdf in results)
    assert all(pdf.document_id == sample_document.id for pdf in results)
    assert any(pdf.version == 2 for pdf in results)
    assert any(pdf.version == 2 for pdf in results)







@pytest.mark.asyncio
async def test_document_signing_lifecycle(sample_pdf_from_file, sample_document, sample_user, sample_uploaded_pdf):
    """Test the complete document signing lifecycle:
    1. Upload PDF file
    2. Create document
    3. Add signers
    4. Start signing process
    5. Audit the signing process
    6. Finalize the signing
    """

    doc = await test_create_document(sample_document, sample_uploaded_pdf, sample_user)
    # 1 & 2. Upload PDF and create document
    stored_pdf_path = "/stored/path/test.pdf"
    with patch.object(DocumentDAO, '_store_pdf_file', return_value=stored_pdf_path):
        document = await DocumentDAO.create_document(
            title=doc.title,
            # pdf_file=sample_pdf_from_file,
            created_by=doc.created_by,
            status="draft",
            user_id=sample_user.id,
            user_email=sample_user.email
        )

        assert document.id is not None
        assert document.status == "draft"

    sample_pdf_from_file.document_id = document.id
    pdf_file = await DocumentDAO.add_pdf_file(sample_pdf_from_file)
    assert pdf_file.document_id == document.id

    # 3. Add two signers
    signer1 = await DocumentDAO.create_signer(
        document_id=doc.id,
        email="signer1@example.com",
        name="First Signer",
        signer_order=1
    )

    signer2 = await DocumentDAO.create_signer(
        document_id=doc.id,
        email="signer2@example.com",
        name="Second Signer",
        signer_order=2
    )

    assert signer1.email == "signer1@example.com"
    assert signer2.email == "signer2@example.com"

    # 4. Start signing process - create signing session
    expires_at = datetime.utcnow() + timedelta(days=7)
    signing_session = await DocumentDAO.create_signing_session(
        document_id=doc.id,
        signer_email=signer1.email,
        expires_at=expires_at,
        status="ACTIVE"
    )

    assert signing_session.status == "ACTIVE"
    assert signing_session.document_id == doc.id

    # 5. Audit the signing process - first signer signs
    audit1 = await DocumentDAO.create_signature_audit(
        document_id=doc.id,
        signer_id=signer1.id,
        signer_email=signer1.email,
        signer_name=signer1.name,
        action="SIGNED",
        ip_address="192.168.1.1",
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    )

    assert audit1.action == "SIGNED"
    assert audit1.signer_email == signer1.email

    # Second signer signs
    audit2 = await DocumentDAO.create_signature_audit(
        document_id=doc.id,
        signer_id=signer2.id,
        signer_email=signer2.email,
        signer_name=signer2.name,
        action="SIGNED",
        ip_address="192.168.1.2",
        user_agent="Chrome/91.0.4472.124"
    )

    assert audit2.action == "SIGNED"
    assert audit2.signer_email == signer2.email

    # 6. Finalize the signing - update document status and complete session
    # Update document status to completed
    completed_doc = await DocumentDAO.update_document(
        document_id=doc.id,
        status="completed",
        meta_data={"all_signed": True}
    )

    assert completed_doc.status == "completed"

    # Complete the signing session
    completed_session = await DocumentDAO.update_signing_session(
        session_id=signing_session.id,
        status="completed",
        completed_at=datetime.utcnow()
    )

    assert completed_session.status == "completed"
    assert completed_session.completed_at is not None

    # Verify final state
    final_doc = DocumentDAO.get_document(doc.id)
    assert final_doc.status == "completed"

    # Verify PDF files are associated
    pdf_files = await DocumentDAO.get_document_pdf_files(document.id)
    assert len(pdf_files) > 0

@pytest.fixture
async def sample_signature_in_pdf(sample_pdf_file, sample_document, sample_user, sample_uploaded_pdf):
    """Fixture for a signature placement in a PDF"""
    doc = await test_create_document(sample_document, sample_uploaded_pdf, sample_user)
    pdf_file = await DocumentDAO.create_pdf_file(
        document_id=doc.id,
        file_data=sample_pdf_file.file_data,
        file_size=sample_pdf_file.file_size,
        version=sample_pdf_file.version,
        meta_data=sample_pdf_file.meta_data
    )
    # First create a signer
    signer = await DocumentDAO.create_signer(
        document_id=doc.id,
        email="signer@example.com",
        name="Test Signer",
        signer_order=1
    )
    # Create the signature placement
    signature_in_pdf = SignatureInPDF(
        id=str(uuid.uuid4()),
        pdf_file_id=pdf_file.id,
        signer_id=signer.id,
        page=1,
        x=100,
        y=100,
        width=150,
        height=20,
        signature_image=b"fake signature image data"
    )
    return doc, pdf_file, signer, signature_in_pdf

@pytest.mark.asyncio
async def test_create_signature_in_pdf(sample_document, sample_pdf_file, sample_signature_in_pdf):
    """Test creating and retrieving a signature placement in a PDF"""
    doc, pdf_file, signer, signature_in_pdf = sample_signature_in_pdf


    # Create the signature placement
    created_signature = await DocumentDAO.create_signature_in_pdf(
        pdf_file_id=signature_in_pdf.pdf_file_id,
        signer_id=signature_in_pdf.signer_id,
        page=signature_in_pdf.page,
        x=signature_in_pdf.x,
        y=signature_in_pdf.y,
        width=signature_in_pdf.width,
        height=signature_in_pdf.height,
        signature_image=signature_in_pdf.signature_image
    )

    # Assert signature properties
    assert created_signature is not None
    assert created_signature.pdf_file_id == pdf_file.id
    assert created_signature.page == signature_in_pdf.page
    assert created_signature.x == signature_in_pdf.x
    assert created_signature.y == signature_in_pdf.y
    assert created_signature.width == signature_in_pdf.width
    assert created_signature.height == signature_in_pdf.height
    assert isinstance(created_signature.created_at, datetime)

    # Test retrieving signatures for a PDF file
    signatures = DocumentDAO.get_signatures_in_pdf(pdf_file.id)
    assert len(signatures) == 1
    assert signatures[0].id == created_signature.id
    assert signatures[0].signer_id == signature_in_pdf.signer_id
