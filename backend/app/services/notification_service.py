"""Notification service for YieldSense AI.

Persists and serves in-app notifications. Other services call
`create_for_user` to raise a notification (e.g. when a prediction
completes or a weather alert fires). Actual delivery to email/SMS/push
is a separate work stream and is out of scope here.
"""

from typing import List

from sqlalchemy.orm import Session

from app.core.exceptions import (
    PermissionDeniedException,
    ResourceNotFoundException,
)
from app.models.notification import Notification
from app.repositories.notification_repository import NotificationRepository


class NotificationService:

    def __init__(self, db: Session):
        self.db = db
        self.repo = NotificationRepository(db)

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
        unread_only: bool = False
    ) -> List[Notification]:

        return self.repo.get_by_user(user_id, unread_only=unread_only)

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
