from sqlalchemy.orm import Session

from app.models.user import User
from app.auth.hashing import Hash


def seed_admin(db: Session):

    admin = db.query(User).filter(
        User.email == "admin@yieldsense.ai"
    ).first()

    if admin:
        return

    admin = User(
        full_name="System Administrator",
        email="admin@yieldsense.ai",
        password=Hash.hash_password("Admin@123"),
        role="Admin",
        is_active=True,
    )

    db.add(admin)
    db.commit()

    print("Admin Created")