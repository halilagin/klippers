from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr, ConfigDict

class SignatureField(BaseModel):
    id: str
    x: float
    y: float
    page: int
    width: float = 200
    height: float = 50
    signer_id: int

    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True
    )
class Signer(BaseModel):
    id: str
    email: EmailStr
    name: str
    signer_order: int = 0
    signed_at: Optional[datetime] = None
    document_id: str
    signature_fields: List[SignatureField] = []

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )


class PDFFileBase64(BaseModel):
    id: str
    document_id: str
    file_data_base64: str
    file_size: int
    version: int = 1
    uploaded_at: datetime
    created_at: datetime = datetime.utcnow()
    completed_at: Optional[datetime] = None
    md5_hash: str
    meta_data: Dict = {}

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )


class PDFFile(BaseModel):
    id: str
    document_id: str
    file_data: bytes
    file_size: int
    version: int = 1
    uploaded_at: datetime
    created_at: datetime = datetime.utcnow()
    completed_at: Optional[datetime] = None
    md5_hash: str
    meta_data: Dict = {}

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )

class Document(BaseModel):
    id: str
    user_id: str
    title: str
    status: str = "draft"
    created_at: datetime
    expires_at: Optional[datetime] = None
    created_by: str
    meta_data: Dict = {}
    signers: List[Signer] = []
    audit_trail: List["SignatureAudit"] = []
    pdf_file: Optional[PDFFile] = None

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )


class SigningSession(BaseModel):
    id: str
    document_id: str
    signer_email: str
    expires_at: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    uploaded_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    status: str = "draft"
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )


class SignatureAudit(BaseModel):
    id: str
    document_id: str
    signer_email: str
    signer_id: str
    signer_name: str
    action: str
    timestamp: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = datetime.utcnow()

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )

class SignatureInPDF(BaseModel):
    id: str
    pdf_file_id: str
    signer_id: str
    page: int
    x: float
    y: float
    width: float
    height: float
    signature_image: str
    sign_type: str = "signature"
    created_at: datetime
    uploaded_at: datetime
    signed: bool = False


    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )