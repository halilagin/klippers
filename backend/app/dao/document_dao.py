from sqlalchemy.orm import Session, load_only, joinedload
from fastapi import UploadFile, Depends
from typing import List, Optional
from datetime import datetime
import logging

from app.db.model_document import Document, SignatureInPDF, Signer, SignatureField, SigningPDFFileQueue, SigningSession, SignatureAudit, PDFFile, SignerEmailQueue, StripeDocumentMeter, User
from app.db.database import get_db
from hashlib import md5

logger = logging.getLogger(__name__)

class DocumentDAO:
    db: Session = Depends(get_db)

    @staticmethod
    async def add_document(document: Document, commit: bool = True) -> Document:
        """Create a new document in the database"""
        # Handle PDF file storage (implementation depends on your storage solution)
        # pdf_storage_path = await DocumentDAO._store_pdf_file(pdf_file)
        # document.pdf_path = pdf_storage_path
        DocumentDAO.db.add(document)
        if commit:
            DocumentDAO.db.commit()
        return document


    @staticmethod
    def delete_signer_email_queue(signer_email_queue_id: str, commit: bool = True) -> None:
        """Delete a signer email queue record"""
        signer_email_queue = DocumentDAO.db.query(SignerEmailQueue).filter(SignerEmailQueue.id == signer_email_queue_id).first()
        DocumentDAO.db.delete(signer_email_queue)
        if commit:
            DocumentDAO.db.commit()

    @staticmethod
    def get_signer_email_queue(limit: int = 30, skip: int = 0) -> List[SignerEmailQueue]:
        """Get signer email queue records in batches, ordered by oldest first"""
        return DocumentDAO.db.query(SignerEmailQueue)\
            .order_by(SignerEmailQueue.created_at.asc())\
            .offset(skip)\
            .limit(limit)\
            .all()

    @staticmethod
    def update_document_status(document_id: str, status: str, commit: bool = True) -> None:
        """Update the status of a document"""
        DocumentDAO.db.query(Document).filter(Document.id == document_id).update({"status": status})
        if commit:
            DocumentDAO.db.commit()

    @staticmethod
    def get_stripe_document_meter_queue(limit: int = 30, skip: int = 0) -> List[StripeDocumentMeter]:
        """Get signer email queue records in batches, ordered by oldest first"""
        return DocumentDAO.db.query(StripeDocumentMeter)\
            .offset(skip)\
            .limit(limit)\
            .all()

    @staticmethod
    def get_signing_pdf_file_queue(limit: int = 30, skip: int = 0) -> List[SigningPDFFileQueue]:
        """Get signer email queue records in batches, ordered by oldest first"""
        return DocumentDAO.db.query(SigningPDFFileQueue)\
            .offset(skip)\
            .limit(limit)\
            .all()
    

    @staticmethod
    async def add_pdf_file(pdf_file: PDFFile, commit: bool = True) -> PDFFile:
        """Create a new document in the database"""
        # Handle PDF file storage (implementation depends on your storage solution)
        # pdf_storage_path = await DocumentDAO._store_pdf_file(pdf_file)
        # document.pdf_path = pdf_storage_path
        DocumentDAO.db.add(pdf_file)
        if commit:
            DocumentDAO.db.commit()
        return pdf_file

    @staticmethod
    async def create_document(
        title: str,
        # pdf_file: UploadFile,
        created_by: str,
        status: str,
        user_id: str,
        user_email: str,
        commit: bool = True
    ) -> Document:
        """Create a new document in the database"""
        # Handle PDF file storage (implementation depends on your storage solution)
        # pdf_storage_path = await DocumentDAO._store_pdf_file(pdf_file)
        # if pdf_storage_path is None:
        #     pdf_storage_path = "/default/path/to/pdf/file"
        document = Document(
            user_id=user_id,
            title=title,
            pdf_path="/default/path/to/pdf/file",
            created_by=created_by,
            created_at=datetime.utcnow(),
            status=status
        )
        DocumentDAO.db.add(document)
        DocumentDAO.db.flush()

        print("halil:debug:users:", DocumentDAO.db.query(User).all())
        user = DocumentDAO.db.query(User).filter(User.email == user_email).first()
        print("halil:debug:user:", user_email, user)

        subscription_id = user.subscription_id if user else None

        privileged_emails = ["halil.agin@gmail.com", "berfin.aginnn@gmail.com"]
        if user_email not in privileged_emails and subscription_id is not None:
            DocumentDAO.db.add(StripeDocumentMeter(
                document_id=document.id,
                user_email=user_email,
                subscription_id=subscription_id
            ))

        if commit:
            DocumentDAO.db.commit()

        return document

    @staticmethod
    def get_document(document_id: str) -> Optional[Document]:
        """Retrieve a document by ID"""
        document = (DocumentDAO.db.query(Document)
                   .options(
                       joinedload(Document.signers).joinedload(Signer.signature_fields),
                       joinedload(Document.audit_trail),
                       joinedload(Document.pdf_file)
                   )
                   .filter(Document.id == document_id)
                   .first())
        return document


    @staticmethod
    def signature_ids_per_pdf_ids(document_id: str) -> dict[str, list[str]]:
        """Retrieve a document by ID"""
        # document = DocumentDAO.db.query(Document).filter(Document.id == document_id).first()
        loadonly = load_only(PDFFile.id)
        pdfFiles = (DocumentDAO
                    .db
                    .query(PDFFile)
                    .options(loadonly)
                    .filter(PDFFile.document_id == document_id)
                    .all())  # Execute the query

        signature_per_pdf = {}
        #   .options(loadonly)
        for pdf in pdfFiles:
            loadonly = load_only(SignatureInPDF.id)
            signatures = (DocumentDAO.db
                          .query(SignatureInPDF)
                          .filter(SignatureInPDF.pdf_file_id == pdf.id)
                          .all())  # Execute the query
            signature_per_pdf[pdf.id] = signatures

        return signature_per_pdf



    @staticmethod
    def get_documents(
        skip: int = 0,
        limit: int = 100,
        user_id: str = None
    ) -> List[Document]:
        """Retrieve a list of documents"""
        query = DocumentDAO.db.query(Document)
        if user_id:
            query = query.filter(Document.user_id == user_id)
        return query.offset(skip).limit(limit).all()

    @staticmethod
    async def update_document(
        document_id: str,
        title: Optional[str] = None,
        status: Optional[str] = None,
        expires_at: Optional[datetime] = None,
        meta_data: Optional[dict] = None,
        commit: bool = True
    ) -> Document:
        """Update a document's attributes"""
        document = DocumentDAO.get_document(document_id)
        if title:
            document.title = title
        if status:
            document.status = status
        if expires_at:
            document.expires_at = expires_at
        if meta_data:
            document.meta_data = meta_data
        document.updated_at = datetime.utcnow()
        if commit:
            DocumentDAO.db.commit()

        # await DocumentDAO.db.refresh(document)
        return document

    @staticmethod
    async def delete_document(document_id: str, commit: bool = True) -> None:
        """Delete a document"""
        document = await DocumentDAO.get_document(document_id)
        DocumentDAO.db.delete(document)
        if commit:
            DocumentDAO.db.commit()


    @staticmethod
    async def create_signer(
        document_id: str,
        email: str,
        name: str,
        signer_order: int,
        commit: bool = True
    ) -> Signer:
        """Add a signer to a document"""
        signer = Signer(
            document_id=document_id,
            email=email,
            name=name,
            signer_order=signer_order,
            created_at=datetime.utcnow(),
            uploaded_at=datetime.utcnow()
        )
        DocumentDAO.db.add(signer)
        DocumentDAO.db.flush()
        if commit:
            DocumentDAO.db.commit()


        return signer

    @staticmethod
    async def add_signature_field(
        document_id: str,
        signer_id: str,
        page: int,
        x_coord: float,
        y_coord: float,
        width: float,
        height: float,
        field_type: str,
        commit: bool = True
    ) -> SignatureField:
        """Add a signature field to a document"""
        signature_field = SignatureField(
            document_id=document_id,
            signer_id=signer_id,
            page=page,
            x_coord=x_coord,
            y_coord=y_coord,
            width=width,
            height=height,
            field_type=field_type
        )
        DocumentDAO.db.add(signature_field)
        if commit:
            DocumentDAO.db.commit()
        return signature_field

    @staticmethod
    async def create_signing_session(
        document_id: str,
        expires_at: datetime,
        status: str,
        signer_email: str,
        commit: bool = True
    ) -> SigningSession:
        """Create a new signing session"""
        signing_session = SigningSession(
            document_id=document_id,
            created_at=datetime.utcnow(),
            expires_at=expires_at,
            status=status,
            signer_email=signer_email
        )
        DocumentDAO.db.add(signing_session)
        if commit:
            DocumentDAO.db.commit()
        return signing_session

    @staticmethod
    async def update_signing_session(
        session_id: str,
        status: Optional[str] = None,
        completed_at: Optional[datetime] = None,
        commit: bool = True
    ) -> SigningSession:
        """Update a signing session"""
        session = DocumentDAO.db.query(SigningSession).filter(SigningSession.id == session_id).first()
        if status:
            session.status = status
        if completed_at:
            session.completed_at = completed_at

        if commit:
            DocumentDAO.db.commit()
        return session

    @staticmethod
    def get_signature_audits(document_id: str) -> List[SignatureAudit]:
        """Get all signature audits for a document"""
        return DocumentDAO.db.query(SignatureAudit).filter(SignatureAudit.document_id == document_id).all()

    @staticmethod
    async def create_signature_audit(
        document_id: str,
        signer_id: str,
        signer_email: str,
        signer_name: str,
        action: str,
        ip_address: str,
        user_agent: str,
        commit: bool = True
    ) -> SignatureAudit:
        """Create a signature audit record"""
        audit = SignatureAudit(
            document_id=document_id,
            signer_id=signer_id,
            signer_email=signer_email,
            signer_name=signer_name,
            action=action,
            ip_address=ip_address,
            user_agent=user_agent,
            timestamp=datetime.utcnow()
        )
        DocumentDAO.db.add(audit)
        if commit:
            DocumentDAO.db.commit()
        # DocumentDAO.db.refresh(audit)
        return audit

    @staticmethod
    async def _store_pdf_file(pdf_file: UploadFile) -> str:
        """
        Helper method to store PDF file
        Returns the storage path/identifier
        """
        # Implement your file storage logic here
        # This could save to local filesystem, cloud storage, etc.
        pass


    @staticmethod
    async def create_pdf_file(
        document_id: str,
        file_data: bytes,
        file_size: int,
        version: int = 1,
        meta_data: Optional[dict] = None,
        commit: bool = True
    ) -> PDFFile:
        md5_hash = md5(file_data).hexdigest()

        """Create a new PDF file record in the database"""
        pdf_file = PDFFile(
            document_id=document_id,
            file_size=file_size,
            version=version,
            meta_data=meta_data,
            file_data=file_data,
            md5_hash=md5_hash,
            created_at=datetime.utcnow()
        )
        DocumentDAO.db.add(pdf_file)
        if commit:
            DocumentDAO.db.commit()

        return pdf_file

    @staticmethod
    def get_pdf_file(
        file_id: str
    ) -> Optional[PDFFile]:
        """Retrieve a PDF file by ID"""
        return DocumentDAO.db.query(PDFFile).filter(PDFFile.id == file_id).first()

    @staticmethod
    async def get_document_pdf_files(
        document_id: str,
        latest_only: bool = False
    ) -> List[PDFFile]:
        """Retrieve all PDF files for a document"""
        query = DocumentDAO.db.query(PDFFile).filter(PDFFile.document_id == document_id)
        if latest_only:
            query = query.order_by(PDFFile.version.desc()).limit(1)
        return query.all()

    @staticmethod
    async def update_pdf_file(
        file_id: str,
        file_path: Optional[str] = None,
        file_size: Optional[int] = None,
        meta_data: Optional[dict] = None,
        commit: bool = True
    ) -> PDFFile:
        """Update a PDF file's attributes"""
        pdf_file = await DocumentDAO.get_pdf_file(file_id)
        if file_path:
            pdf_file.file_path = file_path
        if file_size:
            pdf_file.file_size = file_size
        if meta_data:
            pdf_file.meta_data = meta_data

        pdf_file.updated_at = datetime.utcnow()
        if commit:
            DocumentDAO.db.commit()
        return pdf_file

    @staticmethod
    async def delete_pdf_file(file_id: str, commit: bool = True) -> None:
        """Delete a PDF file record"""
        pdf_file = await DocumentDAO.get_pdf_file(file_id)
        await DocumentDAO.db.delete(pdf_file)
        if commit:
            DocumentDAO.db.commit()

    @staticmethod
    async def create_signature_in_pdf(pdf_file_id, signer_id, sign_type, page, x, y, width, height, signature_image, commit=True):
        """
        Create a new SignatureInPDF record in the database.

        Args:
            pdf_file_id: ID of the PDF file
            signer_id: ID of the signer
            page: Page number where signature is placed
            x: X-coordinate of signature placement
            y: Y-coordinate of signature placement
            width: Width of signature
            height: Height of signature
            signature_image: Binary data of signature image

        Returns:
            The created SignatureInPDF instance
        """

        signature = SignatureInPDF(
            pdf_file_id=pdf_file_id,
            signer_id=signer_id,
            page=page,
            x=x,
            y=y,
            width=width,
            height=height,
            signature_image=signature_image,
            sign_type=sign_type
        )

        DocumentDAO.db.add(signature)
        if commit:
            DocumentDAO.db.commit()
        return signature

    @staticmethod
    async def update_signature_images_with_signed(signature_ids, signature_image_base64s, commit=True):
        """
        Update signature images in SignatureInPDF record in the database, which
        has the signature_id.

        Args:
            signature_ids: ID of the signature
            signature_image: Binary data of signature image

        Returns:
            The created SignatureInPDF instance
        """
        for signature_id, signature_image_base64 in zip(signature_ids, signature_image_base64s):
            signature = DocumentDAO.db.query(SignatureInPDF).filter(SignatureInPDF.id == signature_id).first()
            signature.signature_image = signature_image_base64
            signature.signed = True
        if commit:
            DocumentDAO.db.commit()
        return signature



    @staticmethod
    def get_signatures_in_pdf(
        pdf_file_id: str,
        latest_only: bool = False
    ) -> List[SignatureInPDF]:
        """Retrieve all PDF files for a document"""
        query = DocumentDAO.db.query(SignatureInPDF).filter(SignatureInPDF.pdf_file_id == pdf_file_id)
        if latest_only:
            query = query.order_by(PDFFile.version.desc()).limit(1)
        return query.all()

    @staticmethod
    def get_signatures_in_pdf_by_signer_id(
        signer_id: str
    ) -> List[SignatureInPDF]:
        """Retrieve all signatures in a PDF by signer ID"""
        return DocumentDAO.db.query(SignatureInPDF).filter(SignatureInPDF.signer_id == signer_id).all()



    async def check_all_signed_in_audit_trail(document_id: str) -> bool:
        """Check if all signers have signed the document"""
        signers_count = DocumentDAO.db.query(Signer).filter(Signer.document_id == document_id).count()
        signed_signers_count = DocumentDAO.db.query(SignatureAudit.signer_id)\
            .filter(SignatureAudit.document_id == document_id,
                    SignatureAudit.action == "SIGNED")\
            .distinct()\
            .count()
        return signers_count > 0 and \
            signed_signers_count > 0 and \
            signers_count == signed_signers_count

    async def check_all_signed_in_signers(document_id: str) -> bool:
        """Check if all signers have signed the document"""
        signers = DocumentDAO.db.query(Signer).filter(Signer.document_id == document_id).all()
        all_signed = all(signer.signed_at is not None for signer in signers)
        return all_signed

    async def check_all_signed(document_id: str) -> bool:
        """Check if all signers have signed the document"""
        return await DocumentDAO.check_all_signed_in_audit_trail(document_id) and \
            await DocumentDAO.check_all_signed_in_signers(document_id)




    @staticmethod
    async def update_pdf_file_in_document(
        pdf_id: str,
        pdf_file: bytes,
        commit: bool = True
    ) -> None:
        """Update a pdf file in a document"""
        session = DocumentDAO.db.query(PDFFile).filter(PDFFile.id == pdf_id).update(
            {
                "file_data": pdf_file,
                "completed_at": datetime.utcnow()
            }
        )
        if commit:
            DocumentDAO.db.commit()
        return session

    @staticmethod
    def delete_stripe_document_meter(document_id: str, commit: bool = True) -> None:
        """Delete a stripe document meter record by document_id"""
        try:
            logger.debug(f"Attempting to delete StripeDocumentMeter for document_id: {document_id}")
            meter = DocumentDAO.db.query(StripeDocumentMeter).filter(StripeDocumentMeter.document_id == document_id).first()
            DocumentDAO.db.delete(meter)
            if commit:
                DocumentDAO.db.commit()
            logger.info(f"Successfully deleted StripeDocumentMeter for document_id: {document_id}")
        except Exception as e:
            logger.error(f"Error deleting StripeDocumentMeter for document_id {document_id}: {str(e)}", exc_info=True)
            if commit:
                DocumentDAO.db.rollback()
            # raise

    @staticmethod
    def delete_signing_pdf_file_queue(id: str, commit: bool = True) -> None:
        """Delete a stripe document meter record by document_id"""
        try:
            logger.debug(f"Attempting to delete SigningPdfFileQueue item for id: {id}")
            queue_item = DocumentDAO.db.query(SigningPDFFileQueue).filter(SigningPDFFileQueue.id == id).first()
            DocumentDAO.db.delete(queue_item)
            if commit:
                DocumentDAO.db.commit()
            logger.info(f"Successfully deleted SigningPdfFileQueue for id: {id}")
        except Exception as e:
            logger.error(f"Error deleting SigningPdfFileQueue for id {id}: {str(e)}", exc_info=True)
            if commit:
                DocumentDAO.db.rollback()


    @staticmethod
    async def cancel_and_delete_document(document_id: str) -> None:
        """Cancel and delete a document"""
        document = DocumentDAO.get_document(document_id)
        DocumentDAO.db.delete(document)
        DocumentDAO.db.commit()
