import base64

import uuid
# from fastapi.testclient import TestClient
from datetime import datetime, timedelta

# from app.db.database import Base, engine
# from app.db.seed import seed_database
# import app.schemas.schema_document as schema_document


# Test document creation
def test_create_document(client, auth_headers, sample_user):
    # Create a test PDF file
    # pdf_content = b"%PDF-1.5\nTest PDF content"
    # files = {"pdf_file": ("test.pdf", BytesIO(pdf_content), "application/pdf")}
    data = {
        "title": "Test Document",
        "created_by": sample_user.email,
        "status": "draft"
    }

    response = client.post(
        "/api/v1/documents/",
        json=data,
        headers=auth_headers
    )

    if response.status_code != 200:
        print(f"Error Status Code: {response.status_code}")
        try:
            error_json = response.json()
            print(f"Error JSON: {error_json}")
        except Exception:
            print("Could not parse error response as JSON")

    print(f"Response: {response.json()}")
    assert response.status_code == 200
    result = response.json()
    # assert result["title"] == "Test Document"
    # assert result["created_by"] == sample_user.email
    # assert result["status"] == "draft"
    # assert "id" in result
    return result["message"]

# Test adding PDF file to document
def test_add_pdf_file(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document
    document_id = test_create_document(client, auth_headers, sample_user)
    assert document_id is not None

    pdf_content = true_pdf_sample
    import base64
    pdf_content_base64 = base64.b64encode(pdf_content).decode('utf-8')

    # Now add another PDF file to the document
    data = {
        "id": str(uuid.uuid4()),
        "document_id": document_id,
        "file_data_base64": pdf_content_base64,
        "file_size": 1024,
        "md5_hash": "1234567890",
        "uploaded_at": datetime.now().isoformat()  # Add this required field
    }

    response = client.post(
        f"/api/v1/documents/{document_id}/pdf",
        json=data,
        headers=auth_headers
    )

    if response.status_code != 200:
        print(f"Error Status Code: {response.status_code}")
        try:
            error_json = response.json()
            print(f"Error JSON: {error_json}")
        except Exception:
            print("Could not parse error response as JSON")

    assert response.status_code == 200
    result = response.json()
    # assert result["filename"] == "additional.pdf"
    # assert result["document_id"] == document_id

    return document_id, result["message"]

# Test updating document
def test_update_document(client, auth_headers, sample_user):
    # First create a document
    document_id = test_create_document(client, auth_headers, sample_user)

    # Update the document
    update_data = {
        "status": "active",
        "meta_data": {"key": "value", "tags": ["important", "contract"]}
    }
    response = client.post(
        f"/api/v1/documents/{document_id}",
        json=update_data,
        headers=auth_headers
    )

    if response.status_code != 200:
        print(f"Error Status Code: {response.status_code}")
        try:
            error_json = response.json()
            print(f"Error JSON: {error_json}")
        except Exception:
            print("Could not parse error response as JSON")

    assert response.status_code == 200
    return document_id, response.json()

# Test getting document by ID
def test_get_document(client, auth_headers, sample_user):
    # First create a document
    document_id = test_create_document(client, auth_headers, sample_user)
    # Get the document
    response = client.get(
        f"/api/v1/documents/{document_id}",
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert result["id"] == document_id

    # Test non-existent document
    response = client.get(
        f"/api/v1/documents/9999",
        headers=auth_headers
    )
    assert response.status_code == 404
    return document_id, result

# Test getting document PDF files
def test_get_document_pdf_files(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document
    document_id, pdf_file_id = test_add_pdf_file(client, auth_headers, true_pdf_sample, sample_user)

    # Get the document's PDF files
    response = client.get(
        f"/api/v1/documents/{document_id}/pdf-files",
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert isinstance(result, list)
    assert len(result) > 0
    assert result[0]["document_id"] == document_id

    return document_id, result

# Test creating a signer
def test_create_signer(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document
    document_id, pdf_file_id = test_add_pdf_file(client, auth_headers, true_pdf_sample, sample_user)

    # Add a signer
    signer_data = {
        "email": "signer@example.com",
        "name": "Test Signer",
        "order": 1
    }
    response = client.post(
        f"/api/v1/documents/{document_id}/signers",
        json=signer_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert result["email"] == "signer@example.com"
    assert result["name"] == "Test Signer"
    assert result["signer_order"] == 1
    assert result["document_id"] == document_id

    return document_id, result["id"], pdf_file_id

# Test creating signature placement
def test_create_signature_in_pdf(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document with a signer
    document_id, signer_id, pdf_file_id = test_create_signer(client, auth_headers, true_pdf_sample, sample_user)
    assert isinstance(signer_id, str)
    assert isinstance(pdf_file_id, str)
    # Create signature placement
    signature_data = {
        "signer_id": signer_id,
        "page": 1,
        "x": 100.0,
        "y": 100.0,
        "width": 200.0,
        "height": 50.0,
        "signature_image": base64.b64encode(b"Sample signature image data").decode('utf-8'),  # Base64 encoded image data
        "sign_type": "signature"
    }
    response = client.post(
        f"/api/v1/documents/pdf-files/{pdf_file_id}/signatures",
        json=signature_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert "message" in result
    return document_id, signer_id, pdf_file_id, result["message"]

# Test creating signing session
def test_create_signing_session(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document
    document_id, pdf_file_id = test_add_pdf_file(client, auth_headers, true_pdf_sample, sample_user)

    # Create signing session
    expires_at = (datetime.now() + timedelta(days=7)).isoformat()
    session_data = {
        "expires_at": expires_at,
        "status": "ACTIVE",
        "signer_email": "signer@example.com"
    }
    response = client.post(
        f"/api/v1/documents/{document_id}/signing-sessions",
        json=session_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert result["document_id"] == document_id
    assert result["status"] == "ACTIVE"
    assert "id" in result
    return document_id, result["id"]

# Test updating signing session
def test_update_signing_session(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document and signing session
    document_id, pdf_file_id = test_add_pdf_file(client, auth_headers, true_pdf_sample, sample_user)

    # Create signing session
    expires_at = (datetime.now() + timedelta(days=7)).isoformat()
    session_data = {
        "expires_at": expires_at,
        "status": "ACTIVE",
        "signer_email": "signer@example.com"
    }
    session_response = client.post(
        f"/api/v1/documents/{document_id}/signing-sessions",
        json=session_data,
        headers=auth_headers
    )
    session_id = session_response.json()["id"]
    # Update signing session
    completed_at = datetime.now().isoformat()
    update_data = {
        "status": "COMPLETED",
        "completed_at": completed_at
    }
    response = client.put(
        f"/api/v1/documents/signing-sessions/{session_id}",
        json=update_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert result["id"] == session_id
    assert result["status"] == "COMPLETED"
    assert result["completed_at"] is not None

# Test creating signature audit
def test_create_signature_audit(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document with a signer
    document_id, signer_id, pdf_file_id = test_create_signer(client, auth_headers, true_pdf_sample, sample_user)

    # Create signature audit
    audit_data = {
        "signer_id": signer_id,
        "signer_email": "signer@example.com",
        "signer_name": "Test Signer",
        "action": "VIEWED",
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    response = client.post(
        f"/api/v1/documents/{document_id}/signature-audits",
        json=audit_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert result["document_id"] == document_id
    assert result["signer_id"] == signer_id
    assert result["action"] == "VIEWED"
    assert result["ip_address"] == "192.168.1.1"
    return document_id, signer_id, result["id"]


# Test getting signature audits
def test_get_signature_audits(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document with a signer and audit
    document_id, signer_id, audit_id = test_create_signature_audit(client, auth_headers, true_pdf_sample, sample_user)

    # Get signature audits
    response = client.get(
        f"/api/v1/documents/{document_id}/signature-audits",
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert isinstance(result, list)
    assert len(result) > 0
    assert result[0]["document_id"] == document_id
    assert result[0]["signer_id"] == signer_id
    assert result[0]["id"] == audit_id
    assert result[0]["action"] == "VIEWED"



# Test checking if all signed
def test_check_all_signed(client, auth_headers, true_pdf_sample, sample_user):
    # First create a document
    document_id, signer_id, audit_id = test_create_signature_audit(client, auth_headers, true_pdf_sample, sample_user)


    # Check if all signed
    response = client.get(
        f"/api/v1/documents/{document_id}/check-all-signed",
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    assert "all_signed" in result
    assert isinstance(result["all_signed"], bool)


def test_get_user_documents(client, auth_headers, sample_user):
    response = client.get(
        f"/api/v1/auth/me",
        headers=auth_headers
    )
    me = response.json()

    response = client.post(
        f"/api/v1/documents/list/my-documents",
        headers=auth_headers
    )
    assert response.status_code == 200
    result = response.json()
    # print(f"Result: {result}")
    assert isinstance(result, list)
    assert len(result) > 0
    assert result[0]["user_id"] == me["id"]
    # assert result[0]["id"] == document_id



# # Test placing signatures in PDF
# def test_place_signatures_in_pdf(client, auth_headers, true_pdf_sample):
#     # First create a document with a signer and signature placement
#     # document_id, signer_id, audit_id = test_create_signature_audit(client, auth_headers)
#     document_id, signer_id, pdf_file_id, signature_id = test_create_signature_in_pdf(client, auth_headers, true_pdf_sample)

#     # Place signatures
#     response = client.post(
#         f"/api/v1/documents/{document_id}/place-signatures",
#         headers=auth_headers
#     )
#     assert response.status_code == 200
#     result = response.json()
#     assert "message" in result
#     assert "Signatures placed" in result["message"]
