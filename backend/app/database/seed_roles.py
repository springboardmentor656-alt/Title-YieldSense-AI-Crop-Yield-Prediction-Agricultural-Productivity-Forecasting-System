from sqlalchemy.orm import Session

from app.models.role import Role


def seed_roles(db: Session):

    roles = [
    {
        "name": "Administrator",
        "description": "System Administrator"
    },
    {
        "name": "Farmer",
        "description": "Farm Owner"
    },
    {
        "name": "Agriculture Department",
        "description": "Government Agriculture Department"
    },
    {
        "name": "Agri Consultant",
        "description": "Agricultural Consultant"
    },
    {
        "name": "Researcher",
        "description": "Agricultural Research"
    },
]


    for role in roles:

        exists = (
            db.query(Role)
            .filter(Role.name == role["name"])
            .first()
        )

        if exists:
            continue

        db.add(Role(**role))

    db.commit()

    print("Roles Seeded Successfully")