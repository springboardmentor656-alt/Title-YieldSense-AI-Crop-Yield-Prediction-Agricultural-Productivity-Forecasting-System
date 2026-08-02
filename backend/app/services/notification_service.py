"""Notification service for YieldSense AI.

Persists and serves in-app notifications. Other services call
`create_for_user` to raise a notification (e.g. when a prediction
completes or a weather alert fires). Actual delivery to email/SMS/push
is a separate work stream and is out of scope here.
"""

from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.exceptions import (
    PermissionDeniedException,
    ResourceNotFoundException,
)
from app.models.notification import Notification
from app.repositories.notification_repository import NotificationRepository
from app.repositories.user_repository import UserRepository


class NotificationService:

    def __init__(self, db: Session):
        self.db = db
        self.repo = NotificationRepository(db)
        self.user_repo = UserRepository(db)

    def create_for_user(
        self,
        user_id: int,
        title: str,
        message: str,
        category: str = "system"
    ) -> Notification:

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            category=category
        )

        return self.repo.create(notification)

    def list_for_user(
        self,
        user_id: int,
        unread_only: bool = False,
        limit: Optional[int] = None
    ) -> List[Notification]:

        return self.repo.get_by_user(
            user_id, unread_only=unread_only, limit=limit
        )

    def unread_count(self, user_id: int) -> int:

        return self.repo.count_unread(user_id)

    def broadcast(self, title: str, message: str, category: str = "system") -> int:
        """Raise a system-wide notification for every user. Returns the count."""
        count = 0
        for user in self.user_repo.get_all():
            self.create_for_user(user.id, title, message, category=category)
            count += 1

        return count

    def mark_read(self, notification_id: int, user_id: int) -> Notification:

        notification = self.repo.get_by_id(notification_id)
        if notification is None:
            raise ResourceNotFoundException("Notification")

        if notification.user_id != user_id:
            raise PermissionDeniedException()

        return self.repo.mark_read(notification)

    def mark_all_read(self, user_id: int) -> int:

        return self.repo.mark_all_read(user_id)

    def delete(self, notification_id: int, user_id: int) -> None:

        notification = self.repo.get_by_id(notification_id)
        if notification is None:
            raise ResourceNotFoundException("Notification")

        if notification.user_id != user_id:
            raise PermissionDeniedException()

        self.repo.delete(notification)
