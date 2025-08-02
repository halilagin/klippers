import base64
import copy
from typing import List
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from io import BytesIO
import tempfile
from PIL import Image

from app.dao.document_dao import DocumentDAO
from app.db.model_document import PDFFile, SignatureAudit, SignatureInPDF
import uuid
from PIL import Image, ImageDraw





def put_image_in_pdf(pdf_file: bytes, image_file_base64: str, page_number: int = 0, x_position: float = 0, y_position: float = 0, width: float = None, height: float = None) -> bytes:
    """
    Put an image (preserving transparency) into the PDF bytes at the specified page and position.
    Takes PDF bytes and base64 image string as input, returns modified PDF bytes.

    :param pdf_file: Input PDF file content as bytes.
    :param image_file_base64: Base64 encoded string of the image file.
    :param page_no: Page number to put the image on (0-based index).
    :param x_position: X coordinate for the bottom-left corner of the image (from bottom-left).
    :param y_position: Y coordinate for the bottom-left corner of the image (from bottom-left).
    :param width: Width of the image on the PDF. Uses original if None.
    :param height: Height of the image on the PDF. Uses original if None.
    :return: Output PDF file content as bytes.
    """
    try:
        page_no = page_number - 1
        # 1. Decode the base64 image string
        try:
            # Handle potential data URI prefix (e.g., "data:image/png;base64,")
            if ',' in image_file_base64:
                header, encoded = image_file_base64.split(',', 1)
                image_file_bytes = base64.b64decode(encoded)
            else:
                # Assume it's just the base64 string
                image_file_bytes = base64.b64decode(image_file_base64)
        except (base64.binascii.Error, ValueError) as decode_error:
            raise ValueError(f"Invalid base64 image string: {decode_error}") from decode_error

        # 2. Read the input PDF bytes
        reader = PdfReader(BytesIO(pdf_file))
        num_pages = len(reader.pages)
        if not (0 <= page_no < num_pages):
            raise ValueError(f"Invalid page number: {page_no}. PDF has {num_pages} pages (0-based index).")
        target_page = reader.pages[page_no]  # Use 0-based index
        # Get page dimensions
        page_width = float(target_page.mediabox.width)
        page_height = float(target_page.mediabox.height)

        # 3. Prepare the overlay PDF with the image
        packet = BytesIO()
        # Create canvas with the exact dimensions of the target page
        img_canvas = canvas.Canvas(packet, pagesize=(page_width, page_height))

        # 4. Load the image with Pillow and check for alpha
        image = Image.open(BytesIO(image_file_bytes))
        has_alpha = image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info)

        # 5. Prepare image bytes in PNG format for ReportLab
        image_bytes_for_reader = BytesIO()
        image.save(image_bytes_for_reader, format='PNG')
        image_bytes_for_reader.seek(0)

        # 6. Use ReportLab's ImageReader
        img = ImageReader(image_bytes_for_reader)

        # 7. Determine drawing dimensions
        img_width_orig, img_height_orig = image.size
        draw_width = width if width is not None else img_width_orig
        draw_height = height if height is not None else img_height_orig

        # NEW: Transform Y-coordinate
        # y_position is assumed to be from top-left (browser)
        # page_height is from PyPDF2 (mediabox.height)
        # draw_height is the actual height of the image to be placed
        y_position_for_pdf = page_height - y_position - draw_height
        x_position_for_pdf = x_position * 1


        # 8. Draw the image on the overlay canvas
        # Use y_position_for_pdf instead of y_position
        if has_alpha:
            img_canvas.drawImage(img, x_position_for_pdf, y_position_for_pdf, width=draw_width, height=draw_height, mask='auto')
        else:
            img_canvas.drawImage(img, x_position_for_pdf, y_position_for_pdf, width=draw_width, height=draw_height)

        # 9. Save the overlay canvas
        img_canvas.save()
        packet.seek(0)

        # 10. Read the overlay PDF
        overlay_pdf = PdfReader(packet)
        overlay_page = overlay_pdf.pages[0]

        # 11. Merge the overlay onto the target page
        target_page.merge_page(overlay_page)  # Modifies target_page in memory

        # 12. Write the modified PDF to an output BytesIO buffer
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        output_buffer = BytesIO()
        writer.write(output_buffer)
        output_buffer.seek(0)

        # 13. Return the bytes of the modified PDF
        return output_buffer.getvalue()

    except ValueError as ve:
        print(f"Configuration Error: {ve}")
        raise
    except Exception as e:
        print(f"An unexpected error occurred while processing the PDF: {e}")
        # Consider logging the full traceback here
        # import traceback
        # traceback.print_exc()
        raise




