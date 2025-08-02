# from datetime import time
from datetime import datetime
import time
import uuid
import os
import logging
from app.dao.document_dao import DocumentDAO
# import app.config as appConfig
from app.db.database import SessionLocal

from app.db.model_document import SignedPDFFile, Signer, SignerEmailQueue, SigningPDFFileQueue
from app.service.pdf_pfx_sign import sign_pdf_with_certificate
import app.service.pdf_service as pdf_service





# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys



# --- Configure Logging for the Email Thread ---
log_file_name = 'pdf_signing.log'
logger = logging.getLogger('PdfSigningLogger')
logger.setLevel(logging.INFO)  # Set the minimum level to log

# Prevent adding multiple handlers if this module is reloaded somehow
if not logger.hasHandlers():
    # Create a file handler to write logs to a file
    file_handler = logging.FileHandler(log_file_name)

    # Create a formatter for the log messages
    formatter = logging.Formatter('%(asctime)s - [PID:%(process)d] - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    file_handler.setFormatter(formatter)

    # Add the handler to the logger
    logger.addHandler(file_handler)
# --- End Logging Configuration ---





def sing_pdf(doc_item: SigningPDFFileQueue):
    """
    Record stripe metered usage for a document

    Args:
        db: Database session
        document_id: ID of the document
        user_email: Email of the user
        quantity: Number of units to record (default 1)
    """
    logger.info(f"Starting pdf signing for document_id: {doc_item.document_id}")

    try:
        # Get the customer by email
        pdf_file = DocumentDAO.get_pdf_file(doc_item.pdf_id)
        if pdf_file is None:
            logger.error(f"PDF file not found for id: {doc_item.pdf_id}")
            raise Exception(f"PDF file not found for id: {doc_item.pdf_id}")


        pdf_content_with_signatures = pdf_service.place_signatures_in_pdf(doc_item.document_id)
        signature_audits = DocumentDAO.get_signature_audits(doc_item.document_id)
        final_pdf_content = pdf_service.write_signature_audits_to_pdf(pdf_content_with_signatures, signature_audits)
        signed_bytes_data = sign_pdf_with_certificate(final_pdf_content, doc_item.document_id)
        # with open("/tmp/signed_pdf.pdf", "wb") as f:
        #     f.write(pdf_content)
        # # print("pdf_content size:", pdf_content)

        DocumentDAO.db.add(SignedPDFFile(
            id=str(uuid.uuid4()),
            document_id=doc_item.document_id,
            pdf_id=doc_item.pdf_id,
            # file_data=pdf_file.file_data,
            file_data=signed_bytes_data,
            file_size=pdf_file.file_size,
            md5_hash=pdf_file.md5_hash,
            meta_data=pdf_file.meta_data,
            created_at=datetime.now(),
            uploaded_at=datetime.now(),
        ))


        signers = DocumentDAO.db.query(Signer).filter(Signer.document_id == doc_item.document_id).all()
        signer_email_queue_items = [
            SignerEmailQueue(
                id=str(uuid.uuid4()),
                signer_id=signer.id,
                email=signer.email,
                document_id=doc_item.document_id,
                email_type="signed_pdf_view",
                status="initial"
            )
            for signer in signers
        ]
        for signer_email_queue_item in signer_email_queue_items:
            DocumentDAO.db.add(signer_email_queue_item)

        return True

    except Exception as e:
        logger.error(f"Error recording meter: {str(e)}", exc_info=True)
        raise Exception(f"Error recording meter: {str(e)}")


def sign_pdfs_in_batches():
    """
    Send emails to signers in batches with explicit DB session
    """
    logger.info(f"Process {os.getpid()} - Attempting to sign the pdfs...")
    # Create a new DB session explicitly
    db = SessionLocal()
    try:
        # Set the session on DocumentDAO
        DocumentDAO.db = db
        signing_pdf_queue_items = DocumentDAO.get_signing_pdf_file_queue()
        logger.info(f"Found {len(signing_pdf_queue_items)} docs to send.")

        for index, doc_item in enumerate(signing_pdf_queue_items):
            if index == 0:
                logger.info(f" Process {os.getpid()} - Attempting to sign the pdf for document_id: {doc_item.document_id}...")
            try:
                sing_pdf(doc_item)
                DocumentDAO.delete_signing_pdf_file_queue(doc_item.id, commit=False)
                DocumentDAO.db.commit()
            except Exception as e:
                DocumentDAO.db.rollback()
                logger.error(f"An unexpected error occurred in stripe document meter loop: {e}", exc_info=True)
    finally:
        # Always close the DB session
        db.close()





def sign_pdfs_loop(interval_seconds: int):
    """
    Periodically sends a test email using credentials from environment variables.
    Logs output to the 'EmailThreadLogger'.
    """
    process_id = os.getpid()
    while True:
        logger.info(f"Process {process_id} checking for documents to send email for view of signed document...")
        sign_pdfs_in_batches()
        time.sleep(interval_seconds)

# Example Usage (Update credentials for Gmail)
if __name__ == "__main__":
    print("Starting PDF signing batch process...")
    sign_pdfs_in_batches()
    print("PDF signing batch process finished.")