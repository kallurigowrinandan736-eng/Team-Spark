from fastapi import APIRouter
from typing import List
from app.data_loader import data_store
from app.schemas import RecommendationItem
from app.services.recommendations import generate_recommendations

router = APIRouter(prefix="/recommendations", tags=["Explainable AI Recommendations"])

@router.get("", response_model=List[RecommendationItem])
def get_recommendations():
    return generate_recommendations(
        data_store.reservoirs,
        data_store.canals,
        data_store.crops
    )