def text_to_image(text: str) -> bytes:
    """
    Convert text to a transparent image with black text and return as PNG bytes.
    
    Args:
        text: The text to convert to an image
        
    Returns:
        PNG image bytes with transparent background
    """
    # Create a BytesIO buffer to hold the image data
    buffer = BytesIO()
    
    # Create an image with a reasonable size and transparent background
    # Adjust dimensions based on text length for better appearance
    text_length = len(text)
    width = max(200, text_length * 12)  # Minimum width of 200, scale with text length
    height = 40  # Fixed height
    
    # Create image with transparent background using RGBA mode
    image = Image.new('RGBA', (width, height), color=(0, 0, 0, 0))  # Transparent background
    
    # Add text to the image
    draw = ImageDraw.Draw(image)
    # Position text with some padding from edges, use black color
    draw.text((10, 10), text, fill=(0, 0, 0, 255))  # Black text with full opacity
    
    # Save image as PNG to buffer
    image.save(buffer, format='PNG')
    buffer.seek(0)
    
    # Return the PNG bytes
    return buffer.getvalue()


def put_text_in_pdf(pdf_file: bytes, text: str, page_number: int = 0, x_position: float = 0, y_position: float = 0, width: float = None, height: float = None) -> bytes:
    """
    Put an image (preserving transparency) into the PDF bytes at the specified page and position.
    Takes PDF bytes and base64 image string as input, returns modified PDF bytes.

    :param pdf_file: Input PDF file content as bytes.
    :param image_file_base64: Base64 encoded string of the image file.
    :param page_no: Page number to put the image on (0-based index).
    :param x_position: X coordinate for the bottom-left corner of the image (from bottom-left).
    :param y_position: Y coordinate for the bottom-left corner of the image (from bottom-left).
    :param width: Width of the image on the PDF. Uses original if None.
    :param height: Height of the image on the PDF. Uses original if None.
    :return: Output PDF file content as bytes.
    """
    try:
        page_no = page_number - 1
       

        # 2. Read the input PDF bytes
        reader = PdfReader(BytesIO(pdf_file))
        num_pages = len(reader.pages)
        if not (0 <= page_no < num_pages):
            raise ValueError(f"Invalid page number: {page_no}. PDF has {num_pages} pages (0-based index).")
        target_page = reader.pages[page_no]  # Use 0-based index
        # Get page dimensions
        page_width = float(target_page.mediabox.width)
        page_height = float(target_page.mediabox.height)

        # 3. Prepare the overlay PDF with the image
        packet = BytesIO()
        # Create canvas with the exact dimensions of the target page
        img_canvas = canvas.Canvas(packet, pagesize=(page_width, page_height))

        # 4. Load the image with Pillow and check for alpha
        image_bytes = text_to_image(text)
        image = Image.open(BytesIO(image_bytes))
        has_alpha = image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info)

        # 5. Prepare image bytes in PNG format for ReportLab
        image_bytes_for_reader = BytesIO()
        image.save(image_bytes_for_reader, format='PNG')
        image_bytes_for_reader.seek(0)

        # 6. Use ReportLab's ImageReader
        img = ImageReader(image_bytes_for_reader)

        # 7. Determine drawing dimensions
        img_width_orig, img_height_orig = image.size
        draw_width = width if width is not None else img_width_orig
        draw_height = height if height is not None else img_height_orig

        # NEW: Transform Y-coordinate
        # y_position is assumed to be from top-left (browser)
        # page_height is from PyPDF2 (mediabox.height)
        # draw_height is the actual height of the image to be placed
        y_position_for_pdf = page_height - y_position - draw_height
        x_position_for_pdf = x_position * 1


        # 8. Draw the image on the overlay canvas
        # Use y_position_for_pdf instead of y_position
        if has_alpha:
            img_canvas.drawImage(img, x_position_for_pdf, y_position_for_pdf, width=draw_width, height=draw_height, mask='auto')
        else:
            img_canvas.drawImage(img, x_position_for_pdf, y_position_for_pdf, width=draw_width, height=draw_height)

        # 9. Save the overlay canvas
        img_canvas.save()
        packet.seek(0)

        # 10. Read the overlay PDF
        overlay_pdf = PdfReader(packet)
        overlay_page = overlay_pdf.pages[0]

        # 11. Merge the overlay onto the target page
        target_page.merge_page(overlay_page)  # Modifies target_page in memory

        # 12. Write the modified PDF to an output BytesIO buffer
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        output_buffer = BytesIO()
        writer.write(output_buffer)
        output_buffer.seek(0)

        # 13. Return the bytes of the modified PDF
        return output_buffer.getvalue()

    except ValueError as ve:
        print(f"Configuration Error: {ve}")
        raise
    except Exception as e:
        print(f"An unexpected error occurred while processing the PDF: {e}")
        # Consider logging the full traceback here
        # import traceback
        # traceback.print_exc()
        raise



