import base64
import json
import uuid
# UploadFile, File
from fastapi import APIRouter, Depends, HTTPException, Body, Path
from typing import List, Optional, Dict, Any
from pytest import Session
from sqlalchemy.orm import load_only
from datetime import datetime, timezone
from pydantic import EmailStr


from app.dao.document_dao import DocumentDAO

from app.db import model_document
from app.db.database import get_db
from app.schemas import schema_user
import app.schemas.schema_document as schema_document
from app.service import pdf_service
from fastapi import Request

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
    responses={404: {"description": "Not found"}},
)

# Document endpoints
@router.post("/", response_model=schema_user.MessageResponse,
             summary="Create new document",
             description="Upload a new document with PDF file and create it in the system")
async def create_document(
    request: Request,
    title: str = Body(..., description="Title of the document"),
    # pdf_file: UploadFile = File(..., description="PDF file to upload"),
    created_by: str = Body(..., description="User ID or email of the creator"),
    status: str = Body("draft", description="Initial status of the document (default: draft)"),
    db: Session = Depends(get_db)
):
    """Create a new document with uploaded PDF file"""
    DocumentDAO.db = db
    document = await DocumentDAO.create_document(
        title=title,
        created_by=created_by,
        status=status,
        user_id=request.state.user_id,
        user_email=request.state.user_email
    )
    # schema_doc = schema_document.Document.model_validate(document)
    return schema_user.MessageResponse(message=document.id)

@router.post("/{document_id}/pdf", response_model=schema_user.MessageResponse,
             summary="Add PDF to document",
             description="Add a PDF file to an existing document using base64 encoded data")
async def add_pdf_file(
    pdf_file_base64: schema_document.PDFFileBase64 = Body(..., description="PDF file data in base64 format"),
    document_id: str = Path(..., description="ID of the document"),
    db: Session = Depends(get_db)
):
    """Add PDF file to an existing document"""
    with open("/tmp/start.json", "w") as f:
        f.write(json.dumps({"a": "b"}))

    DocumentDAO.db = db
    pdf_file = model_document.PDFFile(
        id=str(uuid.uuid4()),
        document_id=pdf_file_base64.document_id,
        file_size=pdf_file_base64.file_size,
        uploaded_at=pdf_file_base64.uploaded_at,
        md5_hash=pdf_file_base64.md5_hash,
        file_data=base64.b64decode(pdf_file_base64.file_data_base64)
    )
    await DocumentDAO.add_pdf_file(pdf_file)
    return {"message": pdf_file.id}

@router.post("/{document_id}", response_model=schema_user.MessageResponse,
             summary="Update document",
             description="Update document status and metadata")
async def update_document(
    document_id: str = Path(..., description="ID of the document to update"),
    status: Optional[str] = Body(None, description="New status of the document"),
    meta_data: Optional[Dict[str, Any]] = Body(None, description="Additional metadata for the document"),
    db: Session = Depends(get_db)
):
    """Update document status and metadata"""
    DocumentDAO.db = db
    await DocumentDAO.update_document(
        document_id=document_id,
        status=status,
        meta_data=meta_data
    )
    return {"message": "Document updated successfully"}

@router.get("/{document_id}", response_model=schema_document.Document,
            summary="Get document",
            description="Retrieve a document by its ID")
def get_document(
    document_id: str = Path(..., description="ID of the document to retrieve"),
    db: Session = Depends(get_db)
):
    """Get document by ID"""
    DocumentDAO.db = db
    document = DocumentDAO.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    schema_doc = schema_document.Document.model_validate(document)
    return schema_doc




# @router.get("/signatures-by-signer-id/{signer_id}",
#             summary="Get signatures in PDF by signer ID",
#             description="Retrieve all signatures in a PDF by signer ID",
#             response_model=List[schema_document.SignatureInPDF])
# async def get_signatures_in_pdf_by_signer_id(
#     signer_id: str = Path(..., description="ID of the signer"),
#     db: Session = Depends(get_db)
# ):
#     """Get signatures in PDF by signer ID"""
#     DocumentDAO.db = db
#     signatures = DocumentDAO.get_signatures_in_pdf_by_signer_id(signer_id)

