from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.schemas.notification import NotificationResponse
from app.services.notification_service import NotificationService

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get(
    "/",
    response_model=list[NotificationResponse]
)
def list_notifications(
    unread_only: bool = False,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = NotificationService(db)

    return service.list_for_user(int(token["sub"]), unread_only=unread_only)


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
