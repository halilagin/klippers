from ..db.model_document import User, Role, Group
from ..core.security import get_password_hash
from .database import SessionLocal
from datetime import datetime, timedelta, timezone
def seed_database():
    db = SessionLocal()
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

        db.commit()

        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()