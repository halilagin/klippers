from app.service.pdf_service import text_to_image


def test_text_to_image():
    text = "John Doe"
    image = text_to_image(text)
    assert image is not None
    assert isinstance(image, bytes)
    assert len(image) > 0
    # assert image.startswith(b'\x89PNG')
    # assert image.endswith(b'IHDR')
    # assert image.endswith(b'IEND')

    # save the image to a file
    with open("/tmp/test_image.png", "wb") as f:
        f.write(image)