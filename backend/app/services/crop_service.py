"""Crop management for YieldSense AI.

Crops belong to a farm; farm ownership (via FarmService.get_farm, which
already enforces the Administrator-bypass / owner-only rule) gates every
operation here so a user can't read or mutate crops on a farm they don't
own.
"""

from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.models.crop import Crop
from app.repositories.crop_repository import CropRepository
from app.schemas.crop import CropCreate, CropUpdate
from app.services.farm_service import FarmService


class CropService:

    def __init__(self, db: Session):
        self.db = db
        self.repo = CropRepository(db)
        self.farm_service = FarmService(db)

    def _resolve_owned_crop(self, crop_id: int, token: Dict[str, Any]) -> Crop:
        """Fetch a crop, enforcing that the caller owns its parent farm."""
        crop = self.repo.get_by_id(crop_id)
        if crop is None:
            raise ResourceNotFoundException("Crop")

        # Raises 404 if the farm doesn't exist or isn't owned by the caller.
        self.farm_service.get_farm(crop.farm_id, token)

        return crop

    def create_crop(self, token: Dict[str, Any], request: CropCreate) -> Crop:
        # Enforces farm ownership before allowing a crop to be attached.
        self.farm_service.get_farm(request.farm_id, token)

        crop = Crop(
            farm_id=request.farm_id,
            crop_name=request.crop_name,
            hectares_planted=request.hectares_planted,
        )

        return self.repo.create(crop)

    def list_for_farm(self, farm_id: int, token: Dict[str, Any]) -> List[Crop]:
        self.farm_service.get_farm(farm_id, token)

        return self.repo.get_by_farm(farm_id)

    def update_crop(
        self,
        crop_id: int,
        token: Dict[str, Any],
        request: CropUpdate
    ) -> Crop:
        crop = self._resolve_owned_crop(crop_id, token)

        if request.crop_name is not None:
            crop.crop_name = request.crop_name

        if request.hectares_planted is not None:
            crop.hectares_planted = request.hectares_planted

        return self.repo.update(crop)

    def delete_crop(self, crop_id: int, token: Dict[str, Any]) -> None:
        crop = self._resolve_owned_crop(crop_id, token)

        self.repo.delete(crop)