def put_signatures_in_pdf(pdf_file: bytes, signatures: List[SignatureInPDF]) -> bytes:
    """
    Put signatures in the PDF file at the specified page and position.
    """

    assert len(signatures) > 0
    processed_pdf = copy.deepcopy(pdf_file)
    for signature in signatures:
        if signature.sign_type.lower() == "signature":
            processed_pdf = put_image_in_pdf(processed_pdf, signature.signature_image, signature.page, signature.x, signature.y, signature.width, signature.height)
        else:
            processed_pdf = put_text_in_pdf(processed_pdf, signature.signature_image, signature.page, signature.x, signature.y, signature.width, signature.height)
        # elif signature.sign_type.lower() == "date":
    return processed_pdf


def place_signatures_in_pdf(document_id: str):
    """
    Place a signature in the PDF file at the specified page and position.
    """

    document = DocumentDAO.get_document(document_id)
    pdf_file: PDFFile = DocumentDAO.get_pdf_file(document.pdf_file.id)
    if pdf_file is None:
        raise Exception(message="PDF file not found")

    signatures = DocumentDAO.get_signatures_in_pdf(document.pdf_file.id)
    assert len(signatures) > 0
    return put_signatures_in_pdf(pdf_file.file_data, signatures)


async def save_signed_pdf_in_db(document_id: str, pdf_file: bytes):
    """
    Save the signed PDF file to the database.
    """
    # signed_pdf_file_content = place_signatures_in_pdf(document_id)
    await DocumentDAO.update_pdf_file_in_document(document_id, pdf_file)

def save_signed_pdf_in_file(file_path: str, pdf_file: bytes):
    """
    Save the signed PDF file to a file.
    """
    if file_path is None:
        file_path = f"/tmp/signed_pdf-{uuid.uuid4()}.pdf"
    with open(file_path, "wb") as f:
        f.write(pdf_file)


def write_signature_audits_to_pdf(pdf_file: bytes, signature_audits: List[SignatureAudit]) -> bytes:
    """
    Write signature audits to the PDF file by adding a new page at the end with audit information.

    Args:
        pdf_file: PDF file as bytes
        signature_audits: List of SignatureAudit objects to include in the audit page

    Returns:
        Modified PDF file as bytes with audit page added
    """
    # Read the original PDF
    pdf_reader = PdfReader(BytesIO(pdf_file))
    pdf_writer = PdfWriter()

    # Copy all existing pages
    for page in pdf_reader.pages:
        pdf_writer.add_page(page)

    # Create a new page for audit information
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_audit_page:
        # Use A4 size for the audit page (or match the size of the last page if needed)
        page_width, page_height = 595, 842  # A4 size in points

        # Create a canvas for the audit page
        audit_canvas = canvas.Canvas(temp_audit_page.name, pagesize=(page_width, page_height))

        # Add title
        audit_canvas.setFont("Helvetica-Bold", 16)
        audit_canvas.drawString(50, page_height - 50, "Signature Audit Log")

        # Add audit entries
        audit_canvas.setFont("Helvetica", 12)
        y_position = page_height - 80

        for i, audit in enumerate(signature_audits, 1):
            # Format the audit information

            timestamp_text = f"   Timestamp: {audit.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
            audit_canvas.drawString(70, y_position, timestamp_text)
            y_position -= 20

            audit_text = f"{i}. Signer: {audit.signer_name} ({audit.signer_email})"
            audit_canvas.drawString(50, y_position, audit_text)
            y_position -= 20

            audit_text = f"{i}. Action: {audit.action}"
            audit_canvas.drawString(50, y_position, audit_text)
            y_position -= 20

            user_agent_text = f"   User Agent: {audit.user_agent}"
            audit_canvas.drawString(70, y_position, user_agent_text)
            y_position -= 20

            ip_text = f"   IP Address: {audit.ip_address}"
            audit_canvas.drawString(70, y_position, ip_text)
            y_position -= 35  # Extra space between entries

            # If we're running out of space, start a new column or page
            if y_position < 50:
                y_position = page_height - 80

        audit_canvas.save()

        # Add the audit page to the PDF
        audit_reader = PdfReader(temp_audit_page.name)
        pdf_writer.add_page(audit_reader.pages[0])

    # Write the modified PDF to bytes
    output_pdf = BytesIO()
    pdf_writer.write(output_pdf)
    output_pdf.seek(0)

    return output_pdf.read()
