from datetime import datetime
from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
# from sqlalchemy.ext.declarative import declarative_base
import sqlalchemy
import uuid
from enum import Enum

Base = sqlalchemy.orm.declarative_base()

class StripeDocumentMeter(Base):
    __tablename__ = 'stripe_document_meters'
    document_id = Column(String, primary_key=True)
    user_email = Column(String, nullable=False)
    subscription_id = Column(String, nullable=False)


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
    user_id = Column(String, nullable=False)
    video_id = Column(String, nullable=False)
    processing_started_at = Column(DateTime, nullable=True)
    processing_completed_at = Column(DateTime, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="uploaded")  # uploaded, processing, completed, failed
    meta_data = Column(JSON, default={})