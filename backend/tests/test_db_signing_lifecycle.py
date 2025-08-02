import pytest
from datetime import datetime, timedelta
from unittest.mock import patch
from app.dao.document_dao import DocumentDAO
import copy

from app.db.model_document import Signer
import app.service.pdf_service as pdf_service

# from app.db.model_document import Document, SignatureAudit


@pytest.mark.asyncio
async def test_document_signing_lifecycle(sample_pdf_from_file, sample_document, sample_user, true_signature_image):
    """Test the complete document signing lifecycle:
    1. Upload PDF file
    2. Create document
    3. Add signers
    4. Start signing process
    5. Audit the signing process
    6. Finalize the signing
    """
    # 1 & 2. Upload PDF and create document
    stored_pdf_path = "/stored/path/test.pdf"
    with patch.object(DocumentDAO, '_store_pdf_file', return_value=stored_pdf_path):
        document = await DocumentDAO.create_document(
            title=sample_document.title,
            # pdf_file=sample_pdf_from_file,
            created_by=sample_document.created_by,
            user_id=sample_user.id,
            user_email=sample_user.email,
            status="draft"
        )

        assert document.id is not None
        assert document.status == "draft"

    sample_pdf_from_file.document_id = document.id
    pdf_file = await DocumentDAO.add_pdf_file(sample_pdf_from_file)
    assert pdf_file.document_id == document.id

    # 3. Add two signers
    signer1 = await DocumentDAO.create_signer(
        document_id=document.id,
        email="signer1@example.com",
        name="First Signer",
        signer_order=1
    )



    signer2 = await DocumentDAO.create_signer(
        document_id=document.id,
        email="signer2@example.com",
        name="Second Signer",
        signer_order=2
    )


    assert signer1.email == "signer1@example.com"
    assert signer2.email == "signer2@example.com"

    # Create signature placements in PDF for each signer
    # First signer - 3 signature placements
    signature_image1 = copy.deepcopy(true_signature_image)
    for i in range(2):
        signature_in_pdf = await DocumentDAO.create_signature_in_pdf(
            pdf_file_id=pdf_file.id,
            signer_id=signer1.id,
            page=i + 1,
            x=100.0,
            y=200.0 + (i * 50),
            width=200.0,
            height=50.0,
            signature_image=signature_image1
        )
        assert signature_in_pdf.signer_id == signer1.id
        assert signature_in_pdf.page == i + 1

    # Second signer - 3 signature placements
    signature_image2 = copy.deepcopy(true_signature_image)
    for i in range(2):
        signature_in_pdf = await DocumentDAO.create_signature_in_pdf(
            pdf_file_id=pdf_file.id,
            signer_id=signer2.id,
            page=i + 1,
            x=350.0,
            y=200.0 + (i * 50),
            width=200.0,
            height=50.0,
            signature_image=signature_image2
        )
        assert signature_in_pdf.signer_id == signer2.id
        assert signature_in_pdf.page == i + 1

    # 4. Start signing process - create signing session
    expires_at = datetime.utcnow() + timedelta(days=7)
    signing_session = await DocumentDAO.create_signing_session(
        document_id=document.id,
        expires_at=expires_at,
        signer_email=signer1.email,
        status="ACTIVE"
    )

    assert signing_session.status == "ACTIVE"
    assert signing_session.document_id == document.id



    # 5. Audit the signing process - first signer signs
    audit1 = await DocumentDAO.create_signature_audit(
        document_id=document.id,
        signer_id=signer1.id,
        signer_email=signer1.email,
        signer_name=signer1.name,
        action="SIGNED",
        ip_address="192.168.1.1",
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    )

    assert audit1.action == "SIGNED"
    assert audit1.signer_email == signer1.email

    DocumentDAO.db.query(Signer).filter(Signer.id == signer1.id).update({"signed_at": datetime.utcnow()})
    DocumentDAO.db.commit()

    all_signed = await DocumentDAO.check_all_signed(document.id)
    assert all_signed is False


    audit2 = await DocumentDAO.create_signature_audit(
        document_id=document.id,
        signer_id=signer2.id,
        signer_email=signer2.email,
        signer_name=signer2.name,
        action="SIGNED",
        ip_address="192.168.1.2",
        user_agent="Chrome/91.0.4472.124"
    )

    assert audit2.action == "SIGNED"
    assert audit2.signer_email == signer2.email


    DocumentDAO.db.query(Signer).filter(Signer.id == signer2.id).update({"signed_at": datetime.utcnow()})
    DocumentDAO.db.commit()

    all_signed = await DocumentDAO.check_all_signed(document.id)
    assert all_signed is True

    # 6. Finalize the signing - update document status and complete session
    # Update document status to completed
    completed_doc = await DocumentDAO.update_document(
        document_id=document.id,
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
    final_doc = DocumentDAO.get_document(document.id)
    assert final_doc.status == "completed"

    # Verify PDF files are associated
    pdf_files = await DocumentDAO.get_document_pdf_files(document.id)
    assert len(pdf_files) > 0


    signed_pdf_file_content = pdf_service.place_signatures_in_pdf(document.id)
    signature_audits = DocumentDAO.get_signature_audits(document.id)
    signed_pdf_file_content = pdf_service.write_signature_audits_to_pdf(signed_pdf_file_content, signature_audits)
    await pdf_service.save_signed_pdf_in_db(document.id, signed_pdf_file_content)
    pdf_service.save_signed_pdf_in_file(None, signed_pdf_file_content)
