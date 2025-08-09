from ..db.model_document import User, Role, Group, UserVideo
from ..core.security import get_password_hash
from .database import SessionLocal
from datetime import datetime, timedelta, timezone

def seed_user_videos(db):
    """Seed user_videos table with sample data"""
    user_videos = [
        UserVideo(
            id="41f21be3-dcf1-4f7d-ba53-f79d7c7b925f",
            user_id="user123",
            video_id="f7143179-7169-44a0-8063-54f7af6adf79",
            processing_started_at=datetime(2025, 8, 8, 22, 33, 11),
            processing_completed_at=datetime(2025, 8, 8, 22, 40, 11),
            uploaded_at=datetime(2025, 8, 8, 14, 6, 9, 375327),
            created_at=datetime(2025, 8, 8, 14, 6, 9, 375330),
            status="completed",
            meta_data={}
        ),
        UserVideo(
            id="c207c9c0-5108-4c9f-8e6e-c08b38fc4cff",
            user_id="user123",
            video_id="fe80098a-f9b8-4a4a-8177-e657799bb59b",
            processing_started_at=datetime(2025, 8, 8, 22, 33, 11),
            processing_completed_at=datetime(2025, 8, 8, 22, 40, 17),
            uploaded_at=datetime(2025, 8, 8, 22, 24, 11, 473884),
            created_at=datetime(2025, 8, 8, 22, 24, 11, 473886),
            status="completed",
            meta_data={}
        ),
        UserVideo(
            id="30af39aa-f62f-4eeb-bf0d-4e3bf4507b96",
            user_id="user123",
            video_id="12fad16c-65c7-4b51-bfbe-6974225cfd83",
            processing_started_at=datetime(2025, 8, 8, 22, 33, 11),
            processing_completed_at=datetime(2025, 8, 8, 22, 40, 24),
            uploaded_at=datetime(2025, 8, 8, 22, 32, 37, 612461),
            created_at=datetime(2025, 8, 8, 22, 32, 37, 612463),
            status="completed",
            meta_data={}
        ),
        UserVideo(
            id="4e4c514d-ae2a-49c6-9ad9-78a3b60704ac",
            user_id="user123",
            video_id="8f283f57-9481-49b4-ac0c-9d0fc060015b",
            processing_started_at=datetime(2025, 8, 8, 22, 33, 11),
            processing_completed_at=datetime(2025, 8, 8, 22, 40, 46),
            uploaded_at=datetime(2025, 8, 8, 22, 17, 31, 453477),
            created_at=datetime(2025, 8, 8, 22, 17, 31, 453480),
            status="completed",
            meta_data={}
        )
    ]
    db.add_all(user_videos)
    


def seed_users(db):
    try:
        # Create roles
        admin_role = Role(name="admin")
        user_role = Role(name="user")
        db.add_all([admin_role, user_role])
        db.commit()

        # Create groups
        dev_group = Group(name="developers")
        test_group = Group(name="testers")
        db.add_all([dev_group, test_group])
        db.commit()

        # Create users
        users = [
            User(
                id="8c8ef5c7-f30e-44c4-a370-2011b837988d",
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_superuser=True,
            ),
            User(
                username="john_doe",
                email="john@example.com",
                hashed_password=get_password_hash("password123"),
                is_active=True,
            ),
            User(
                username="jane_doe",
                email="jane@example.com",
                hashed_password=get_password_hash("password456"),
                is_active=True,
            ),
            User(
                username="halilagintest",
                email="halil.agin+test@gmail.com",
                hashed_password=get_password_hash("123456"),
                is_active=True,
                subscription_id="sub_1RVEu3Gg0tCTvsYGY9Kh23RF",
                subscription_plan="VOLUME_BASED_PAYMENT",
                subscription_created_at=datetime.now(timezone.utc),
                subscription_updated_at=datetime.now(timezone.utc),
                subscription_expires_at=datetime.now(timezone.utc) + timedelta(days=365),
            ),
        ]
        db.add_all(users)
        db.commit()

        # Assign roles and groups
        admin_user = db.query(User).filter_by(username="admin").first()
        john_user = db.query(User).filter_by(username="john_doe").first()
        jane_user = db.query(User).filter_by(username="jane_doe").first()

        # Assign roles
        admin_user.roles.append(admin_role)
        john_user.roles.append(user_role)
        jane_user.roles.append(user_role)

        # Assign groups
        admin_user.groups.extend([dev_group, test_group])
        john_user.groups.append(dev_group)
        jane_user.groups.append(test_group)


    except Exception as e:
        print(f"Error seeding database: {e}")


def seed_database():
    db = SessionLocal()
    try:
        seed_users(db)
        seed_user_videos(db)
        db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()