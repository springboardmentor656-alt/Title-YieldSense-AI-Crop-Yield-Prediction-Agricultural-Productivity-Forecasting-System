from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, notification: Notification) -> Notification:

        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)

        return notification

    def get_by_id(self, notification_id: int) -> Optional[Notification]:

        return (
            self.db.query(Notification)
            .filter(Notification.id == notification_id)
            .first()
        )

    def get_by_user(
        self,
        user_id: int,
        unread_only: bool = False,
        limit: Optional[int] = None
    ) -> List[Notification]:

        query = (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id)
        )

        if unread_only:
            query = query.filter(Notification.is_read.is_(False))

        query = query.order_by(Notification.created_at.desc())

        if limit is not None:
            query = query.limit(limit)

        return query.all()

    def mark_read(self, notification: Notification) -> Notification:

        notification.is_read = True

        self.db.commit()
        self.db.refresh(notification)

        return notification

    def mark_all_read(self, user_id: int) -> int:

        updated = (
            self.db.query(Notification)
            .filter(
                Notification.user_id == user_id,
                Notification.is_read.is_(False)
            )
            .update({"is_read": True}, synchronize_session=False)
        )

        self.db.commit()

        return updated

    def delete(self, notification: Notification) -> None:

        self.db.delete(notification)
        self.db.commit()
