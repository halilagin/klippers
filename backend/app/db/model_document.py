from datetime import datetime
from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
# from sqlalchemy.ext.declarative import declarative_base
import sqlalchemy
import uuid
from enum import Enum

Base = sqlalchemy.orm.declarative_base()


class SignatureField(Base):
    """SQLAlchemy model for signature field placement in document"""
    __tablename__ = 'signature_fields'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    page = Column(Integer, nullable=False)
    width = Column(Float, default=200)
    height = Column(Float, default=50)
    signer_id = Column(String, ForeignKey('signers.id'), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    signer = relationship("Signer", back_populates="signature_fields")


class SignerEmailQueue(Base):
    """SQLAlchemy model for signer email queue"""
    __tablename__ = 'signer_email_queue'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    signer_id = Column(String, nullable=False)
    email = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    email_type = Column(String, nullable=False, default="signer_email_queue")  # signer_email_queue, signed_pdf_view
    document_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Signer(Base):
    """SQLAlchemy model for document signer"""
    __tablename__ = 'signers'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
    signer_order = Column(Integer, default=1)
    signed_at = Column(DateTime, nullable=True, default=None)
    document_id = Column(String, ForeignKey('documents.id'), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="signers")
    signature_fields = relationship("SignatureField", back_populates="signer", cascade="all, delete-orphan")
    signatures_in_pdf = relationship("SignatureInPDF", back_populates="signer")

class PDFFile(Base):
    """SQLAlchemy model for storing PDF files"""
    __tablename__ = 'pdf_files'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey('documents.id'), nullable=False)
    file_data = Column(sqlalchemy.LargeBinary, nullable=False)  # For storing the actual PDF file
    file_size = Column(Integer, nullable=False)  # Size in bytes
    version = Column(Integer, nullable=False, default=1)  # Size in bytes
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    md5_hash = Column(String, nullable=False)  # Store hash for verification
    meta_data = Column(JSON, default={})
    document = relationship("Document", back_populates="pdf_file")
    signatures_in_pdf = relationship("SignatureInPDF", back_populates="pdf_file")


class SigningPDFFileQueue(Base):
    """SQLAlchemy model for storing Signing PDF files"""
    __tablename__ = 'signing_pdf_file_queue'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, nullable=False)
    pdf_id = Column(String, nullable=False)

class SignedPDFFile(Base):
    """SQLAlchemy model for storing Signed PDF files"""
    __tablename__ = 'signed_pdf_files'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, nullable=False)
    pdf_id = Column(String, nullable=False)
    file_data = Column(sqlalchemy.LargeBinary, nullable=False)  # For storing the actual PDF file
    file_size = Column(Integer, nullable=False)  # Size in bytes
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    md5_hash = Column(String, nullable=False)  # Store hash for verification
    meta_data = Column(JSON, default={})

class SignatureInPDF(Base):
    """SQLAlchemy model for signature in PDF"""
    __tablename__ = 'signature_in_pdfs'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    pdf_file_id = Column(String, ForeignKey('pdf_files.id'), nullable=False)
    signer_id = Column(String, ForeignKey('signers.id'), nullable=False)
    page = Column(Integer, nullable=False)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    sign_type = Column(String, nullable=True, default="Signature")
    signed = Column(Boolean, nullable=False, default=False)
    signature_image = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    pdf_file = relationship("PDFFile", back_populates="signatures_in_pdf")
    signer = relationship("Signer", back_populates="signatures_in_pdf")

class StripeDocumentMeter(Base):
    __tablename__ = 'stripe_document_meters'
    document_id = Column(String, primary_key=True)
    user_email = Column(String, nullable=False)
    subscription_id = Column(String, nullable=False)


class Document(Base):
    """SQLAlchemy model for document to be signed"""
    __tablename__ = 'documents'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    pdf_path = Column(String, nullable=False)
    status = Column(String, default="draft")
    created_at = Column(DateTime, default=datetime.utcnow)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    created_by = Column(String, nullable=False)
    meta_data = Column(JSON, default={})

    signers = relationship("Signer", back_populates="document", cascade="all, delete-orphan")
    audit_trail = relationship("SignatureAudit", back_populates="document", cascade="all, delete-orphan")
    pdf_file = relationship("PDFFile", back_populates="document", uselist=False, cascade="all, delete-orphan")
    user = relationship("User", back_populates="documents")


class SigningSession(Base):
    """SQLAlchemy model for active signing session"""
    __tablename__ = 'signing_sessions'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey('documents.id'), nullable=False)
    signer_email = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="draft")
    completed_at = Column(DateTime, default=None)

    document = relationship("Document")

class SignatureAudit(Base):
    """SQLAlchemy model for signature audit trail"""
    __tablename__ = 'signature_audits'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey('documents.id'), nullable=False)
    signer_id = Column(String, nullable=False)
    signer_email = Column(String, nullable=False)
    signer_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="audit_trail")

# Replace the association tables with class declarations
class UserRole(Base):
    """SQLAlchemy model for user-role association"""
    __tablename__ = 'user_roles'

    user_id = Column(String, ForeignKey('users.id'), primary_key=True)
    role_id = Column(Integer, ForeignKey('roles.id'), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserGroup(Base):
    """SQLAlchemy model for user-group association"""
    __tablename__ = 'user_groups'

    user_id = Column(String, ForeignKey('users.id'), primary_key=True)
    group_id = Column(Integer, ForeignKey('groups.id'), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)

    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    subscription_expires_at = Column(DateTime, nullable=True)
    subscription_status = Column(String, nullable=True)
    subscription_created_at = Column(DateTime, nullable=True)
    subscription_updated_at = Column(DateTime, nullable=True)
    subscription_plan = Column(String, nullable=True)  # PAY_AS_YOU_GO, MONTHLY_PAYMENT, VOLUME_BASED_PAYMENT
    subscription_id = Column(String, nullable=True)

    # Update relationship references to use the new association classes
    roles = relationship("Role", secondary="user_roles", back_populates="users")
    groups = relationship("Group", secondary="user_groups", back_populates="users")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    permissions = Column(String)  # Store permissions as JSON string
    users = relationship("User", secondary="user_roles", back_populates="roles")


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    users = relationship("User", secondary="user_groups", back_populates="groups")


class UserVideoStatus(Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class UserVideo(Base):
    """SQLAlchemy model for signature field placement in document"""
    __tablename__ = 'user_videos'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String,  nullable=False)
    video_id = Column(String, nullable=False)
    processing_started_at = Column(DateTime, nullable=True)
    processing_completed_at = Column(DateTime, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="uploaded")  # uploaded, processing, completed, failed
    meta_data = Column(JSON, default={})