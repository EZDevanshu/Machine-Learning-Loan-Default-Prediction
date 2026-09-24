from fastapi import APIRouter, HTTPException, status
from app.schemas.borrower import BorrowerFeatures
from app.schemas.prediction import RiskPredictionResponse
from app.ml.engine import ml_engine

from typing import Optional

router = APIRouter(tags=["ML Prediction"])

@router.post(
    "/predict",
    response_model=RiskPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Borrower Default Risk",
    description="Accepts 16 borrower features, runs calibrated Scikit-Learn classification using the active/best model (or requested model), and outputs risk tier with explainability factors."
)
def predict_risk(borrower: BorrowerFeatures, model_id: Optional[str] = None) -> RiskPredictionResponse:
    try:
        result = ml_engine.predict(borrower, model_id=model_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error in ML engine: {str(e)}"
        )
