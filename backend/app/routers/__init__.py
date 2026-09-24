from .health import router as health_router
from .predict import router as predict_router
from .model import router as model_router
from .data import router as data_router

__all__ = ["health_router", "predict_router", "model_router", "data_router"]
