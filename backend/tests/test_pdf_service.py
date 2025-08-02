import pytest
from io import BytesIO

from app.service.pdf_service import put_image_in_pdf
from PyPDF2 import PdfReader




def test_put_image_in_pdf(true_pdf_sample, true_signature_image):
    """Test that an image can be inserted into a PDF."""
    # Arrange
    pdf_bytes = true_pdf_sample
    image_base64 = true_signature_image

    # Act
    result = put_image_in_pdf(
        pdf_file=pdf_bytes,
        image_file_base64=image_base64,
        page_number=1,
        x_position=50,
        y_position=50,
        width=100,
        height=100
    )

    # Assert
    assert result is not None
    assert isinstance(result, bytes)

    # Verify the result is a valid PDF
    reader = PdfReader(BytesIO(result))
    assert len(reader.pages) > 0

    # We can't easily check the image content directly in the PDF,
    # but we can verify the PDF was modified by checking its size
    # assert len(result) > len(pdf_bytes), "Modified PDF should be larger than original"


def test_save_pdf_to_file(true_pdf_sample, true_signature_image):
    """Test that a PDF can be saved to a file."""
    # Arrange
    pdf_bytes = true_pdf_sample
    image_base64 = true_signature_image

    # Act
    result = put_image_in_pdf(
        pdf_file=pdf_bytes,
        image_file_base64=image_base64,
        page_number=1,
        x_position=50,
        y_position=50
    )

    # Save the result to a file
    with open('/tmp/test_output.pdf', 'wb') as f:
        f.write(result)


def test_put_image_in_pdf_without_dimensions(true_pdf_sample, true_signature_image):
    """Test that an image can be inserted with default dimensions."""
    # Arrange
    pdf_bytes = true_pdf_sample
    image_base64 = true_signature_image

    # Act
    result = put_image_in_pdf(
        pdf_file=pdf_bytes,
        image_file_base64=image_base64,
        page_number=1,
        x_position=50,
        y_position=50
    )

    # Assert
    assert result is not None
    assert isinstance(result, bytes)

    # Verify the result is a valid PDF
    reader = PdfReader(BytesIO(result))
    assert len(reader.pages) > 0


def test_put_image_in_pdf_invalid_page(true_pdf_sample, true_signature_image):
    """Test that an exception is raised when an invalid page number is provided."""
    # Arrange
    pdf_bytes = true_pdf_sample
    image_base64 = true_signature_image

    # Act & Assert
    with pytest.raises(ValueError):
        put_image_in_pdf(
            pdf_file=pdf_bytes,
            image_file_base64=image_base64,
            page_number=999,  # Invalid page number
            x_position=50,
            y_position=50
        )
