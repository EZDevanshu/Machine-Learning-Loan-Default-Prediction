from fastapi import APIRouter, HTTPException, status
from app.schemas.metrics import (
    ModelMetricsResponse,
    MultiModelComparisonResponse,
    SetActiveModelRequest,
    SetActiveModelResponse
)
from app.ml.engine import ml_engine, NUMERICAL_COLS, CATEGORICAL_COLS

router = APIRouter(prefix="/model", tags=["Model Metadata & Performance"])

@router.get(
    "/metrics",
    response_model=ModelMetricsResponse,
    summary="Get Primary Model Performance Metrics",
    description="Returns live validation metrics (Accuracy, Precision, Recall, F1, ROC-AUC, Log-Loss) and feature importance rankings for the primary champion model."
)
def get_metrics() -> ModelMetricsResponse:
    return ml_engine.get_metrics()

@router.get(
    "/comparison",
    response_model=MultiModelComparisonResponse,
    summary="Get Multi-Model Leaderboard Comparison",
    description="Returns benchmark metrics across all trained models (HistGradientBoosting, Random Forest, Decision Tree, Logistic Regression, KNN) and highlights the best performing model."
)
def get_models_comparison() -> MultiModelComparisonResponse:
    return ml_engine.get_models_comparison()

@router.get(
    "/all",
    response_model=MultiModelComparisonResponse,
    summary="Alias for Multi-Model Leaderboard Comparison",
    description="Alternative route for /comparison."
)
def get_models_all() -> MultiModelComparisonResponse:
    return ml_engine.get_models_comparison()

@router.post(
    "/set-active",
    response_model=SetActiveModelResponse,
    summary="Switch Active Model for Predictions",
    description="Sets the model to be used by default for inference. Pass 'best' to automatically use the highest-accuracy model."
)
def set_active_model(payload: SetActiveModelRequest) -> SetActiveModelResponse:
    try:
        return ml_engine.set_active_model(payload.modelId)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get(
    "/active",
    summary="Get Currently Active Prediction Engine",
    description="Returns details about which model is actively serving predictions."
)
def get_active_model():
    return ml_engine.get_active_model()

@router.get(
    "/pipeline",
    summary="Get ML Pipeline Specification",
    description="Returns pipeline architectural components, transformers, and classifier details."
)
def get_pipeline():
    return {
        "pipeline_name": "LoanGuard HistGradientBoosting Classifier",
        "framework": "Scikit-Learn",
        "preprocessing": {
            "numerical_transformer": "StandardScaler (mean=0, variance=1)",
            "numerical_features": NUMERICAL_COLS,
            "categorical_transformer": "OneHotEncoder (handle_unknown='ignore')",
            "categorical_features": CATEGORICAL_COLS
        },
        "classifier": {
            "algorithm": "HistGradientBoostingClassifier",
            "loss": "log_loss",
            "max_iter": 120,
            "learning_rate": 0.08,
            "max_leaf_nodes": 31
        },
        "target_variable": {
            "name": "Default",
            "type": "Binary (0: Non-Default, 1: Default)",
            "decision_threshold": 0.50
        }
    }

@router.get(
    "/features",
    summary="Get Input Features Contract",
    description="Returns the 16 model feature definitions with data types and expected ranges."
)
def get_features():
    return {
        "total_features": 16,
        "numerical_features": NUMERICAL_COLS,
        "categorical_features": CATEGORICAL_COLS,
        "excluded_features": ["LoanID (Identifier metadata, non-predictive)"]
    }
