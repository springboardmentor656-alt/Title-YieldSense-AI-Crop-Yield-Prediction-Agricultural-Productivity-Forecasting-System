from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.oauth2 import verify_token
from app.auth.permissions import admin_required
from app.database.session import get_db
from app.schemas.notification import (
    NotificationBroadcast,
    NotificationResponse,
    UnreadCountResponse,
)
from app.services.notification_service import NotificationService

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# NOTE: "/unread-count" must be registered before any route with a
# literal-looking dynamic segment could shadow it — kept as its own
# static path here so there's no ambiguity with "/{notification_id}/read".
@router.get(
    "/unread-count",
    response_model=UnreadCountResponse
)
def get_unread_count(
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = NotificationService(db)

    return {"unread_count": service.unread_count(int(token["sub"]))}


@router.get(
    "/",
    response_model=list[NotificationResponse]
)
def list_notifications(
    unread_only: bool = False,
    limit: Optional[int] = None,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = NotificationService(db)

    return service.list_for_user(
        int(token["sub"]), unread_only=unread_only, limit=limit
    )


@router.post(
    "/broadcast"
)
def broadcast_notification(
    request: NotificationBroadcast,
    token=Depends(admin_required),
    db: Session = Depends(get_db)
):
    """Raise a system-wide notification for every user (Administrator only)."""
    service = NotificationService(db)
    notified = service.broadcast(
        request.title, request.message, category=request.category
    )

    return {"notified": notified}


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse
)
def mark_notification_read(
    notification_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = NotificationService(db)

    return service.mark_read(notification_id, int(token["sub"]))


@router.patch(
    "/read-all"
)
def mark_all_notifications_read(
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = NotificationService(db)
    updated = service.mark_all_read(int(token["sub"]))

    return {"updated": updated}


@router.delete(
    "/{notification_id}"
)
def delete_notification(
    notification_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = NotificationService(db)
    service.delete(notification_id, int(token["sub"]))

    return {"detail": "Notification deleted."}
