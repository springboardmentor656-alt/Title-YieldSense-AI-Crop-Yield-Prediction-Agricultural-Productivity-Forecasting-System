"""
YieldSense AI — User Service

Business logic for user profile operations.
"""

from app.firebase.firestore import get_firestore_client, USERS_COLLECTION
from app.utils.exceptions import NotFoundException
from app.utils.helpers import utc_now_iso


class UserService:
    """Handles user profile business logic."""

    def __init__(self):
        self.db = get_firestore_client()

    def get_profile(self, user_id: str) -> dict:
        """
        Get a user's profile from Firestore.

        Args:
            user_id: Firebase UID.

        Returns:
            User profile dictionary.
        """
        doc = self.db.collection(USERS_COLLECTION).document(user_id).get()

        if not doc.exists:
            raise NotFoundException(resource="User", resource_id=user_id)

        data = doc.to_dict()
        data["uid"] = user_id
        return data

    def update_profile(self, user_id: str, update_data: dict) -> dict:
        """
        Update a user's profile in Firestore.

        Args:
            user_id: Firebase UID.
            update_data: Dictionary of fields to update.

        Returns:
            Updated user profile dictionary.
        """
        doc_ref = self.db.collection(USERS_COLLECTION).document(user_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise NotFoundException(resource="User", resource_id=user_id)

        # Filter out None values and add timestamp
        filtered_data = {k: v for k, v in update_data.items() if v is not None}
        filtered_data["updated_at"] = utc_now_iso()

        doc_ref.update(filtered_data)

        # Return updated profile
        return self.get_profile(user_id)