#     schema_signatures = [{
#         "id": signature.id,
#         "pdf_file_id": signature.pdf_file_id,
#         "signer_id": signature.signer_id,
#         "page": signature.page,
#         "x": signature.x,
#         "y": signature.y,
#         "width": signature.width,
#         "height": signature.height,
#         "signature_image": "",
#         "signed": signature.signed,
#         "created_at": signature.created_at,
#         "uploaded_at": signature.uploaded_at,
#         "sign_type": signature.sign_type
#     } for signature in signatures]
#     return schema_signatures


@router.get("/docs_with_pdf_and_signatures/{document_id}/{signer_id}", response_model=schema_user.MessageResponse,
            summary="Get document",
            description="Retrieve a document by its ID")
def docs_with_signatures_per_pdf(
    request: Request,
    document_id: str = Path(..., description="ID of the document to retrieve"),
    signer_id: str = Path(..., description="ID of the signer to retrieve"),
    db: Session = Depends(get_db)
):
    DocumentDAO.db = db
    signer = DocumentDAO.db.query(model_document.Signer).filter(model_document.Signer.id == signer_id).first()
    if not signer:
        raise HTTPException(status_code=404, detail="Signer not found")
    # record the request event
    DocumentDAO.db.add(model_document.SignatureAudit(
        id=str(uuid.uuid4()),
        document_id=document_id,
        signer_id=signer_id,
        signer_email=signer.email,
        signer_name=signer.name,
        action="View Document",
        timestamp=datetime.now(timezone.utc),
        ip_address=request.client.host,
        user_agent=request.headers.get("User-Agent"),
        created_at=datetime.now(timezone.utc),
    ))
    DocumentDAO.db.commit()

    document = DocumentDAO.get_document(document_id)
    signature_model_per_pdf = DocumentDAO.signature_ids_per_pdf_ids(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    schema_doc = schema_document.Document.model_validate(document)
    schema_doc.pdf_file = None

    signature_schema_per_pdf = {}
    for k in signature_model_per_pdf.keys():
        signatures = signature_model_per_pdf[k]
        schema_signatures = []
        for signature in signatures:
            # Create a dict with all fields, converting signature_image to base64 if it exists
            signature_dict = {
                "id": signature.id,
                "pdf_file_id": signature.pdf_file_id,
                "signer_id": signature.signer_id,
                "page": signature.page,
                "x": signature.x,
                "y": signature.y,
                "width": signature.width,
                "height": signature.height,
                "created_at": signature.created_at,
                "uploaded_at": signature.uploaded_at,
                "sign_type": signature.sign_type,
                "signed": signature.signed,
                "signature_image": signature.signature_image if signature.signed else ""
            }
            schema_signature = schema_document.SignatureInPDF.model_validate(signature_dict)
            schema_signatures.append(schema_signature)
        signature_schema_per_pdf[k] = schema_signatures

    obj = {
        "document": schema_doc,
        "signature_schema_per_pdf": signature_schema_per_pdf
    }

    return schema_user.MessageResponse(message=obj)


@router.get("/{document_id}/pdf-files", response_model=List[schema_document.PDFFileBase64],
            summary="Get document PDF files",
            description="Retrieve all PDF files associated with a document")
async def get_document_pdf_files(
    document_id: str = Path(..., description="ID of the document"),
    db: Session = Depends(get_db)
):
    """Get all PDF files associated with a document"""
    DocumentDAO.db = db
    pdfs = await DocumentDAO.get_document_pdf_files(document_id)
    schema_pdfs = [schema_document.PDFFile.model_validate(pdf) for pdf in pdfs]
    schema_pdfs_base64 = [
        schema_document.PDFFileBase64(
            id=pdf.id,
            document_id=pdf.document_id,
            file_data_base64=base64.b64encode(pdf.file_data).decode('utf-8'),
            file_size=pdf.file_size,
            version=pdf.version,
            uploaded_at=pdf.uploaded_at,
            created_at=pdf.created_at,
            completed_at=pdf.completed_at,
            md5_hash=pdf.md5_hash,
            meta_data=pdf.meta_data
        ) for pdf in schema_pdfs
    ]
    return schema_pdfs_base64





@router.get("/public/pdf-files/{document_id}", response_model=List[schema_document.PDFFileBase64],
            summary="Get document PDF files",
            description="Retrieve all PDF files associated with a document")
async def get_public_document_pdf_files(
    document_id: str = Path(..., description="ID of the document"),
    db: Session = Depends(get_db)
):
    """Get all PDF files associated with a document"""
    DocumentDAO.db = db
    pdfs = await DocumentDAO.get_document_pdf_files(document_id)
    schema_pdfs = [schema_document.PDFFile.model_validate(pdf) for pdf in pdfs]
    schema_pdfs_base64 = [
        schema_document.PDFFileBase64(
            id=pdf.id,
            document_id=pdf.document_id,
            file_data_base64=base64.b64encode(pdf.file_data).decode('utf-8'),
            file_size=pdf.file_size,
            version=pdf.version,
            uploaded_at=pdf.uploaded_at,
            created_at=pdf.created_at,
            completed_at=pdf.completed_at,
            md5_hash=pdf.md5_hash,
            meta_data=pdf.meta_data
        ) for pdf in schema_pdfs
    ]
    return schema_pdfs_base64



@router.get("/public/signed-pdf-file/{document_id}", response_model=schema_user.MessageResponse,
            summary="Get document Signed PDF file",
            description="Retrieve Signed PDF file associated with a document")
async def get_signed_pdf_file(
    document_id: str = Path(..., description="ID of the document"),
    db: Session = Depends(get_db)
):
    """Get all PDF files associated with a document"""
    DocumentDAO.db = db
    signed_pdf_file = DocumentDAO.db.query(model_document.SignedPDFFile).filter(model_document.SignedPDFFile.document_id == document_id).first()
    base64_string = base64.b64encode(signed_pdf_file.file_data).decode('utf-8')
    return schema_user.MessageResponse(message=base64_string)


# Signer endpoints
@router.post("/{document_id}/signers", response_model=schema_document.Signer,
             summary="Add signer",
             description="Add a new signer to a document")
async def create_signer(
    document_id: str = Path(..., description="ID of the document"),
    email: EmailStr = Body(..., description="Email address of the signer"),
    name: str = Body(..., description="Name of the signer"),
    order: int = Body(..., description="Order in which the signer should sign (1, 2, 3, etc.)"),
    db: Session = Depends(get_db)
):
    """Add a signer to a document"""
    DocumentDAO.db = db

    signer_count = DocumentDAO.db.query(model_document.Signer).filter(
        model_document.Signer.document_id == document_id
    ).count()


    signer = await DocumentDAO.create_signer(
        document_id=document_id,
        email=email,
        name=name,
        signer_order=order
    )

    if signer_count == 0:
        DocumentDAO.db.add(model_document.SignerEmailQueue(
            id=str(uuid.uuid4()),
            signer_id=signer.id,
            email=signer.email,
            document_id=document_id,
            created_at=datetime.now(timezone.utc),
            email_type="signer_email_queue",
            status="initial"
        ))
        DocumentDAO.db.commit()


    schema_signer = schema_document.Signer.model_validate(signer)
    return schema_signer

# Signature placement endpoints
@router.post("/pdf-files/{pdf_file_id}/signatures", response_model=schema_user.MessageResponse,
             summary="Create signature placement",
             description="Define where a signature should be placed in a PDF")
async def create_signature_in_pdf(
    pdf_file_id: str = Path(..., description="ID of the PDF file"),
    signer_id: str = Body(..., description="ID of the signer"),
    page: int = Body(..., description="Page number where signature should be placed"),
    x: float = Body(..., description="X coordinate of signature placement"),
    y: float = Body(..., description="Y coordinate of signature placement"),
    width: float = Body(..., description="Width of signature area"),
    height: float = Body(..., description="Height of signature area"),
    sign_type: str = Body(..., description="Type of signature"),
    signature_image_base64: str = Body(None, description="Base64 encoded signature image (optional)"),
    db: Session = Depends(get_db)
):
    """Create a signature placement in a PDF file"""
    DocumentDAO.db = db

    signature_image = None
    if signature_image_base64:
        try:
            signature_image = base64.b64decode(signature_image_base64)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 signature image data")

    signature = await DocumentDAO.create_signature_in_pdf(
        pdf_file_id=pdf_file_id,
        signer_id=signer_id,
        sign_type=sign_type,
        page=page,
        x=x,
        y=y,
        width=width,
        height=height,
        signature_image=signature_image,

    )

    # schema_signature = schema_document.SignatureInPDF.model_validate(signature)
    return schema_user.MessageResponse(message=signature.id)


@router.post("/pdf-files/update-all-signatures-with-signed/{document_id}/{signer_id}", response_model=schema_user.MessageResponse,
             summary="Create signature placement",
             description="Define where a signature should be placed in a PDF")
async def update_all_signature_images_in_pdf(
    request: Request,
    document_id: str = Path(..., description="ID of the document"),
    signer_id: str = Path(..., description="ID of the signer"),
    ids: List[str] = Body(..., description="ID of the PDF file"),
    signature_image_base64s: List[str] = Body(None, description="Base64 encoded signature image (optional)"),
    db: Session = Depends(get_db)
):
    """Create a signature placement in a PDF file"""
    DocumentDAO.db = db
    signer = DocumentDAO.db.query(model_document.Signer).filter(model_document.Signer.id == signer_id).first()
    if not signer:
        raise HTTPException(status_code=404, detail="Signer not found")
    # record the request event
    DocumentDAO.db.add(model_document.SignatureAudit(
        id=str(uuid.uuid4()),
        document_id=document_id,
        signer_id=signer_id,
        signer_email=signer.email,
        signer_name=signer.name,
        action="Signed Document",
        timestamp=datetime.now(timezone.utc),
        ip_address=request.client.host,
        user_agent=request.headers.get("User-Agent"),
        created_at=datetime.now(timezone.utc),
    ))
    DocumentDAO.db.commit()


    document_signer_count = (DocumentDAO
                        .db
                        .query(model_document.Signer)
                        .filter(model_document.Signer.id == signer_id)
                        .filter(model_document.Signer.document_id == document_id)
                        .count())


    if document_signer_count != 1:
        raise HTTPException(status_code=404, detail="Auth Error")

    await DocumentDAO.update_signature_images_with_signed(
        signature_ids=ids,
        signature_image_base64s=signature_image_base64s
    )

    DocumentDAO.db.query(model_document.Signer).filter(
        model_document.Signer.id == signer_id,
        model_document.Signer.signed_at.is_(None)  # Only update if not already signed
    ).update(
        {"signed_at": datetime.now(timezone.utc)},
        synchronize_session=False
    )
    DocumentDAO.db.commit()

    current_signer = DocumentDAO.db.query(model_document.Signer).filter(
        model_document.Signer.id == signer_id
    ).first()

    next_signer = DocumentDAO.db.query(model_document.Signer).filter(
        model_document.Signer.document_id == document_id,
        model_document.Signer.signer_order == current_signer.signer_order + 1
    ).first()

    if next_signer:
        DocumentDAO.db.add(model_document.SignerEmailQueue(
            id=str(uuid.uuid4()),
            signer_id=next_signer.id,
            email=next_signer.email,
            document_id=document_id,
            created_at=datetime.now(timezone.utc),
            email_type="signer_email_queue",
            status="initial"
        ))
        # update the document in the database
        DocumentDAO.db.commit()
    else:
        DocumentDAO.update_document_status(
            document_id=document_id,
            status="SIGNED"
        )

        loadonly = load_only(model_document.PDFFile.id)
        pdf_file = (DocumentDAO
                    .db
                    .query(model_document.PDFFile)
                    .options(loadonly)
                    .filter(model_document.PDFFile.document_id == document_id)
                    .first())  # Execute the query

        DocumentDAO.db.add(model_document.SigningPDFFileQueue(
            id=str(uuid.uuid4()),
            document_id=document_id,
            pdf_id=pdf_file.id
        ))
        DocumentDAO.db.commit()


    return schema_user.MessageResponse(message="Signatures successfully updates")

# Signing session endpoints
@router.post("/{document_id}/signing-sessions", response_model=schema_document.SigningSession,
             summary="Create signing session",
             description="Create a new signing session for a document")
async def create_signing_session(
    document_id: str = Path(..., description="ID of the document"),
    expires_at: datetime = Body(..., description="Expiration date and time for the session"),
    status: str = Body("ACTIVE", description="Initial status of the signing session"),
    signer_email: str = Body(..., description="Email of the signer for this session"),
    db: Session = Depends(get_db)
):
    """Create a signing session for a document"""
    DocumentDAO.db = db
    signing_session = await DocumentDAO.create_signing_session(
        document_id=document_id,
        expires_at=expires_at,
        status=status,
        signer_email=signer_email
    )
    schema_signing_session = schema_document.SigningSession.model_validate(signing_session)
    return schema_signing_session

@router.put("/signing-sessions/{session_id}", response_model=schema_document.SigningSession,
            summary="Update signing session",
            description="Update the status of a signing session")
async def update_signing_session(
    session_id: str = Path(..., description="ID of the signing session"),
    status: str = Body(..., description="New status for the session"),
    completed_at: Optional[datetime] = Body(None, description="Completion timestamp (if completed)"),
    db: Session = Depends(get_db)
):
    """Update a signing session status"""
    DocumentDAO.db = db
    return await DocumentDAO.update_signing_session(
        session_id=session_id,
        status=status,
        completed_at=completed_at
    )

# Signature audit endpoints
@router.post("/{document_id}/signature-audits", response_model=schema_document.SignatureAudit,
             summary="Create signature audit",
             description="Create an audit record for signature-related actions")
async def create_signature_audit(
    document_id: str = Path(..., description="ID of the document"),
    signer_id: str = Body(..., description="ID of the signer"),
    signer_email: EmailStr = Body(..., description="Email of the signer"),
    signer_name: str = Body(..., description="Name of the signer"),
    action: str = Body(..., description="Action performed (e.g., 'VIEWED', 'SIGNED')"),
    ip_address: str = Body(..., description="IP address of the signer"),
    user_agent: str = Body(..., description="User agent of the signer's browser"),
    db: Session = Depends(get_db)
):
    """Create a signature audit record"""
    DocumentDAO.db = db
    signature_audit = await DocumentDAO.create_signature_audit(
        document_id=document_id,
        signer_id=signer_id,
        signer_email=signer_email,
        signer_name=signer_name,
        action=action,
        ip_address=ip_address,
        user_agent=user_agent
    )
    schema_signature_audit = schema_document.SignatureAudit.model_validate(signature_audit)
    return schema_signature_audit

@router.get("/{document_id}/signature-audits", response_model=List[schema_document.SignatureAudit],
            summary="Get signature audits",
            description="Retrieve all signature audit records for a document")
def get_signature_audits(
    document_id: str = Path(..., description="ID of the document"),
    db: Session = Depends(get_db)
):
    """Get all signature audit records for a document"""
    DocumentDAO.db = db
    signature_audits = DocumentDAO.get_signature_audits(document_id)
    schema_signature_audits = [schema_document.SignatureAudit.model_validate(audit) for audit in signature_audits]
    return schema_signature_audits

@router.get("/{document_id}/check-all-signed",
            summary="Check if all signed",
            description="Check if all required signers have signed the document")
async def check_all_signed(
    document_id: str = Path(..., description="ID of the document"),
    db: Session = Depends(get_db)
):
    """Check if all signers have signed the document"""
    DocumentDAO.db = db
    all_signed = await DocumentDAO.check_all_signed(document_id)
    return {"all_signed": all_signed}

@router.post("/{document_id}/place-signatures",
             summary="Place signatures in PDF",
             description="Place all signatures in the PDF and generate the final signed document")
async def place_signatures_in_pdf(
    document_id: str = Path(..., description="ID of the document"),
    db: Session = Depends(get_db)
):
    """Place signatures in the PDF and save the signed version"""
    DocumentDAO.db = db
    # Get signature content
    signed_pdf_file_content = await pdf_service.place_signatures_in_pdf(document_id)

    # Add audit trail
    signature_audits = DocumentDAO.get_signature_audits(document_id)
    signed_pdf_file_content = pdf_service.write_signature_audits_to_pdf(signed_pdf_file_content, signature_audits)

    # Save the signed PDF
    await pdf_service.save_signed_pdf_in_db(document_id, signed_pdf_file_content)
    pdf_service.save_signed_pdf_in_file(None, signed_pdf_file_content)

    return {"message": "Signatures placed and document saved successfully"}






@router.post("/list/my-documents", response_model=List[schema_document.Document], summary="Get documents", description="Retrieve user documents")
def get_documents(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get documents for current user"""
    DocumentDAO.db = db
    if request.state.user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    documents = DocumentDAO.get_documents(user_id=request.state.user_id)
    schema_documents = [schema_document.Document.model_validate(doc) for doc in documents]
    for doc in schema_documents:
        doc.pdf_file = None
        doc.audit_trail = None

    return schema_documents


@router.get("/cancel/{document_id}",
            summary="Cancel and Delete Document",
            description="Cancel and Delete Document")
async def cancel_and_delete_document(
    document_id: str = Path(..., description="ID of the document"),
    db: Session = Depends(get_db)
):
    """Cancel and Delete Document"""
    DocumentDAO.db = db
    await DocumentDAO.cancel_and_delete_document(document_id)
    return {"message": "Document cancelled and deleted successfully"}
